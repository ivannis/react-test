import { combineReducers } from 'redux';
import { join, all, fork } from 'redux-saga/effects';

function typeValue(namespace, store, type) {
    return `${namespace}/${store}/${type}`
}

function zipObject (keys, values) {
    if (arguments.length == 1) {
        values = keys[1];
        keys = keys[0];
    }

    var result = {};
    var i = 0;

    for (i; i < keys.length; i += 1) {
        result[keys[i]] = values[i];
    }

    return result;
};

function buildTypes(namespace, store, types) {
    return zipObject(
        types,
        types.map(type => typeValue(namespace, store, type))
    )
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isFunction(func){
    return func !== null && typeof func === 'function';
}

function isUndefined(value){
    return typeof value === 'undefined' || value === undefined;
}

function isPlainObject(obj) {
    return isObject(obj) && (
        obj.constructor === Object  // obj = {}
        || obj.constructor === undefined // obj = Object.create(null)
    );
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if(Array.isArray(target)) {
        if(Array.isArray(source)) {
            target.push(...source);
        } else {
            target.push(source);
        }
    } else if(isPlainObject(target)) {
        if(isPlainObject(source)) {
            for(let key of Object.keys(source)) {
                if(!target[key]) {
                    target[key] = source[key];
                } else {
                    mergeDeep(target[key], source[key]);
                }
            }
        } else {
            throw new Error(`Cannot merge object with non-object`);
        }
    } else {
        target = source;
    }

    return mergeDeep(target, ...sources);
};

function assignDefaults(options) {
    return {
        ...options,
        consts: options.consts || {},
        actions: options.actions || (() => ({})),
        selectors: options.selectors || {},
        types: options.types || [],
        modules: options.modules || [],
        reducer: options.reducer || ((state) => (state)),
        sagas: options.sagas || ((module, parentModule) => ({
            rootSaga: function *rootSaga() {
                if (module.modules.length > 0) {
                    yield all(module.modules.map(module => fork(module.sagas.rootSaga)));
                }
            },
            startUpSaga: function *startUpSaga(config) {
                if (module.modules.length > 0) {
                    const tasks = yield all(module.modules.map(module => fork(module.sagas.startUpSaga, config)));
                    yield join(...tasks);
                }
            }
        }))
    }
}

function injectModule(input, module) {
    if (input instanceof Function) {
        return input(module)
    } else {
        return input
    }
}

/**
 * Helper utility to assist in composing the selectors.
 * Previously defined selectors can be used to derive future selectors.
 *
 * @param {object} selectors
 * @returns
 */
function deriveSelectors(selectors) {
    const composedSelectors = {}
    Object.keys(selectors).forEach(key => {
        const selector = selectors[key]
        if(selector instanceof Selector) {
            composedSelectors[key] = (...args) =>
                (composedSelectors[key] = selector.extractFunction(composedSelectors))(...args)
        }
        else {
            composedSelectors[key] = selector
        }
    })
    return composedSelectors
}

export default class Module {
    constructor(options) {
        options = assignDefaults(options)
        const {
            namespace,
            store,
            types,
            consts,
            initialState,
            actions,
            selectors,
            sagas,
            modules
        } = options
        this.options = options
        Object.keys(consts).forEach(name => {
            this[name] = zipObject(consts[name], consts[name])
        })

        this.store = store
        this.types = buildTypes(namespace, store, types)
        this.initialState = isFunction(initialState)
            ? initialState(this)
            : initialState
        this.reducer = this.reducer.bind(this)
        this.selectors = deriveSelectors(injectModule(selectors, this))
        this.actions = actions(this)
        this.sagas = sagas(this)
        this.modules = modules
        this.modules.forEach((module) => {
            module.parent = this;

            this.types[module.store] = module.types;
            this.actions[module.store] = module.actions;
            this.selectors[module.store] = module.selectors;
        });

        this.modulesReducer = this.modules.length > 0 && combineReducers(this.reducers(this.modules));
    }

    select(state, selector?) {
        const realState = (this.parent ? this.parent.select(state) : state)[this.store];

        return selector ? selector(realState) : realState;
    }

    reducer(state, action) {
        if (isUndefined(state)) {
            state = this.initialState
        }

        // apply in me
        let actualState = this.options.reducer(state, action, this)
        if (this.modulesReducer) {
            return {
                ...actualState,
                ...this.modulesReducer(
                    this.modulesState(state, this.modules),
                    action
                ),
            };
        }

        return actualState;
    }

    reducers(modules) {
        return modules.reduce(
            (reducersMap, module) => ({
                ...reducersMap,
                [module.store]: module.reducer,
            }),
            {},
        )
    }

    modulesState(state, modules) {
        return modules.reduce(
            (actualState, module) => ({
              ...actualState,
              [module.store]: state[module.store],
            }),
            {},
          )
    }

    extend(options) {
        if (isFunction(options)) {
            options = options(this)
        }
        options = assignDefaults(options)
        const parent = this.options
        // const modules = options.modules || []
        const modules = mergeDeep([], parent.modules, options.modules)
        let initialState
        if (isFunction(options.initialState)) {
            initialState = module => options.initialState(module, this.initialState)
        } else if (isUndefined(options.initialState)) {
            initialState = parent.initialState
        } else {
            initialState = options.initialState
        }

        return new Module({
            ...parent,
            ...options,
            initialState,
            consts: mergeDeep({}, parent.consts, options.consts),
            actions: module => {
                const parentActions = parent.actions(module)
                return { ...parentActions, ...options.actions(module, parentActions) }
            },
            selectors: (module) => ({ ...injectModule(parent.selectors, module), ...injectModule(options.selectors, module) }),
            types: [...parent.types, ...options.types],
            reducer: parent.reducer,            
            modules: modules,
            sagas: module => {
                const parentSagas = parent.sagas(module)

                return { ...parentSagas, ...options.sagas(module, parentSagas) }
            },
        })
    }
}

export class Selector {
    constructor(func) {
        this.func = func
    }

    extractFunction(selectors) {
        return this.func(selectors)
    }
}

export const createAction =  (type, payload) => ({
    type,
    ...payload ? { payload } : {},
    ...payload instanceof Error ? { error: true } : {},
});

Module.Selector = Selector
Module.createAction = createAction
import Module from './Module'
import { all, take, call, put, fork } from 'redux-saga/effects';

export default function createModule({ namespace, store, initialState={ data: [] } }) {
    return new Module({
        namespace, store,

        types: ['FETCH', 'FETCH_SUCCESS',  'FETCH_FAILURE', 'POST', 'POST_SUCCESS',  'POST_FAILURE'],

        reducer: (state, action, { types }) => {
            switch(action.type) {
                case types.FETCH:
                case types.POST:
                    return {
                        ...state,
                        loading: true,
                        error: undefined,
                    };
                case types.FETCH_SUCCESS:
                case types.POST_SUCCESS:
                    return {
                        ...state,
                        data: action.payload,
                        loading: false,
                    };
                case types.FETCH_FAILURE:
                case types.POST_FAILURE:
                    return {
                        ...state,
                        loading: false,
                        error: action.payload,
                    };
                default:
                    return state
            }
        },

        selectors: (module) => ({
            data: (state) => module.select(state, (localState) => localState.data),
            isLoading: (state) => module.select(state, (localState) => localState.loading),
            error: state => module.select(state, localState => localState.error)
        }),

        actions: (module) => ({
            fetch: (payload?) => Module.createAction(module.types.FETCH, payload),
            post: (payload?) => Module.createAction(module.types.POST, payload)
        }),

        initialState: () => ({
            ...initialState,
            loading: false,
            error: undefined,
        })
    }).extend({
        sagas: (module, parentModule) => ({
            rootSaga: function * rootSaga() {
                yield all([
                    fork(parentModule.rootSaga),
                    fork(module.sagas.watchFetch),
                    fork(module.sagas.watchPost)
                ]);
            },
            doFetch: function *doFetch() {
                throw new Error('Not implemented method');
            },
            doPost: function *doPost() {
                throw new Error('Not implemented method');
            },
            watchFetch: function *watchFetch() {
                let action;
                do {
                    action = yield take(module.types.FETCH);

                    try {
                        const data = yield call(module.sagas.doFetch, action.payload );
                        yield put(Module.createAction(module.types.FETCH_SUCCESS, data));
                    } catch (error) {
                        yield put(Module.createAction(module.types.FETCH_FAILURE, error));
                    }
                } while (action);
            },
            watchPost: function *watchPost() {
                let action;
                do {
                    action = yield take(module.types.POST);

                    try {
                        const data = yield call(module.sagas.doPost, action.payload );
                        yield put(Module.createAction(module.types.POST_SUCCESS, data));
                    } catch (error) {
                        yield put(Module.createAction(module.types.POST_FAILURE, error));
                    }
                } while (action);
            }
        })
    })
}
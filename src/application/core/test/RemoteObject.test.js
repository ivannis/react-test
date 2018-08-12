import { expect } from 'chai';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import moduleTest from './Module.test';
import Module from "../Module";

export const actionsTest = (module, fetchPayload?) => {
    describe('Actions action test', () => {
        it(`should create ${module.types.FETCH} action`, () => {
            const action = module.actions.fetch(fetchPayload);

            expect(action).to.deep.equal(Module.createAction(module.types.FETCH, fetchPayload));
        });
    });
};

export const selectorsTest = (module, data) => {
    describe('Selector test', () => {
        it('should select data from store', () => {
            const state = { [module.store]: { ...module.initialState, data } };
            expect(module.selectors.data(state)).to.be.deep.equal(data);
        });

        it('should select error from store', () => {
            const error = new Error();
            const state = { [module.store]: { ...module.initialState, error } };
            expect(module.selectors.error(state)).to.be.deep.equal(error);
        });

        it('should select loading from store', () => {
            const state = { [module.store]: { ...module.initialState, loading: true } };
            expect(module.selectors.isLoading(state)).to.be.equal(true);
        });
    });
};

export const reducerTest = (module, data, fetchPayload) => {
    describe('Reducer test', () => {
        let action;
        let saga;
        let dataProvider;

        beforeAll(() => {
            action = module.actions.fetch(fetchPayload);
            dataProvider = [matchers.call.fn(module.sagas.doFetch), data];
        });

        beforeEach(() => {
            saga = expectSaga(module.sagas.rootSaga).withReducer(module.reducer, module.initialState);
        });

        it(`should put data in the store when ${module.types.FETCH_SUCCESS} action is dispatched`, async () => {
            const { storeState } = await saga
                .provide([dataProvider])
                .dispatch(action)
                .silentRun()
            ;

            expect(storeState).to.be.deep.equal({
                data,
                loading: false,
                error: undefined,
            });
        });

        it(`should put error in the store when ${module.types.FETCH_FAILURE} action is dispatched`, async () => {
            const error = new Error('Fetch failure');
            const { storeState } = await saga
                .provide({
                    call(effect, next) {
                        if (effect.fn === module.sagas.doFetch) {
                            throw error;
                        }
                        return next();
                    },
                })
                .dispatch(action)
                .silentRun();

            expect(storeState).to.be.deep.equal({
                ...module.initialState,
                loading: false,
                error,
            });
        });

        it(`should put loading to true in the store when ${module.types.FETCH} action is dispatched`, async () => {
            const { storeState } = await saga
                .provide({
                    call(effect, next) {
                        if (effect.fn === module.sagas.doFetch) {
                            return new Promise(() => {}); // never resolved
                        }
                        return next();
                    },
                })
                .dispatch(action)
                .silentRun();

            expect(storeState).to.be.deep.equal({
                ...module.initialState,
                loading: true,
            });
        });
    });
};

export const sagaTest = (module, data, fetchPayload?) => {
    describe('Saga test', () => {
        let action: Action;
        beforeAll(() => {
            action = module.actions.fetch(fetchPayload);
        });

        it(`should handle ${module.types.FETCH} action`, () => (
            expectSaga(module.sagas.rootSaga)
                .provide([
                    [matchers.call.fn(module.sagas.doFetch), data],
                ])
                .take(module.types.FETCH)
                .put(Module.createAction(module.types.FETCH_SUCCESS, data))
                .dispatch(action)
                .silentRun()
        ));

        it(`should dispatch ${module.types.FETCH_FAILURE} action`, () => (
            expectSaga(module.sagas.rootSaga)
                .provide({
                    call(effect, next) {
                        if (effect.fn === module.sagas.doFetch) {
                            throw new Error('Fetch failure');
                        }
                        return next();
                    },
                })
                .take(module.types.FETCH)
                .put(Module.createAction(module.types.FETCH_FAILURE, new Error('Fetch failure')))
                .dispatch(action)
                .silentRun()
        ));
    });
};

export default (module, data, fetchPayload?) => {
    moduleTest(module);
    actionsTest(module, fetchPayload);
    selectorsTest(module, data);
    reducerTest(module, data, fetchPayload);
    sagaTest(module, data, fetchPayload);
};

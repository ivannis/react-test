import { all, take, call, put, fork, select } from "redux-saga/effects";
import Module from '../core/Module'
import { query } from '../core/effects';
import gql from './gql';
import Repository from '../../domain/Repository';
import Language from '../../domain/Language';

export default new Module({
    namespace: 'repository', 
    store: 'list',    
    types: [
        'CHANGE_ORGANIZATION', 'FETCH', 'FETCH_SUCCESS',  'FETCH_FAILURE'
    ],     
    initialState: {
        organization: undefined,
        items: [],
        order: { "field": "STARGAZERS", "direction": "DESC" },
        cursor: undefined,
        totalCount: 0,
        loading: false,        
        error: undefined
    },        

    reducer: (state, action, { types, initialState }) => {
        switch(action.type) {
            case types.CHANGE_ORGANIZATION:
                return {
                    ...initialState,
                    organization: action.payload               
                };
            case types.FETCH:
                return {
                    ...state,
                    loading: true,
                    error: undefined,
                };
            case types.FETCH_SUCCESS:
                return {
                    ...state,
                    items: [ 
                        ...state.items, 
                        ...action.payload.edges.map(
                            item => new Repository(
                                item.node.id, 
                                item.node.name, 
                                item.node.description,
                                item.node.forkCount,
                                item.node.primaryLanguage ? new Language(item.node.primaryLanguage.name, item.node.primaryLanguage.color) : undefined
                            )
                        )
                    ],
                    cursor: action.payload.pageInfo.endCursor,
                    totalCount: action.payload.totalCount,
                    loading: false,
                };
            case types.FETCH_FAILURE:
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
        organization: (state) => module.select(state, (localState) => localState.organization),
        items: (state) => module.select(state, (localState) => localState.items),
        order: (state) => module.select(state, (localState) => localState.order),        
        cursor: (state) => module.select(state, (localState) => localState.cursor),
        totalCount: (state) => module.select(state, (localState) => localState.totalCount),
        isLoading: (state) => module.select(state, (localState) => localState.loading),
        error: state => module.select(state, localState => localState.error)
    }),

    actions: (module) => ({
        changeOrganization: (organization) => Module.createAction(module.types.CHANGE_ORGANIZATION, organization),
        loadMore: ({first=20, after}={}) => Module.createAction(module.types.FETCH, { first, after })
    }),

}).extend({
    sagas: (module, parentModule) => ({
        rootSaga: function *rootSaga() {
            yield all([
                fork(parentModule.rootSaga),
                fork(module.sagas.watchFetch)
            ]);
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
        doFetch: function *doFetch({ first, after }) {              
            const state = yield select();
            const order = module.selectors.order(state);
            const organization = module.selectors.organization(state);

            if (organization == undefined) {
                throw new Error('The organization must be valid')
            }

            const data = yield query(
                gql.queries.repositories, {
                    "organization": organization,
                    "order": order,
                    "first": first,
                    "after": after
                }
            )           

            return data.organization.repositories;
        }
    })
})

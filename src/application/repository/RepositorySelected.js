import { all, call, put, take, fork, spawn, select } from "redux-saga/effects";
import Module from '../core/Module'
import { query } from '../core/effects';
import gql from './gql';
import Repository from '../../domain/Repository';
import RepositoryContributorList from './RepositoryContributorList';
import Language from '../../domain/Language';

export default new Module({
    namespace: 'repository', 
    store: 'selected',        
    types: [
        'SET_ORGANIZATION', 'FETCH', 'FETCH_SUCCESS',  'FETCH_FAILURE'
    ],    
    modules: [
        RepositoryContributorList
    ], 
    initialState: {
        organization: undefined,
        item: undefined,
        order: { "field": "SIZE", "direction": "DESC" },
        loading: false,
        error: undefined
    },            
    reducer: (state, action, { types, initialState }) => {
        switch(action.type) {
            case types.SET_ORGANIZATION:
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
                    item: new Repository(
                        action.payload.id, 
                        action.payload.name, 
                        action.payload.description,
                        action.payload.forkCount,
                        action.payload.primaryLanguage ? new Language(action.payload.primaryLanguage.name, action.payload.primaryLanguage.color) : undefined,
                        action.payload.languages.nodes.map(item => new Language(item.name, item.color)),                        
                    ),
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
        item: (state) => module.select(state, (localState) => localState.item),
        order: (state) => module.select(state, (localState) => localState.order),        
        isLoading: (state) => module.select(state, (localState) => localState.loading),
        error: (state) => module.select(state, localState => localState.error ? localState.error.graphQLErrors : undefined)
    }),

    actions: (module) => ({
        setOrganization: (organization) => Module.createAction(module.types.SET_ORGANIZATION, organization),
        load: (name) => Module.createAction(module.types.FETCH, name),
        loadMoreContributors: (name) => Module.createAction(RepositoryContributorList.types.FETCH, name)
    }),

}).extend({
    sagas: (module, parentModule) => ({
        rootSaga: function *rootSaga() {
            yield all([                                
                fork(parentModule.rootSaga),
                spawn(module.sagas.watchFetch),
                // spawn(module.sagas.watchFetchContributors)               
            ]);
        },        
        watchFetch: function *watchFetch() {
            let action;
            do {
                action = yield take(module.types.FETCH);

                try {
                    const data = yield call(module.sagas.doFetch, action.payload);
                    yield put(Module.createAction(module.types.FETCH_SUCCESS, data));

                    // reset contributors
                    yield put(Module.createAction(RepositoryContributorList.types.RESET))
                    yield put(module.actions.loadMoreContributors(action.payload))
                } catch (error) {
                    yield put(Module.createAction(module.types.FETCH_FAILURE, error));
                }
            } while (action);
        },
        doFetch: function *doFetch(name) {    
            const state = yield select();            
            const order = module.selectors.order(state);
            const organization = module.selectors.organization(state);
                  
            if (organization == undefined) {
                throw new Error('The organization must be valid')
            }

            const data = yield query(
                gql.queries.repository, {
                    "owner": organization,
                    "order": order,
                    "name": name
                }
            )  

            return data.repository;            
        }
    })
})

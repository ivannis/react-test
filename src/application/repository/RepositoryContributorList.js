import Module from '../core/Module'
import { query } from '../core/effects';
import { all, take, call, put, fork, spawn, select } from "redux-saga/effects";
import gql from './gql';
import User from '../../domain/User';

export default new Module({
    namespace: 'selected', 
    store: 'contributors',    
    types: [
        'SET_ORGANIZATION', 'RESET', 'FETCH', 'FETCH_SUCCESS',  'FETCH_FAILURE'
    ],     
    initialState: {
        organization: undefined,
        items: [],
        cursor: undefined,
        totalCount: 0,
        loading: false,
        error: undefined
    },        

    reducer: (state, action, { types, initialState }) => {
        switch(action.type) {
            case types.RESET:
                return {
                    ...initialState,
                    organization: state.organization
                };
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
                    items: [ 
                        ...state.items, 
                        ...action.payload.map(
                            item => new User(item.id, item.login, item.avatar_url, item.contributions)
                        )
                    ],
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
        cursor: (state) => module.select(state, (localState) => localState.cursor),
        totalCount: (state) => module.select(state, (localState) => localState.totalCount),
        isLoading: (state) => module.select(state, (localState) => localState.loading),
        error: state => module.select(state, localState => localState.error)
    }),

    actions: (module) => ({
        reset: () => Module.createAction(module.types.RESET),      
        setOrganization: (organization) => Module.createAction(module.types.SET_ORGANIZATION, organization),
        loadMore: (name) => Module.createAction(module.types.FETCH, name)        
    }),

}).extend({
    sagas: (module, parentModule) => ({
        rootSaga: function *rootSaga() {
            yield all([
                fork(parentModule.rootSaga),
                spawn(module.sagas.watchFetch)
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
        doFetch: function *doFetch(name) {  
            const state = yield select();
            const organization = module.selectors.organization(state);

            if (organization == undefined) {
                throw new Error('The organization must be valid')
            }

            const data = yield query(gql.queries.contributors, { 
                "owner": organization,
                "name": name
            })

            return data.contributors;            
        }
    })
})

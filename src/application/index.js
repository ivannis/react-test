import { all, take, call, put, fork, select, takeEvery } from "redux-saga/effects";
import Module from './core/Module'
import Organization from './organization'
import Locale from './system/locale'
import Repository from './repository'

const App = new Module({
    namespace: 'xapo', store: 'github',
    initialState: {}
}).extend({
    modules: [
        Organization,
        Repository,
        Locale
    ],
    sagas: (module, parentModule) => ({
        rootSaga: function *rootSaga() {
            yield all([
                fork(parentModule.rootSaga),
                takeEvery(Organization.types.SWITCH, module.sagas.resetOrganization)
            ]);
        },
        startUpSaga: function *startUpSaga() {
            // Loading the repository list from the server side
            const state = yield select();
            const organization = Organization.selectors.current(state);

            yield call(module.sagas.resetOrganization, { payload: organization});
        },        
        resetOrganization: function *resetOrganization(action) {
            yield put(Repository.actions.list.changeOrganization(action.payload.name));
            yield put(Repository.actions.selected.setOrganization(action.payload.name));
            yield put(Repository.actions.selected.contributors.setOrganization(action.payload.name));

            yield put(Repository.actions.list.loadMore());
        }
    })
});

export default App;

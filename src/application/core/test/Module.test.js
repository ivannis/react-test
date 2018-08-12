import { expectSaga } from 'redux-saga-test-plan';

export default (module) => {
    it('should forked all sub module root sagas', () => {
        const saga = expectSaga(module.sagas.rootSaga);
        module.modules.forEach((item) => {
            saga.fork(item.sagas.rootSaga);
        });

        return saga.silentRun();
    });

    it('should forked all sub module startUp sagas', () => {
        const saga = expectSaga(module.sagas.startUpSaga);
        module.modules.forEach((item) => {
            saga.fork(item.sagas.startUpSaga);
        });

        return saga.silentRun();
    });
};

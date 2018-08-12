import { call } from 'redux-saga/effects';
import context from './context';

function* handleQuery(options) {
    const client = yield context('client');
    const response = yield call(client.query, options);

    return yield response.data;
}

export default function queryEffect(query, variables?, options?) {
    return call(handleQuery, { query, variables, ...options });
}

import { call } from 'redux-saga/effects';
import context from './context';

function* handleMutation(options) {
    const client = yield context('client');
    const response = yield call(client.mutate, options);

    return yield response.data;
}

export default function mutationEffect(mutation, variables?, options?) {
    return call(handleMutation, { mutation, variables, ...options });
}

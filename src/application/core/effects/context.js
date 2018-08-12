import { getContext } from 'redux-saga/effects';

export default function context(name) {
    return getContext(name);
}

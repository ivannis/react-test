import Module from "../../core/Module";

const Locale = new Module({
    namespace: 'github', store: 'locale',
    types: ['SWITCH'],
    reducer: (state, action, { types }) => {
        switch(action.type) {
            case types.SWITCH:
                return {
                    ...state,
                    current: action.payload
                };
            default:
                return state
        }
    },
    selectors: (module) => ({
        current: (state) => module.select(state, (localState) => localState.current),
        locales: (state) => module.select(state, (localState) => localState.locales),
    }),
    actions: ({ types }) => ({
        switch:  (locale) => ({ type: types.SWITCH, payload: locale })
    }),
    initialState: {
        current: { id: 1, name: 'English', code: 'en_US'},
        locales: [
            { id: 1, name: 'English', code: 'en_US'},
            { id: 2, name: 'Español', code: 'es'}
        ]
    }
})

export default Locale;
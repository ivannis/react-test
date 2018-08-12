import Module from "../core/Module";

const Organization = new Module({
    namespace: 'github', store: 'organization',
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
        organizations: (state) => module.select(state, (localState) => localState.organizations),
    }),
    actions: ({ types }) => ({
        switch:  (organization) => ({ type: types.SWITCH, payload: organization })
    }),
    initialState: {
        current: { name: 'facebook'},
        organizations: [
            { name: 'facebook' },
            { name: 'twitter' },
            { name: 'google' },
            { name: 'github' }
        ]
    }
})

export default Organization;
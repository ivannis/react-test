import { expect } from 'chai';
import moduleTest from '../../core/test/Module.test';
import Module from "../../core/Module";
import Organization from '../index';

export const actionsTest = (module, fetchPayload?) => {
    describe('Actions action test', () => {
        it(`should create ${module.types.SWITCH} action`, () => {
            const action = module.actions.switch(fetchPayload);

            expect(action).to.deep.equal(Module.createAction(module.types.SWITCH, fetchPayload));
        });
    });
};

export const selectorsTest = (module, current, organizations) => {
    describe('Selector test', () => {
        it('should select current from store', () => {
            const state = { [module.store]: { ...module.initialState, current } };
            expect(module.selectors.current(state)).to.be.deep.equal(current);
        });

        it('should select organizations from store', () => {
            const state = { [module.store]: { ...module.initialState, organizations } };
            expect(module.selectors.organizations(state)).to.be.deep.equal(organizations);
        });
    });
};

export const testSuite = (module, data, fetchPayload) => {
    moduleTest(module);
    actionsTest(module, fetchPayload);
    selectorsTest(module, data);
};

describe('Organization tests', () => {
    testSuite(
        Organization, 
        { name: 'facebook' }, 
        { name: 'github' }, 
        [
            { name: 'facebook' },
            { name: 'twitter' },
            { name: 'google' },
            { name: 'github' }
        ]
    )
});

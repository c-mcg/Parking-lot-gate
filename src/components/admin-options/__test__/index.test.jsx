import React from 'react'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { shallowWithStore  } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';


import sha256 from 'sha256'
import {salt} from '../../../util/constants'

import AdminOptions from '../index'

function createShallow(state) {
    return shallowWithStore(<AdminOptions/>, createMockStore(state)).dive({context: state});
}

test('AdminOptions constructor', () => {
    const adminOptions = createShallow({adminPassword: null})

    expect(adminOptions.state().settingPassword).toBe(true)
})

test('AdminOptions set password', () => {
    const password = "test" ;   

    var state = {
        adminPassword: null
    }

    const adminOptions = createShallow(state);
    const instance = adminOptions.instance();

    expect(adminOptions.find('[name="password"]').length).toBe(1);
    expect(adminOptions.find('[name="passwordConfirm"]').length).toBe(1);
    expect(adminOptions.find('[text="Set password"]').length).toBe(1);

    instance.setAdminPassword({
        password,
        passwordConfirm: ""
    })

    expect(adminOptions.state().error).toBeTruthy();

    instance.setAdminPassword({
        password,
        passwordConfirm: "te"
    })

    expect(adminOptions.state().error).toBeTruthy();

    var passHash = instance.setAdminPassword({
        password,
        passwordConfirm: password
    })

    expect(adminOptions.state().error).not.toBeTruthy();
    expect(adminOptions.state().settingPassword).toBe(false);
    expect(adminOptions.state().currentPassword).toBe(passHash);

})

test('AdminOptions toggle change password', () => {
    var password = sha256(salt + "test");
    var state = {
        adminPassword: password
    }

    const adminOptions = createShallow(state);

    expect(adminOptions.state().currentPassword).toBe(null);
    expect(adminOptions.state().settingPassword).toBe(false);

    var passField = adminOptions.find('[name="password"]');
    var submitButton = adminOptions.find('[text="Submit"]');
    expect(passField.length).toBe(1)
    expect(submitButton.length).toBe(1)
    
    adminOptions.instance().onValidatePassword({
        password: "test"
    })

    var changePassButton = adminOptions.find('[text="Change password"]');
    expect(changePassButton.length).toBe(1);

    changePassButton.simulate('click');
    expect(adminOptions.state().settingPassword).toBe(true);

    var cancelButton = adminOptions.find('[text="Cancel"]');
    expect(cancelButton.length).toBe(1);

    cancelButton.simulate('click');
    expect(adminOptions.state().settingPassword).toBe(false);
})
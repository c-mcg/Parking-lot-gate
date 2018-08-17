import React from 'react'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { shallowWithStore  } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

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
    var state = {
        adminPassword: "test"
    }

    const adminOptions = createShallow(state);
    const instance = adminOptions.instance();

    expect(adminOptions.state().settingPassword).toBe(false);

    instance.openChangePassword();
    expect(adminOptions.state().settingPassword).toBe(true);

    instance.closeChangePassword();
    expect(adminOptions.state().settingPassword).toBe(false);
})
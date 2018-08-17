import React from 'react'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { shallowWithStore  } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

import LeaveOptions from '../index'

function createShallow(state, store=null) {
    return shallowWithStore(<LeaveOptions/>, store ? store : createMockStore(state)).dive({context: state});
}

test('LeaveOptions onUploadClicked', () => {
    var leaveOptions = createShallow({
        scanning: true
    })

    var instance = leaveOptions.instance();

    instance.onUploadClicked();

    expect(leaveOptions.state().scanning).toBe(false);
})

test('LeaveOptions onScanClicked', () => {
    var leaveOptions = createShallow({
        scanning: true
    })

    var instance = leaveOptions.instance();

    instance.onScanClicked();
    expect(leaveOptions.state().scanning).toBe(true);

    instance.onScanClicked();
    expect(leaveOptions.state().scanning).toBe(false);
})

test('LeaveOptions onBarcodeScanned', () => {
    const validId = "123";

    var leaveOptions = createShallow({
        tickets: {123: "mockTicket"},
        scanning: true,
    })

    var instance = leaveOptions.instance();

    instance.onBarcodeScanned({codeResult: {code: false}});
    expect(leaveOptions.state().scanning).toBe(false);
    expect(leaveOptions.state().scanError).toBeTruthy();

    instance.onBarcodeScanned({codeResult: {code: validId}});
    expect(leaveOptions.state().scanError).not.toBeTruthy();

})

test('LeaveOptions onScanClicked', () => {
    const validId = "123";

    var leaveOptions = createShallow({
        tickets: {123: "mockTicket"},
    })

    leaveOptions.instance().onScanClicked();
    expect(leaveOptions.state().scanning).toBe(true);
})

test('LeaveOptions onSubmitPayment', () => {
    const validId = "123";

    var leaveOptions = createShallow({
        tickets: {123: "mockTicket"},
    })

    var instance = leaveOptions.instance();

    var testData = [
        {
            data: {
                name: ""
            },
            error: true
        },
        {
            data: {
                name: "test",
                cardNumber: "123"
            },
            error: true
        },{
            data: {
                name: "test",
                cardNumber: "1111222233334444",
                securityCode: "1"
            },
            error: true
        },{
            data: {
                name: "test",
                cardNumber: "1111222233334444",
                securityCode: "123"
            },
            error: false
        }
    ]

    testData.forEach((call) => {
        instance.onSubmitPayment(call.data);
        var error = leaveOptions.state().paymentError;

        if (call.error) {
            expect(error).toBeTruthy();
        } else {
            expect(error).not.toBeTruthy();
            expect(leaveOptions.state().submittingPayment).toBe(true);
        }
        leaveOptions.setState({
            paymentError: false
        })
    })
})
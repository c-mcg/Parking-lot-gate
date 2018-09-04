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

    var uploadTicketButton = leaveOptions.find('[text="Upload ticket"]');
    expect(uploadTicketButton.length).toBe(1);

   
    uploadTicketButton.simulate('click');
    expect(leaveOptions.state().scanning).toBe(false);
})

test('LeaveOptions onScanClicked', () => {
    var leaveOptions = createShallow({
        scanning: true
    })

    var scanTicketButton = leaveOptions.find('[text="Scan ticket"]');
    expect(scanTicketButton.length).toBe(1);

    scanTicketButton.simulate('click');
    expect(leaveOptions.state().scanning).toBe(true);

    scanTicketButton.simulate('click');
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

test('LeaveOptions onSubmitPayment', () => {

    var leaveOptions = createShallow()
    var ticket = {
        rate: 0
    }

    leaveOptions.setProps({
        ticket
    });

    expect(leaveOptions.find('[name="name"]').length).toBe(1);
    expect(leaveOptions.find('[name="cardNumber"]').length).toBe(1);
    expect(leaveOptions.find('[name="securityCode"]').length).toBe(1);
    expect(leaveOptions.find('[text="Pay ticket"]').length).toBe(1);

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
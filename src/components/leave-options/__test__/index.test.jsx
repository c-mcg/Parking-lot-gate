/* global
    expect, test
*/

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
    const leaveOptions = createShallow({
        scanning: true
    })

    const uploadTicketButton = leaveOptions.find('[text="Upload ticket"]');

    expect(uploadTicketButton.length).toBe(1);


    uploadTicketButton.simulate('click');
    expect(leaveOptions.state().scanning).toBe(false);
})

test('LeaveOptions onScanClicked', () => {
    const leaveOptions = createShallow({
        scanning: true
    })

    const scanTicketButton = leaveOptions.find('[text="Scan ticket"]');

    expect(scanTicketButton.length).toBe(1);

    scanTicketButton.simulate('click');
    expect(leaveOptions.state().scanning).toBe(true);

    scanTicketButton.simulate('click');
    expect(leaveOptions.state().scanning).toBe(false);
})

test('LeaveOptions onBarcodeScanned', () => {
    const validId = "123";

    const leaveOptions = createShallow({
        tickets: {123: "mockTicket"},
        scanning: true,
    })

    const instance = leaveOptions.instance();

    instance.onBarcodeScanned({codeResult: {code: false}});
    expect(leaveOptions.state().scanning).toBe(false);
    expect(leaveOptions.state().scanError).toBeTruthy();

    instance.onBarcodeScanned({codeResult: {code: validId}});
    expect(leaveOptions.state().scanError).not.toBeTruthy();

})

test('LeaveOptions onSubmitPayment', () => {

    const leaveOptions = createShallow()
    const ticket = {
        rate: 0
    }

    leaveOptions.setProps({
        ticket
    });

    expect(leaveOptions.find('[name="name"]').length).toBe(1);
    expect(leaveOptions.find('[name="cardNumber"]').length).toBe(1);
    expect(leaveOptions.find('[name="securityCode"]').length).toBe(1);
    expect(leaveOptions.find('[text="Pay ticket"]').length).toBe(1);

    const instance = leaveOptions.instance();

    const testData = [
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
        },
{
            data: {
                name: "test",
                cardNumber: "1111222233334444",
                securityCode: "1"
            },
            error: true
        },
{
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
        const error = leaveOptions.state().paymentError;

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
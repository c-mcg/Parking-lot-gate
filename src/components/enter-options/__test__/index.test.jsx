/* global
    jest, test, expect, global
*/

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { shallowWithStore  } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

import EnterOptions from '../index'

class TicketMock {

    constructor() {
        this._generateImage = jest.fn();
        this._generateImage.mockReturnValueOnce(false);
        this._generateImage.mockReturnValueOnce(true);
    }

    get image() {
        this;
        return '';
    }

    generateImage(onSuccess, onError) {
        if (this._generateImage()) {
            onSuccess && onSuccess();
        } else {
            onError && onError();
        }
    }

}

function createShallow(state) {
    return shallowWithStore(<EnterOptions/>, createMockStore(state)).dive({context: state});
}

test('EnterOptions generate ticket', () => {
    const state = {
        generatedTicket: null,
        tickets: {},
    }

    const enterOptions = createShallow(state);

    const createTicketButton = enterOptions.find('[text="Create ticket"]');

    expect(createTicketButton.length).toBe(1);

    createTicketButton.simulate('click');
    expect(enterOptions.state().error).not.toBeTruthy();
    expect(enterOptions.state().ticket).not.toBe(null);
})

test('EnterOptions generate ticket lot full', () => {
    const state = {
        generatedTicket: null,
        tickets: {0: jest.fn()},
        lotSize: 1
    }

    const enterOptions = createShallow(state);

    const createTicketButton = enterOptions.find('[text="Create ticket"]');

    expect(createTicketButton.length).toBe(0);

    enterOptions.instance().createTicket();
    expect(enterOptions.state().error).not.toBeTruthy();
    expect(enterOptions.state().ticket).not.toBeTruthy();
})

test('EnterOptions download ticket', () => {

    const ticket = new TicketMock();

    const state = {
        generatedTicket: ticket,
        tickets: {}
    }

    const enterOptions = createShallow(state);

    const downloadButton = enterOptions.find('[text="Download"]');

    expect(downloadButton.length).toBe(1);

    const appendChild = jest.fn()
    const removeChild = jest.fn()

    document.body.appendChild = appendChild;
    document.body.removeChild = removeChild;

    downloadButton.simulate('click');

    expect(appendChild).toBeCalled

    const downloadLink = appendChild.mock.calls[0][0]

    expect(downloadLink.href).toBeTruthy();
    expect(downloadLink.download).toBeTruthy();

    expect(removeChild).toBeCalled
    expect(removeChild.mock.calls[0][0]).toBe(downloadLink);
})

test('EnterOptions print ticket', () => {

    const ticket = new TicketMock();

    const state = {
        gatOpen: true,
        generatedTicket: ticket,
        tickets: {}
    }

    const enterOptions = createShallow(state);

    const printButton = enterOptions.find('[text="Print"]');

    expect(printButton.length).toBe(1);

    global.open = jest.fn();
    const open = global.open;

    const mockWindow = {
        document: {
            write: jest.fn()
        },
        focus: jest.fn(),
        print: jest.fn(),
        close: jest.fn()
    }

    open.mockReturnValueOnce(mockWindow);

    printButton.simulate('click');

    expect(open).toBeCalled();
    expect(mockWindow.document.write).toBeCalled();
    Object.values(mockWindow).forEach((fn) => {
        if (typeof fn !== 'function') {
            return;
        }

        expect(fn).toBeCalled();
    })
})
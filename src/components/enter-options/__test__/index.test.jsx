import React from 'react'

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
    let state = {
        generatedTicket: null,
        tickets: {},
    }

    const enterOptions = createShallow(state);

    let createTicketButton = enterOptions.find('[text="Create ticket"]');
    expect(createTicketButton.length).toBe(1);

    createTicketButton.simulate('click');
    expect(enterOptions.state().error).not.toBeTruthy();
    expect(enterOptions.state().ticket).not.toBe(null);
})

test('EnterOptions generate ticket lot full', () => {
    let state = {
        generatedTicket: null,
        tickets: {0: jest.fn()},
        lotSize: 1
    }

    const enterOptions = createShallow(state);

    let createTicketButton = enterOptions.find('[text="Create ticket"]');
    expect(createTicketButton.length).toBe(0);

    enterOptions.instance().createTicket();
    expect(enterOptions.state().error).not.toBeTruthy();
    expect(enterOptions.state().ticket).not.toBeTruthy();
})

test('EnterOptions download ticket', () => {

    let ticket = new TicketMock();

    let state = {
        generatedTicket: ticket,
        tickets: {}
    }

    let store = createMockStore(state);

    const enterOptions = createShallow(state);

    let downloadButton = enterOptions.find('[text="Download"]');
    expect(downloadButton.length).toBe(1);

    let appendChild = jest.fn()
    let removeChild = jest.fn()

    document.body.appendChild = appendChild;
    document.body.removeChild = removeChild;

    downloadButton.simulate('click');

    expect(appendChild).toBeCalled

    let downloadLink = appendChild.mock.calls[0][0]
    expect(downloadLink.href).toBeTruthy();
    expect(downloadLink.download).toBeTruthy();

    expect(removeChild).toBeCalled
    expect(removeChild.mock.calls[0][0]).toBe(downloadLink);
})

test('EnterOptions print ticket', () => {

    let ticket = new TicketMock();

    let state = {
        gatOpen: true,
        generatedTicket: ticket,
        tickets: {}
    }

    const enterOptions = createShallow(state);
    const instance = enterOptions.instance();

    let printButton = enterOptions.find('[text="Print"]');
    expect(printButton.length).toBe(1);

    let open = global.open = jest.fn();

    let mockWindow = {
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
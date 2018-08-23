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

function createShallow(state, store=null) {
    return shallowWithStore(<EnterOptions/>, store ? store : createMockStore(state)).dive({context: state});
}

test('EnterOptions generate ticket', () => {
    var state = {
        generatedTicket: null,
        tickets: {}
    }

    var store = createMockStore(state);

    const enterOptions = createShallow(state, store);
    const instance = enterOptions.instance();

    var ticket = new TicketMock();
    instance.createTicket(null, ticket);
    expect(enterOptions.state().error).toBeTruthy();
    expect(ticket._generateImage.mock.calls.length).toBe(1);


    instance.createTicket(null, ticket);
    expect(enterOptions.state().error).not.toBeTruthy();
    expect(ticket._generateImage.mock.calls.length).toBe(2);
})

test('EnterOptions download ticket', () => {

    var ticket = new TicketMock();

    var state = {
        generatedTicket: ticket,
        tickets: {},
        lotSize: 1,
        gateOpen: false
    }

    var store = createMockStore(state);

    const enterOptions = createShallow(state, store);

    enterOptions.instance().downloadTicket();
})

test('EnterOptions print ticket', () => {

    var ticket = new TicketMock();

    var state = {
        gatOpen: true,
        generatedTicket: ticket,
        tickets: []
    }

    var store = createMockStore(state);

    const enterOptions = createShallow(state, store);
    const instance = enterOptions.instance();

    var open = global.open = jest.fn();

    var mockWindow = {
        document: {
            write: jest.fn()
        },
        focus: jest.fn(),
        print: jest.fn(),
        close: jest.fn()
    }

    open.mockReturnValueOnce(mockWindow);

    instance.printTicket()

    expect(open).toBeCalled();
    expect(mockWindow.document.write).toBeCalled();
    Object.values(mockWindow).forEach((fn) => {
        if (typeof fn !== 'function') {
            return;
        }

        expect(fn).toBeCalled();
    })
})
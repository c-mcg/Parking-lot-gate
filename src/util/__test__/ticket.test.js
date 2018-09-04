/*global
    test, expect
*/

import Ticket from '../ticket'

import {ONE_HOUR_IN_MS} from '../constants'

test('Ticket create and end', () => {
    
    const checkTicket = (hours, rate) => {
        const ticket = new Ticket();

        expect(ticket.barcode).toBe(null);
        expect(ticket.image).toBe(null);
        expect(ticket.startTime instanceof Date).toBe(true);
        expect(ticket.endTime).toBe(null);

        ticket._endTime = new Date((new Date).getTime() + ONE_HOUR_IN_MS * hours);
        expect(ticket.rate).toBe(rate);
        expect(ticket.endTime instanceof Date).toBe(true);
    }

    checkTicket(0.5, 3);
    checkTicket(1.5, 4.5);
    checkTicket(3.5, 6.75);
    checkTicket(6.5, 10.125);

})

test('Ticket images', () => {
    const ticket = new Ticket();

    ticket.generateImage(() => {
        expect(ticket.image).not.toBe(null);
        expect(ticket.barcode).not.toBe(null);
        expect(ticket.barcode.image).not.toBe(null);

        expect(ticket.id).toBe(ticket.barcode.id);  
    }, () => {
        throw new Error('Could not generate ticket');
    })
})
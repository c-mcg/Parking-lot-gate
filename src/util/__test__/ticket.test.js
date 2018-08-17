import Ticket from '../ticket'

test('Ticket create and end', () => {
    var ticket = new Ticket();

    expect(ticket.barcode).toBe(null);
    expect(ticket.image).toBe(null);
    expect(ticket.startTime instanceof Date).toBe(true);
    expect(ticket.endTime).toBe(null);

    expect(ticket.rate).toBe(3);
    expect(ticket.endTime instanceof Date).toBe(true);
})

test('Ticket images', () => {
    var ticket = new Ticket();

    ticket.generateImage(() => {
        expect(ticket.image).not.toBe(null);
        expect(ticket.barcode).not.toBe(null);
        expect(ticket.barcode.image).not.toBe(null);

        expect(ticket.id).toBe(ticket.barcode.id);  
    }, () => {
        throw new Error('Could not generate ticket');
    })
})
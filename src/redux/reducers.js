
import {VIEWS} from '../util/constants'

import store from './store'

import {
    OPEN_GATE,
    CLOSE_GATE,
    SET_SCANNED_TICKET,
    SET_GENERATED_TICKET,
    ADD_TICKET,
    REMOVE_TICKET,
    SET_ADMIN_PASSWORD,
    SET_VIEW,
    TOGGLE_ADMIN_SETTINGS
} from './actions'

const initialState = {
    gateOpen: false,
    generatedTicket: null,
    scannedTicket: null,
    tickets: {},
    adminPassword: null,
    currentPassword: null,
    view: -1,
    adminSettingsOpen: true,
    lotSize: 120
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        case OPEN_GATE:
            state.gateOpen = true;
            return Object.assign({}, state);

        case CLOSE_GATE:
            state.gateOpen = false;
            return Object.assign({}, state);

        case SET_GENERATED_TICKET:
            state.generatedTicket = action.payload;
            return Object.assign({}, state);

        case SET_SCANNED_TICKET:
            state.scannedTicket = action.payload;
            return Object.assign({}, state);

        case ADD_TICKET:

            if (Object.keys(tickets).length === state.lotSize) {
                return state;
            }

            var tickets = Object.assign({}, state.tickets);
            tickets[action.payload.id] = action.payload;

            var newState = Object.assign({}, state)
            newState.tickets = tickets;
            return newState;

        case REMOVE_TICKET:
            if (!state.tickets[action.payload.id]) {
                return state;
            }

            var tickets = Object.assign({}, state.tickets);
            delete tickets[action.payload.id];
            
            var newState = Object.assign({}, state);
            newState.tickets = tickets
            return newState;

        case SET_ADMIN_PASSWORD:
            if (state.adminPassword !== null && !action.payload.currentPassword) {
                return state;
            }

            var newState = Object.assign({}, state);
            newState.adminPassword = action.payload.password;
            return newState;

        case SET_VIEW:
            var newState = Object.assign({}, state);
            newState.view = action.payload;
            return newState;

        case TOGGLE_ADMIN_SETTINGS:
            var newState = Object.assign({}, state);
            newState.adminSettingsOpen = action.payload;
            return newState;
                
    }

    return state;
};

export default rootReducer;
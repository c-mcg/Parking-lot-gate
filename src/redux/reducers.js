
import {
    OPEN_GATE,
    CLOSE_GATE,
    SET_SCANNED_TICKET,
    SET_GENERATED_TICKET,
    ADD_TICKET,
    REMOVE_TICKET,
    SET_ADMIN_PASSWORD,
    SET_VIEW,
    TOGGLE_ADMIN_SETTINGS,
    SET_LOT_SIZE
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

    var newState = null;
    var tickets = null;
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

            if (Object.keys(state.tickets).length >= state.lotSize) {
                return state;
            }

            tickets = Object.assign({}, state.tickets);
            tickets[action.payload.id] = action.payload;

            newState = Object.assign({}, state)
            newState.tickets = tickets;
            return newState;

        case REMOVE_TICKET:
            if (!state.tickets[action.payload.id]) {
                return state;
            }

            tickets = Object.assign({}, state.tickets);
            delete tickets[action.payload.id];
            
            newState = Object.assign({}, state);
            newState.tickets = tickets
            return newState;

        case SET_ADMIN_PASSWORD:
            if (state.adminPassword !== null && !action.payload.currentPassword) {
                return state;
            }

            newState = Object.assign({}, state);
            newState.adminPassword = action.payload.password;
            return newState;

        case SET_VIEW:
            newState = Object.assign({}, state);
            newState.view = action.payload;
            return newState;

        case TOGGLE_ADMIN_SETTINGS:
            newState = Object.assign({}, state);
            newState.adminSettingsOpen = action.payload;
            return newState;

        case SET_LOT_SIZE:

            if (action.payload < Object.keys(state.tickets).length) {
                return state;
            }

            newState = Object.assign({}, state);
            newState.lotSize = action.payload;
            return newState;
                
    }

    return state;
};

export default rootReducer;
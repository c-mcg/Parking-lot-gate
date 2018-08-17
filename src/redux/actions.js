
import {VIEWS} from '../util/constants'

import store from './store';

var gateTimeout = 0;

export const OPEN_GATE = "OPEN_GATE";
export const CLOSE_GATE = "CLOSE_GATE"
export const openGate = (dispatch, ticket) => {

    if (!store.getState().tickets[ticket.id]) {
        return false;
    }

    dispatch({
        type: OPEN_GATE
    });

    if (gateTimeout) {
        gateTimeout = clearTimeout(gateTimeout);
        gateTimeout = 0;
    }

    gateTimeout = setTimeout(() => {
        dispatch({
            type: CLOSE_GATE
        });
    }, 5000)

    return true;
}

export const SET_GENERATED_TICKET = "SET_GENERATED_TICKET";
export const setGeneratedTicket = (dispatch, ticket) => {
    dispatch({
        type: SET_GENERATED_TICKET,
        payload: ticket
    })
}

export const SET_SCANNED_TICKET = "SET_SCANNED_TICKET";
export const setScannedTicket = (dispatch, ticket) => {
    dispatch({
        type: SET_SCANNED_TICKET,
        payload: ticket
    })
}

export const ADD_TICKET = "ADD_TICKET";
export const addTicket = (dispatch, ticket) => {
    dispatch({
        type: ADD_TICKET,
        payload: ticket
    })
}

export const REMOVE_TICKET = "REMOVE_TICKET";
export const removeTicket = (dispatch, ticket) => {
    dispatch({
        type: REMOVE_TICKET,
        payload: ticket
    })
}

export const SET_ADMIN_PASSWORD = "SET_ADMIN_PASSWORD";
export const setAdminPassword = (dispatch, payload) => {
    var realPass = store.getState().adminPassword;
    if (realPass !== null && (!payload.currentPassword  || payload.currentPassword !== realPass)) {
        return false;
    }

    if (!payload.password || !payload.passwordConfirm) {
        return false;
    }

    if (!payload.password === payload.passwordConfirm) {
        return false;
    }

    dispatch({
        type: SET_ADMIN_PASSWORD,
        payload
    })

    return true;
}

export const SET_VIEW = "SET_VIEW";
export const setView = (dispatch, view) => {

    if (!Object.values(VIEWS).includes(view)) {
        return;
    }

    dispatch({
        type: SET_VIEW,
        payload: view
    })
}

export const TOGGLE_ADMIN_SETTINGS = "TOGGLE_ADMIN_SETTINGS";
export const toggleAdminSettings = (dispatch, adminSettingsOpen) => {
    dispatch({
        type: TOGGLE_ADMIN_SETTINGS,
        payload: adminSettingsOpen ? true : false
    })
}
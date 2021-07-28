import {
    AUTH_SET_ERROR,
    AUTH_SET_INITIALIZED,
    AUTH_SET_LOGGED_IN,
    AUTH_SET_TOKEN,
    AUTH_SET_USER, STORE_RESET,
} from '../actionTypes';

const initialState = {
    token: null,
    user: null,
    initialized: false,
    error: null,
    loggedIn: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case AUTH_SET_TOKEN: {
            return {
                ...state,
                token: action.payload
            }
        }
        case AUTH_SET_USER: {
            return {
                ...state,
                user: action.payload
            }
        }
        case AUTH_SET_INITIALIZED: {
            return {
                ...state,
                initialized: action.payload
            }
        }
        case AUTH_SET_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        case AUTH_SET_LOGGED_IN: {
            return {
                ...state,
                loggedIn: action.payload
            }
        }
        case STORE_RESET: {
            return initialState
        }
        default:
            return state;
    }
}

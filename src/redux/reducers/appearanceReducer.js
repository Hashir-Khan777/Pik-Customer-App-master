import {
    APPEARANCE_SET_TAB_BAR_VISIBLE,
} from '../actionTypes';

const initialState = {
    tabBarVisible: false,

};

export default function (state = initialState, action) {
    switch (action.type) {
        case APPEARANCE_SET_TAB_BAR_VISIBLE: {
            return {
                ...state,
                tabBarVisible: action.payload
            }
        }
        default:
            return state;
    }
}

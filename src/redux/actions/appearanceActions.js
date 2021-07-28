import {
    APPEARANCE_SET_TAB_BAR_VISIBLE,
} from '../actionTypes';


export const setTabBarVisible = visible => ({
    type: APPEARANCE_SET_TAB_BAR_VISIBLE,
    payload: visible,
});

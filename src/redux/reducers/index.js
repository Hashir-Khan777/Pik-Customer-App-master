import {combineReducers} from 'redux';
import appearance from './appearanceReducer';
import auth from './authReducer';
import app from './appReducer';

export default combineReducers({
    appearance,
    auth,
    app,
});

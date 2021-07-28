import Api from '../../utils/api';
import axios from '../../utils/axios';
import AsyncStorage from '@react-native-community/async-storage';
import {assign, omit} from 'lodash';
import {
    AUTH_SET_ERROR, AUTH_SET_INITIALIZED,
    AUTH_SET_LOGGED_IN,
    AUTH_SET_TOKEN,
    AUTH_SET_USER,
} from '../actionTypes';
import {timeout} from '../../utils/helpers';

const ASYNC_STORAGE_AUTH_KEY = 'pik_customer_auth_token';

export const init = () => (dispatch, getState) => {
    let _token = null;
    return AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY)
        .then((tokenFromStorage) => {
            if (!tokenFromStorage) {
                throw {response: {data: {message: 'user not logged in'}}};
            }
            _token = tokenFromStorage;
            dispatch(setToken(_token));
            axios.defaults.headers.common = assign(
                axios.defaults.headers.common,
                {
                    Authorization: 'Bearer ' + _token,
                },
            );
            return Api.Auth.getInfo();
        })
        .then((data) => {
            if (data.success) {
                dispatch(setUser(data.user));
                dispatch(setLoggedIn(true));
            } else {
                dispatch(setError(data.message || 'Somethings went wrong'))
            }
        })
        .catch((error) => {
            dispatch(setError(
                error?.response?.data?.message ||
                error?.message ||
                'Somethings went wrong',
            ))
        })
        .then(() => {
            dispatch(setInitialized(true));
        });
};

export const login = (email, password) => (dispatch, getState) => {
    return Api.Auth.signin(email, password)
        .then(async (data) => {
            if (data.success) {
                await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, data.token);
                dispatch(setUser(data.user));
                dispatch(setLoggedIn(true));
                axios.defaults.headers.common = assign(
                    axios.defaults.headers.common,
                    {
                        Authorization: 'Bearer ' + data.token,
                    },
                );
            } else {
                console.log(data);
                dispatch(setError(data.message || 'Some things went wrong'));
            }
            return data;
        })
        .catch((error) => {
            console.log(error);
            dispatch(setError(
                error?.response?.data?.message ||
                error?.message ||
                'server side error',
            ));
            return error.response;
        });
};

export const loginWith = (token, user) => (dispatch, getState) => {
    return Promise.resolve()
        .then(async () => {
            await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, token);
            dispatch(setUser(user));
            axios.defaults.headers.common = assign(
                axios.defaults.headers.common,
                {
                    Authorization: 'Bearer ' + token,
                },
            );
            dispatch(setLoggedIn(true));
        })
        .catch((error) => {
            console.log(error);
            dispatch(setError(error?.message || 'somethings went wrong'));
            return error?.response;
        });
};

export const logout = (token, user) => (dispatch, getState) => {
    return Api.Auth.signout()
        .then(async (data) => {
            if (data.success) {
                await AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY);
                dispatch(setLoggedIn(false));
                // setUser(null);
                axios.defaults.headers.common = omit(axios.defaults.headers.common, [
                    'Authorization',
                ]);
            } else {
                dispatch(setError(data.message || 'Some things went wrong'));
            }
            return data;
        })
        .catch((error) => {
            dispatch(setError(
                error?.response?.data?.message ||
                error?.message ||
                'server side error',
            ));
            return error.response;
        });
}

export const reloadUserInfo = () => (dispatch, getState) => {
    return Api.Auth.getInfo()
        .then((data) => {
            if (data.success) {
                dispatch(setUser(data.user));
            } else {
                dispatch(setError(data.message || 'Somethings went wrong'));
            }
            return timeout(50);
        })
        .catch((error) => {
            dispatch(setError(
                error?.response?.data?.message ||
                error?.message ||
                'Somethings went wrong',
            ));
        });
}

export const setUser = user => ({
    type: AUTH_SET_USER,
    payload: user,
});

export const setLoggedIn = loggedIn => ({
    type: AUTH_SET_LOGGED_IN,
    payload: loggedIn,
});

export const setError = error => ({
    type: AUTH_SET_ERROR,
    payload: error,
});

export const setToken = token => ({
    type: AUTH_SET_TOKEN,
    payload: token,
});

export const setInitialized = initialized => ({
    type: AUTH_SET_INITIALIZED,
    payload: initialized,
});

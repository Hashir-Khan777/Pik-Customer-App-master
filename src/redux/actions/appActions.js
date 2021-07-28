import {
    CUSTOMER_SET_RECENT_ADDRESSES,
    CUSTOMER_SELECT_PAYMENT_METHOD,
    CUSTOMER_SET_PAYMENT_METHODS,
    CUSTOMER_SET_PAYMENT_METHODS_LOADED,
    CUSTOMER_SET_PAYMENT_METHODS_LOADING,
    CUSTOMER_SET_SELECTED_ADDRESS,
    CUSTOMER_SET_CONTACTS_LIST,
    CUSTOMER_SET_CONTACTS_LOADED,
    CUSTOMER_SET_ORDERS,
    CUSTOMER_SET_ORDER,
    CUSTOMER_SET_ORDERS_LOADING,
    CUSTOMER_SET_ORDERS_LOADED,
    CUSTOMER_ADD_NEW_ORDER,
    CUSTOMER_UPDATE_ORDER,
    CUSTOMER_ORDER_CHAT_SET_LIST,
    APP_SET_FAQS,
    CUSTOMER_SET_SAVED_ADDRESSES, STORE_RESET, APP_LOCATION_SET_AVAILABLE, APP_LOCATION_SET_CURRENT,
    CURRENT_LANG
} from '../actionTypes';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-community/async-storage'
import Api from '../../utils/api';
import {DEVICE_ANDROID} from '../../utils/constants';
import {clearPhoneNumber} from '../../utils/helpers';

const testCreditCards = {
    success: true,
    creditCards: [
        {_id: '1', type: "mastercard", numberFormatted: "**** **** **** 9875", year: "2020", month: "05"},
        {_id: '2', type: "visa", numberFormatted: "**** **** **** 9875", year: "2022", month: "11"},
    ]
}

export const loadPaymentMethods = () => (dispatch, getState) => {
    dispatch(setPaymentMethodsLoading(true));
    // Promise.resolve(testCreditCards)
    return Api.Customer.getCreditCards()
        .then(({success, creditCards, ...other}) => {
            if(success) {
                dispatch(setPaymentMethods(creditCards));
            }
            else{
                console.log('credit cards load error', other)
            }
            dispatch(setPaymentMethodsLoaded(true));
        })
        .catch(error => {
            console.log(error);
            dispatch(setPaymentMethods([]));
        })
        .then(() => {
            dispatch(setPaymentMethodsLoading(false))
        })
};

export const setPaymentMethods = (paymentMethodList) => ({
    type: CUSTOMER_SET_PAYMENT_METHODS,
    payload: paymentMethodList,
});

export const setPaymentMethodsLoaded = (loaded) => ({
    type: CUSTOMER_SET_PAYMENT_METHODS_LOADED,
    payload: !!loaded,
});

export const setPaymentMethodsLoading = (loading) => ({
    type: CUSTOMER_SET_PAYMENT_METHODS_LOADING,
    payload: !!loading,
});

export const selectPaymentMethod = (id) => ({
    type: CUSTOMER_SELECT_PAYMENT_METHOD,
    payload: id,
});

export const loadRecentAddresses = () => (dispatch, getState) => {
    AsyncStorage.getItem('recent-locations')
        .then(listStr => {
            const list = listStr ? JSON.parse(listStr) : [];
            dispatch(_setRecentAddresses(list));
        })
        .catch(error => {
            dispatch(_setRecentAddresses([]));
        })
};

export const setRecentAddresses = (list) => (dispatch, getState) => {
    AsyncStorage.setItem('recent-locations', JSON.stringify(list))
        .then(() => {
            dispatch(_setRecentAddresses(list));
        })
        .catch(error => {
            dispatch(_setRecentAddresses([]));
        })
};

const _setRecentAddresses = (addressList) => ({
    type: CUSTOMER_SET_RECENT_ADDRESSES,
    payload: addressList,
});

export const loadSavedAddresses = () => (dispatch, getState) => {
    Api.Customer.getSavedAddresses()
        .then(({success, addresses}) => {
            if(success)
                dispatch(setSavedAddresses(addresses));
        })
        .catch(error => {
        })
};

export const setSavedAddresses = (addressList) => ({
    type: CUSTOMER_SET_SAVED_ADDRESSES,
    payload: addressList,
});

export const setSelectedAddress = (address) => ({
    type: CUSTOMER_SET_SELECTED_ADDRESS,
    payload: address,
});

export const loadContactsList = () => (dispatch, getState) => {
    Promise.resolve(true)
        .then(() => {
            if(DEVICE_ANDROID){
                return PermissionsAndroid.requestMultiple(
                    [
                       'android.permission.READ_PROFILE',
                        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    ],
                    {
                        'title': 'Contacts',
                        'message': 'This app would like to view your contacts.',
                        'buttonPositive': 'Please accept bare mortal'
                    }
                )
            }
        })
        .then(() => Contacts.getAll())
        .then(contacts => {
            let filteredContacts = contacts
                .filter(c => (c.phoneNumbers.length > 0))
                .map(c => {
                    return {
                        ...c,
                        search: [
                            ...c.phoneNumbers.map(n => n.number),
                            ...c.emailAddresses.map(n => n.email),
                            c.familyName,
                            c.givenName,
                            c.middleName,
                        ].filter(item => !!item).map(clearPhoneNumber).join('-').toLowerCase()
                    }
                })
            dispatch(_setContactsList(filteredContacts))
        })
        .catch(error => {
        })
        .then(() => {
            dispatch(setContactsLoaded(true))
        })
};

export const reloadOrderInfo = (orderId) => (dispatch) => {
    console.log('reloading order info: ' + orderId)
    return Api.Customer.getOrderDetail(orderId)
        .then(({success, order}) => {
            console.log('========== successfully reloaded')
            if(success) {
                dispatch(updateOrder(order._id, order))
            }
        })
        .catch(error => {
            console.log('==== error', error)
        })
};

export const setContactsLoaded = (isLoaded) => ({
    type: CUSTOMER_SET_CONTACTS_LOADED,
    payload: isLoaded,
});

const _setContactsList = (contacts) => ({
    type: CUSTOMER_SET_CONTACTS_LIST,
    payload: contacts,
});

export const loadOrdersList = () => (dispatch, getState) => {
    dispatch(setOrdersLoading(true))
    return Api.Customer.getOrderList()
        .then(({success, orders}) => {
            if(success)
                dispatch(setOrders(orders))
        })
        .catch(error => {
        })
        .then(() => {
            dispatch(setOrdersLoading(false))
            dispatch(setOrdersLoaded(true))
        })
};

export const reloadSingleOrder = (orderId) => (dispatch, getState) => {
    return Api.Customer.getOrderDetail(orderId)
        .then(({success, order}) => {
            if(success)
                dispatch(setSingleOrder(order))
        })
};

export const setOrders = (orders) => ({
    type: CUSTOMER_SET_ORDERS,
    payload: orders,
});

export const setSingleOrder = (order) => ({
    type: CUSTOMER_SET_ORDER,
    payload: order,
});

export const addNewOrder = (order) => ({
    type: CUSTOMER_ADD_NEW_ORDER,
    payload: order,
});

export const updateOrder = (orderId, update) => ({
    type: CUSTOMER_UPDATE_ORDER,
    payload: {orderId, update},
});

const setOrdersLoading = (loading) => ({
    type: CUSTOMER_SET_ORDERS_LOADING,
    payload: loading,
});

const setOrdersLoaded = (loaded) => ({
    type: CUSTOMER_SET_ORDERS_LOADED,
    payload: loaded,
});

export const setOrderChatList = (chatList) => ({
    type: CUSTOMER_ORDER_CHAT_SET_LIST,
    payload: chatList
})

export const loadFaqs = () => (dispatch, getState) => {
    return Api.Customer.getFaqs()
        .then(({success, faqs, categories}) => {
            if(success) {
                !!faqs && !!categories && dispatch(setFaqs(faqs, categories))
            }
            else{
                // TODO: What to do
            }
        })
}

export const setFaqs = (faqs, categories) => ({
    type: APP_SET_FAQS,
    payload: {faqs, categories}
})

export const resetStore = () => ({
    type: STORE_RESET,
})

export const setLocationAvailable = available => ({
    type: APP_LOCATION_SET_AVAILABLE,
    payload: available
})

export const setCurrentLocation = currentLocation => ({
    type: APP_LOCATION_SET_CURRENT,
    payload: currentLocation
})

export const setCurrentLang = lang => ({
    type: CURRENT_LANG,
    payload: lang
})


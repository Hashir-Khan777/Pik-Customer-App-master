import {
    CUSTOMER_SET_PAYMENT_METHODS,
    CUSTOMER_SET_PAYMENT_METHODS_LOADING,
    CUSTOMER_SET_PAYMENT_METHODS_LOADED,
    CUSTOMER_SELECT_PAYMENT_METHOD,
    CUSTOMER_SET_RECENT_ADDRESSES,
    CUSTOMER_SET_SELECTED_ADDRESS,
    CUSTOMER_SET_CONTACTS_LIST,
    CUSTOMER_SET_CONTACTS_LOADED,
    CUSTOMER_SET_ORDERS,
    CUSTOMER_SET_ORDERS_LOADED,
    CUSTOMER_SET_ORDERS_LOADING,
    CUSTOMER_ADD_NEW_ORDER,
    CUSTOMER_MERGE_ORDERS,
    CUSTOMER_UPDATE_ORDER,
    CUSTOMER_ORDER_CHAT_SET_LIST,
    APP_SET_FAQS,
    CUSTOMER_SET_SAVED_ADDRESSES,
    CUSTOMER_SET_ORDER,
    STORE_RESET,
    APP_LOCATION_SET_AVAILABLE, APP_LOCATION_SET_CURRENT,
    CURRENT_LANG
} from '../actionTypes';
import _ from 'lodash';

const initialState = {
    paymentMethods: {
        selected: '',
        loading: false,
        loaded: false,
        list: []
    },
    selectedAddress: null,
    recentAddresses: [],
    savedAddresses: [],
    contactsLoaded: false,
    contacts: [],
    // Customer orders list
    orders: [],
    ordersLoaded: false,
    ordersLoading: false,

    pendingOrders: [],
    pendingOrdersLoading: false,
    orderChatList: [],
    faqs: [],
    faqCategories: [],
    location: {
        available: false,
        current: null,
    },

    current_lang: 'es'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CUSTOMER_SET_PAYMENT_METHODS: {
            let {loaded, loading} = state.paymentMethods;
            return {
                ...state,
                paymentMethods: {
                    loading,
                    loaded,
                    list: [...action.payload]
                }
            }
        }
        case CUSTOMER_SET_PAYMENT_METHODS_LOADING: {
            let {loaded, list} = state.paymentMethods;
            return {
                ...state,
                paymentMethods: {
                    loading: action.payload,
                    loaded,
                    list
                }
            }
        }
        case CUSTOMER_SET_PAYMENT_METHODS_LOADED: {
            let {loading, list} = state.paymentMethods;
            return {
                ...state,
                paymentMethods: {
                    loading,
                    loaded: action.payload,
                    list
                }
            }
        }
        case CUSTOMER_SELECT_PAYMENT_METHOD: {
            let {loading, loaded, list} = state.paymentMethods;
            return {
                ...state,
                paymentMethods: {
                    loading,
                    loaded,
                    list,
                    selected: action.payload
                }
            }
        }
        case CUSTOMER_SET_RECENT_ADDRESSES: {
            return {
                ...state,
                recentAddresses: action.payload
            }
        }
        case CUSTOMER_SET_SAVED_ADDRESSES: {
            return {
                ...state,
                savedAddresses: action.payload
            }
        }
        case CUSTOMER_SET_SELECTED_ADDRESS: {
            return {
                ...state,
                selectedAddress: action.payload
            }
        }
        case CUSTOMER_SET_CONTACTS_LOADED: {
            return {
                ...state,
                contactsLoaded: action.payload
            }
        }
        case CUSTOMER_SET_CONTACTS_LIST: {
            return {
                ...state,
                contacts: action.payload
            }
        }
        case CUSTOMER_SET_ORDERS: {
            return {
                ...state,
                orders: action.payload
            }
        }
        case CUSTOMER_SET_ORDER: {
            let order = action.payload
            let newOrders = [...state.orders]
            let index = state.orders.findIndex(o => o._id == order._id)
            if(index >= 0){
                newOrders.splice(index, 1, order)
            }
            else{
                newOrders.push(order)
            }
            return {
                ...state,
                orders: newOrders
            }
        }
        case CUSTOMER_ADD_NEW_ORDER: {
            return {
                ...state,
                orders: [...state.orders, action.payload]
            }
        }
        case CUSTOMER_UPDATE_ORDER: {
            let {orderId, update} = action.payload;
            let index = state.orders.findIndex(i => i._id === orderId);
            if(index < 0) {
                console.log('CUSTOMER_UPDATE_ORDER: order not fount')
                return state
            }
            let newOrders = [...state.orders];
            newOrders.splice(index, 1, {
                ...state.orders[index],
                ...update
            });
            return {
                ...state,
                orders: newOrders
            }
        }
        case CUSTOMER_SET_ORDERS_LOADED: {
            return {
                ...state,
                ordersLoaded: action.payload
            }
        }
        case CUSTOMER_SET_ORDERS_LOADING: {
            return {
                ...state,
                ordersLoading: action.payload
            }
        }
        case APP_SET_FAQS: {
            return {
                ...state,
                faqs: action.payload.faqs,
                faqCategories: action.payload.categories,
            };
        }
        case CUSTOMER_ORDER_CHAT_SET_LIST: {
            return {
                ...state,
                orderChatList: action.payload,
            };
        }
        case STORE_RESET: {
            return initialState
        }
        case APP_LOCATION_SET_AVAILABLE: {
            return {
                ...state,
                location: {
                    ...state.location,
                    available: action.payload,
                },
            };
        }
        case APP_LOCATION_SET_CURRENT: {
            return {
                ...state,
                location: {
                    ...state.location,
                    current: action.payload,
                },
            };
        }
        case CURRENT_LANG: {
            return {
                ...state,
                current_lang: action.payload
            }
        }
        default:
            return state;
    }
}

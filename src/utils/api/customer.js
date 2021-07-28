import axios from '../axios';
import {obj2FormData, obj2QueryParams} from '../helpers';

export function updateProfile(formData) {
    return axios({
        method: 'put',
        url: '/customer/profile',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function getCreditCards() {
    return axios.get(`/customer/credit-cards?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function postNewCreditCard(info) {
    return axios.post('/customer/credit-card', info)
        .then(({data}) => {
            return data;
        });
}

export function postNewOrder(formData) {
    console.log('posting new order')
    return axios({
        method: 'post',
        url: '/customer/order',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function completeOrder(orderId, formData) {
    return axios({
        method: 'put',
        url: `/customer/complete-order/${orderId}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function editOrder(orderId, orderInfo) {
    return axios.put(`/customer/edit-order/${orderId}`, orderInfo)
        .then(({data}) => {
            return data;
        });
}

export function cancelOrder(orderId) {
    return axios.put(`/customer/cancel-order/${orderId}`)
        .then(({data}) => {
            return data;
        });
}

export function cancelOrderRequest(orderId) {
    return axios.put(`/customer/cancel-order-request/${orderId}`)
        .then(({data}) => {
            return data;
        });
}

export function updateDriverDocument(formData) {
    return axios({
        method: 'put',
        url: '/customer/documents',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function updateStatus(isOnline) {
    return axios
        .put('/customer/status', {status: isOnline ? 'online' : 'offline'})
        .then(({data}) => {
            return data;
        });
}

export function getJob(location) {
    return axios
        .get(`/customer/job?location=${location.latitude},${location.longitude}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getOrderById(orderId) {
    return axios
        .post('/driver/getOrderById', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function calcOrderPrice(vehicleType, pickupAddress, deliveryAddress, businessId) {
    let params = {
        vehicleType,
        origin: `${pickupAddress.geometry.location.lat},${pickupAddress.geometry.location.lng}`,
        destination: `${deliveryAddress.geometry.location.lat},${deliveryAddress.geometry.location.lng}`,
        business: businessId,
        t: Date.now()
    }
    return axios
        .get(`/customer/calculate-price?${obj2QueryParams(params)}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getOrderList() {
    return axios
        .get(`/customer/order-list?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getOrderDetail(orderId) {
    return axios
        .get(`/customer/order/${orderId}?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getMobileInfo(mobile) {
    return axios
        .get(`/customer/mobile-info?mobile=${encodeURIComponent(mobile)}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getBusinessTimeFrames(businessId) {
    return axios
        .get(`/customer/business-time-frames/${businessId}?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function registerDevice(deviceInfo) {
    return axios
        .post(`/customer/device-info/`, deviceInfo)
        .then(({data}) => {
            return data;
        });
}

export function getOrderDriverLocation(orderId) {
    return axios
        .get(`/customer/order-track/${orderId}?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function registerFeedback(orderId, feedback) {
    return axios
        .post(`/customer/feedback/${orderId}`, feedback)
        .then(({data}) => {
            return data;
        });
}

export function postContactUs(formData) {
    return axios({
        method: 'post',
        url: `/customer/contact-us`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function postSupportTicket(formData) {
    return axios({
        method: 'post',
        url: `/customer/support-ticket`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function postOrderChat(orderId, formData) {
    return axios({
        method: 'post',
        url: `/customer/order-chat/${orderId}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function postOrderChatRead(orderId) {
    return axios.post(`/customer/order-chat-read/${orderId}`)
        .then(({data}) => {
            return data;
        });
}

export function getFaqs() {
    return axios.get(`/customer/faqs?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getSavedAddresses() {
    return axios.get(`/customer/address/list?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function postNewAddress(name, address) {
    return axios.post(`/customer/address/new`, {name, address})
        .then(({data}) => {
            return data;
        });
}

export function editSavedAddress(_id, name, address) {
    return axios.put(`/customer/address/${_id}`, {name, address})
        .then(({data}) => {
            return data;
        });
}

export function deleteSavedAddress(_id) {
    return axios.delete(`/customer/address/${_id}?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getBanner() {
    return axios.get(`/customer/banner?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

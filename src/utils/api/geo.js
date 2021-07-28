import axios from '../axios';

export function codingByQuery(query) {
    return axios.get(`/geo/coding?query=${query}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function codingByLatLng(latLng) {
    return axios.get(`/geo/coding?latlng=${latLng}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function search(query) {
    return axios.get(`/geo/search?query=${query}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function autocomplete(query) {
    return axios.get(`/geo/autocomplete?query=${query}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function direction(origin, destination) {
    return axios.get(`/geo/direction?origin=${origin}&destination=${destination}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

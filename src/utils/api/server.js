import axios from '../axios';

export function getStatus() {
    return axios.get(`/server/status?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getTime() {
    return axios.get(`/server/time?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

import {API_BASE_URL} from '@env';
import moment from 'moment'
import QRCode from 'qrcode-generator';
import DeviceInfo from 'react-native-device-info';
import {Linking} from 'react-native'

export const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const uploadUrl = path => {
    if(!!path) {
        if (path.substr(0, 4) === 'http')
            return path;
        else
            return `${API_BASE_URL}${path}`
    }
    else
        return path;
}
export const clearPhoneNumber = val => val.toString().replace(/(\ |-|\(|\)|-)/g, '')
export const  obj2FormData = (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            obj2FormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        formData.append(parentKey, value);
    }
}
export const obj2QueryParams = (object) => {
    return Object.keys(object)
        .filter(key => !!object[key])
        .map(key => key + "=" + encodeURIComponent(object[key]))
        .join("&")
}

export const callPhoneNumber = phoneNumber => Linking.openURL(`tel:${phoneNumber}`)

export const getDeviceInfo = () => {
    return {
        model: DeviceInfo.getModel(),
        deviceName: DeviceInfo.getDeviceNameSync(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
    }
}

export const generateQrCode = (text, options={}) => {
    const defaultOptions = {
        cellSize: 2,
        margin: 2,
        scalable: true,
        type: 'svg'
    }

    let finalOptions = {
        ... defaultOptions,
        ... options
    }

    let qr = QRCode(0, 'H');
    qr.addData(text)
    qr.make()
    if(finalOptions.type === 'svg')
        return qr.createSvgTag(finalOptions)
    else
        return qr.createDataURL(finalOptions.cellSize, finalOptions.margin)
}

export const getDateScheduleTimes = (date, timeFrames, customTimeFrames) => {
    const makeTime = (h, m) => {
        if (m >= 60) {
            h += Math.floor(m / 60);
            m = m % 60;
        }
        return {h, m};
    };
    const formatSingleTime = (t) => {
        // return moment(`${t.h}:${t.m}`, 'HH:mm').format('HH:mm');
        return [
            t.h.toString().padStart(2, '0'),
            ':',
            t.m.toString().padStart(2, '0'),
        ].join('');
    }
    const formatTime = (t1, t2, h12 = false) => {
        return [
            (h12 && t1.h > 12 ? t1.h - 12 : t1.h).toString().padStart(2, '0'),
            ':',
            t1.m.toString().padStart(2, '0'),
            '-',
            (h12 && t2.h > 12 ? t2.h - 12 : t2.h).toString().padStart(2, '0'),
            ':',
            t2.m.toString().padStart(2, '0'),
            ...(h12 ? [' ', t2.h >= 12 ? 'PM' : 'AM'] : []),
        ].join('');
    };

    let oh, om, ch, cm;
    if(customTimeFrames[date]) {
        let tf = customTimeFrames[date];
        if(tf.totallyClosed)
            return [];
        [oh, om] = tf.open.split(':').map(n => parseInt(n));
        [ch, cm] = tf.close.split(':').map(n => parseInt(n));
    }
    else if(timeFrames[moment(date).format('d')]){
        let dayOfWeek = moment(date).format('d');
        let tf = timeFrames[dayOfWeek];
        if(tf.totallyClosed)
            return [];
        [oh, om] = tf.open.split(':').map(n => parseInt(n));
        [ch, cm] = tf.close.split(':').map(n => parseInt(n));
    }
    else
        return []

    let closeTime = makeTime(ch, cm);

    let result = [],
        t1 = makeTime(oh, om),
        t2 = makeTime(oh, om + 30);

    let timeNow = moment().format('HH:mm')
    let dateNow = moment().format('YYYY-MM-DD')
    while (t2.h*60+t2.m <= closeTime.h*60+closeTime.m) {
        // result.push([t1, t2]);
        if(formatSingleTime(t1) > timeNow || date !== dateNow) {
            result.push({
                label: formatTime(t1, t2, true),
                value: formatTime(t1, t2),
                from: formatSingleTime(t1),
                to: formatSingleTime(t2),
            });
        }
        t1 = t2;
        om += 30;
        t2 = makeTime(oh, om + 30);
    }

    return result;
}

export const expandCustomTimeFrames = customTimeFrames => {
    let result = {}
    customTimeFrames.map(item => {
        let d1 = moment(item.from), d2 = moment(item.to);
        let dateFormat = 'YYYY-MM-DD'
        while(d1.format(dateFormat) <= d2.format(dateFormat)){
            let key = d1.format(dateFormat);
            result[key] = {
                totallyClosed: item.totallyClosed,
                open: item.open,
                close: item.close,
            };
            d1 = d1.add(1, 'days');
        }
    })
    return result;
}

export const priceToFixed = price => (price || 0).toFixed(2)

export const isAvailableOrder = (order, currentUser) => {
    let {receiver, senderModel, status} = order;
    return senderModel === 'business'
        && ['Created', 'Reschedule'].includes(status)
        && receiver._id === currentUser._id
}

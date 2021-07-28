import {PhoneNumberUtil} from 'google-libphonenumber';
const phoneUtils = PhoneNumberUtil.getInstance();

export const isEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const isMobile = mobile => {
    if(!mobile)
        return false
    try {
        let number = phoneUtils.parseAndKeepRawInput(mobile)
        if (!phoneUtils.isValidNumber(number)) {
            return false
        }
    }catch (e) {
        return false
    }
    return true;
}

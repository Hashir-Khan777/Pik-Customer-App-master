import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from '@react-native-community/async-storage'

import EN from './langs/en'
import ES from './langs/es'

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {translation: EN},
            es: {translation: ES},
        },
        fallbackLng: "es",
        lng: "es",
        keySeparator: '.',

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

async function loadStoredLanguage() {
    const lang = await AsyncStorage.getItem('current_lang');
    if(!!lang && lang != i18n.language){
        await i18n.changeLanguage(lang)
    } else {
        await i18n.changeLanguage('en');
    }
}

async function storeCurrentLanguage(lang){
    await AsyncStorage.setItem('current_lang', lang);
}

// loadStoredLanguage()

export default i18n;
export {
    i18n,
    storeCurrentLanguage,
}

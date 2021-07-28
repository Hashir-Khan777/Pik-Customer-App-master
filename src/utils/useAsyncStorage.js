import {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Sample usage:
 * let [recentItems, setRecentItems] = useAsyncStorage("recent-locations",useState([]));
 */

function useAsyncStorage(key, [state, setState]) {

    async function getStoredItem(key) {
        try {
            const item = await AsyncStorage.getItem(key);
            const value = item ? JSON.parse(item) : undefined;
            // console.log(`recent addresses`, value)
            value !== undefined && setState(value);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // console.log(`useAsyncStorage useEffect ${key} ${Date.now()}`);
        setTimeout(() => getStoredItem(key), 1000);
    }, [key, setState]);

    const setValue = async (value) => {
        // console.log('useAsyncStorage setValue ' + Date.now());
        try {
            const valueToStore = value instanceof Function ? value(state) : value;
            setState(valueToStore);
            await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    }

    return [state, setValue]
}

export default useAsyncStorage;

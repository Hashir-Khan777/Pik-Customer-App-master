import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import AuthStack from './authNavigator';
import MainStack from './mainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import DriverStatuses from '../../../node-back/src/constants/DriverStatuses';
import withAuth from '../redux/connectors/withAuth';
import {StatusBar, View, AppState} from 'react-native';
import {BLACK} from '../utils/constants';
import {getDeviceInfo} from '../utils/helpers';
import Api from '../utils/api'
import Toast from 'react-native-toast-message';
import {
    loadOrdersList as loadOrdersListAction,
    setOrderChatList as setOrderChatListAction,
    setCurrentLocation as setCurrentLocationAction,
    setLocationAvailable as setLocationAvailableAction,
    setCurrentLang as setCurLang
} from '../redux/actions';
import {compose} from 'redux';
import {connect} from 'react-redux';
import firestore from '../utils/firestore';
import {getAvailables as getAvailablesSelector} from '../redux/selectors';
import Geolocation from '@react-native-community/geolocation';
import getCurrentPosition from '../utils/getCurrentPosition';
import {useTranslation} from 'react-i18next';

const RootNavigator = createStackNavigator();

async function requestUserNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        const fcmToken = await messaging().getToken();
        console.log("fcmToken - ", fcmToken);
        let deviceInfo = getDeviceInfo()
        Api.Customer.registerDevice({fcmToken, ...deviceInfo})
            .then(async data => {
                if(data.success){
                    console.log('device registered successfully')
                    await AsyncStorage.setItem('device-info', JSON.stringify({fcmToken, ...deviceInfo}))
                }
                else{
                    console.log(data)
                }
            })
            .catch(console.error)

        // let storedInfo = await AsyncStorage.getItem('device-info')
        // try {
        //     storedInfo = JSON.parse(storedInfo);
        // }catch (e) {}
        // if(!storedInfo || !storedInfo.fcmToken || storedInfo.fcmToken !== fcmToken){
        // }
    }
}

const RootNavigatorComponent = ({authInitialized, authLoggedIn, setOrderChatList, authUser, ...props}) => {
    let {ordersLoading, loadOrdersList, current_lang} = props;
    const { t, i18n } = useTranslation();

    const bootstrapRoutes = () => {
        if (!authInitialized) {
            return <RootNavigator.Screen name="AppLoading" component={LoadingScreen}/>;
        } else {
            if (!authLoggedIn) {
                return <RootNavigator.Screen name="Auth" component={AuthStack}/>;
            } else {
                return <RootNavigator.Screen name="Main" component={MainStack}/>;
            }
        }
    };

    useEffect(() => {
        console.log("---- current_ lang - ", current_lang, i18n.language);
        if(!!current_lang && current_lang != undefined){
            i18n.changeLanguage(current_lang);
        }
        else {
            i18n.changeLanguage('es');
            setCurLang('es');
        }
    }, [current_lang]);

    React.useEffect(() => {
        if(authInitialized)
            SplashScreen.hide()
    }, [authInitialized])

    useEffect(() => {
        // initializeFirebase()
        // requestUserNotificationPermission()

    }, [])

    const onAppStateChange = nextAppState => {
        if(nextAppState === 'active'){
            if(!ordersLoading)
                loadOrdersList();
        }
    }

    useEffect(() => {
        AppState.addEventListener('change', onAppStateChange);
        return () => {
            AppState.removeEventListener('change', onAppStateChange);
        }
    }, [])

    const toastConfig = {
    };

    useEffect(() => {
        console.log(`getting chat rooms of [${authUser?.name}] .........`)
        const unsubscribe = firestore()
            .collection('pik_delivery_order_chats')
            .where(`userList.${authUser?._id}`, '!=', false)
            .onSnapshot(querySnapshot => {
                const threads = querySnapshot.docs.map(documentSnapshot => {
                    return {
                        id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    }
                })

                console.log(`customer chat list: [${threads.length}] chats`)
                setOrderChatList(threads)
            },error => {
                console.error('firestore error', error)
            })
        return () => unsubscribe()
    }, [authUser?._id?.toString()])

    React.useEffect(() => {
        if(props.locationAvailable) {
            const watchId = Geolocation.watchPosition((result) => {
                // console.log('========== location watch success ===========')
                props.setCurrentLocation(result)
            }, error => {
                // console.log('========== location watch error ===========', error)
                switch (error.code) {
                    case 1:
                    case 2:
                        props.setLocationAvailable(false)
                }
            })
            return () => Geolocation.clearWatch(watchId);
        }
    }, [props.locationAvailable])

    React.useEffect(() => {
        const timer = setInterval(() => {
            getCurrentPosition()
                .then(info => {
                    // console.log('GPS On/Off state [On]')
                    if(!props.locationAvailable)
                        props.setLocationAvailable(true)
                })
                .catch(() => {
                    // console.log('GPS On/Off state [Off]')
                    if(props.locationAvailable)
                        props.setLocationAvailable(false)
                })
        }, 5000);
        return () => clearInterval(timer);
    }, [props.locationAvailable])

    return <>
        <StatusBar barStyle="light-content" backgroundColor={BLACK}/>
        <RootNavigator.Navigator headerMode={'none'}>
            {bootstrapRoutes()}
        </RootNavigator.Navigator>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </>;
}

const mapStateToProps = state => {
    let {ordersLoaded, ordersLoading, current_lang} = state.app;
    return {
        currentLocation: state.app.location.current,
        locationAvailable: state.app.location.available,
        ordersLoaded,
        ordersLoading,
        current_lang
    }
}

const mapDispatchToProps = dispatch => ({
    loadOrdersList: () => dispatch(loadOrdersListAction()),
    setOrderChatList: chatList => dispatch(setOrderChatListAction(chatList)),
    setCurrentLocation: currentLocation => dispatch(setCurrentLocationAction(currentLocation)),
    setLocationAvailable: available => dispatch(setLocationAvailableAction(available)),
    setCurLang: lang => dispatch(setCurrentLang(lang))
})

const enhance = compose(
    withAuth,
    connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RootNavigatorComponent)

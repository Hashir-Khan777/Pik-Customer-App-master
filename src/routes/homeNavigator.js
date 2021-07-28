import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';
import {LeftToRightAnimation} from './animations';

import HomeMainScreen from '../screens/Main/Home/HomeMainScreen';
import HomePickupScreen from '../screens/Main/Home/HomePickupScreen';
import HomeSendPackageScreen from '../screens/Main/Home/HomeSendPackageScreen';
import HomeRequestPackageScreen from '../screens/Main/Home/HomeRequestPackageScreen';
import HomePendingPackageScreen from '../screens/Main/Home/HomePendingPackageScreen';
import HomePaymentMethodsScreen from '../screens/Main/Home/HomePaymentMethodsScreen';
import HomePackageLocationScreen from '../screens/Main/Home/HomePackageLocationScreen';
import HomePackageLocationSearchScreen from '../screens/Main/Home/HomePackageLocationSearchScreen';
import HomeContactsScreen from '../screens/Main/Home/HomeContactsScreen';
import HomeGetPackageScreen from '../screens/Main/Home/HomeGetPackageScreen';
import HomePackageViewScreen from '../screens/Main/Home/HomePackageViewScreen';
import HomeBusinessInfoScreen from '../screens/Main/Home/HomeBusinessInfoScreen';
import HomeSearchingCarrierScreen from '../screens/Main/Home/HomeSearchingCarrierScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = ({}) => {
    return <Stack.Navigator
        headerMode={'none'}
        initialRouteName="MainHomeMain"
        screenOptions={LeftToRightAnimation}
    >
        <Stack.Screen name="MainHomeMain" component={HomeMainScreen}/>
        <Stack.Screen name="MainHomePickup" component={HomePickupScreen}/>
        <Stack.Screen name="MainHomeSendPackage" component={HomeSendPackageScreen}/>
        <Stack.Screen name="MainHomeRequestPackage" component={HomeRequestPackageScreen}/>
        <Stack.Screen name="MainHomePendingPackage" component={HomePendingPackageScreen}/>
        <Stack.Screen name="MainHomeGetPackage" component={HomeGetPackageScreen}/>
        <Stack.Screen name="HomePackageView" component={HomePackageViewScreen}/>
        <Stack.Screen name="MainHomeBusinessInfo" component={HomeBusinessInfoScreen}/>
        <Stack.Screen name="MainHomePaymentMethods" component={HomePaymentMethodsScreen}/>
        <Stack.Screen name="LocationGet" component={HomePackageLocationScreen}/>
        <Stack.Screen name="LocationSearch" component={HomePackageLocationSearchScreen}/>
        <Stack.Screen name="MainHomePackageContacts" component={HomeContactsScreen}/>
        <Stack.Screen name="MainHomeSearchingCarrier" component={HomeSearchingCarrierScreen}/>
    </Stack.Navigator>;
};

export default HomeStackNavigator;

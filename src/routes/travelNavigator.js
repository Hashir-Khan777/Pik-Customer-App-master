import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';
import {LeftToRightAnimation} from './animations';

import TravelHomeScreen from '../screens/Main/Travel/TravelsHomeScreen';
import TravelOrderDetailScreen from '../screens/Main/Travel/TravelOrderDetailScreen';
import TravelOrderTrackingScreen from '../screens/Main/Travel/TravelOrderTrackingScreen';
import TravelOrderChat from '../screens/Main/Travel/TravelOrderChat';
import TravelEditPackageScreen from '../screens/Main/Travel/TravelEditPackageScreen';
import HomePackageLocationScreen from '../screens/Main/Home/HomePackageLocationScreen';
import HomePackageLocationSearchScreen from '../screens/Main/Home/HomePackageLocationSearchScreen';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="MainTravelHome"
        screenOptions={LeftToRightAnimation}
    >
        <Nav.Screen name="MainTravelHome" component={TravelHomeScreen}/>
        <Nav.Screen name="MainTravelOrderDetail" component={TravelOrderDetailScreen}/>
        <Nav.Screen name="MainTravelOrderTracking" component={TravelOrderTrackingScreen}/>
        <Nav.Screen name="MainTravelOrderChat" component={TravelOrderChat}/>
        <Nav.Screen name="MainTravelEditPackage" component={TravelEditPackageScreen}/>

        <Nav.Screen name="LocationGet" component={HomePackageLocationScreen}/>
        <Nav.Screen name="LocationSearch" component={HomePackageLocationSearchScreen}/>
    </Nav.Navigator>;
};

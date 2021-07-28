import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import AccountHomeScreen from '../screens/Main/Account/AccountHomeScreen';
import ProfileEditScreen from '../screens/Main/Account/ProfileEditScreen';
import SupportCenterScreen from '../screens/Main/Account/SupportCenterScreen';
import SupportCenterFaqScreen from '../screens/Main/Account/SupportCenterFaqScreen';
import ContactUsScreen from '../screens/Main/Account/ContactUsScreen';
import ContactMailScreen from '../screens/Main/Account/ContactMailScreen';
import AccountSelectOrderScreen from '../screens/Main/Account/AccountSelectOrderScreen';
import HomePaymentMethodsScreen from '../screens/Main/Home/HomePaymentMethodsScreen';
import MyAddressesScreen from '../screens/Main/Account/MyAddressesScreen';
import MyAddressConfirmScreen from '../screens/Main/Account/MyAddressConfirmScreen';
import MyAddressEditScreen from '../screens/Main/Account/MyAddressEditScreen';
import ConfirmMobileScreen from '../screens/Auth/ConfirmMobileScreen';
import AboutPikScreen from '../screens/Main/Account/AboutPikScreen';
import CustomBackendPageScreen from '../screens/CustomBackendPageScreen';
import {LeftToRightAnimation} from './animations';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="MainAccountHome"
        screenOptions={LeftToRightAnimation}
    >
        <Nav.Screen name="MainAccountHome" component={AccountHomeScreen}/>
        <Nav.Screen name="MainProfileEdit" component={ProfileEditScreen}/>
        <Nav.Screen name="ConfirmMobile" component={ConfirmMobileScreen}/>
        <Nav.Screen name="MainSupportCenter" component={SupportCenterScreen}/>
        <Nav.Screen name="MainSupportCenterCategory" component={SupportCenterScreen}/>
        <Nav.Screen name="MainSupportCenterFaq" component={SupportCenterFaqScreen}/>
        <Nav.Screen name="AboutUs" component={AboutPikScreen}/>
        <Nav.Screen name="ContactUs" component={ContactUsScreen}/>
        <Nav.Screen name="AccountSelectOrder" component={AccountSelectOrderScreen}/>
        <Nav.Screen name="PaymentMethods" component={HomePaymentMethodsScreen}/>
        <Nav.Screen name="MyAddresses" component={MyAddressesScreen}/>
        <Nav.Screen name="MyAddressConfirm" component={MyAddressConfirmScreen}/>
        <Nav.Screen name="MyAddressEdit" component={MyAddressEditScreen}/>
        <Nav.Screen name="CustomBackendPage" component={CustomBackendPageScreen}/>
        <Nav.Screen name="ContactMail" component={ContactMailScreen}/>
    </Nav.Navigator>;
};

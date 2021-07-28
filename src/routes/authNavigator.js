import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';
import {LeftToRightAnimation} from './animations';

import AuthScreen from '../screens/Auth/AuthScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ConfirmMobileScreen from '../screens/Auth/ConfirmMobileScreen';
import PasswordRecoveryScreen from '../screens/Auth/PasswordRecoveryScreen';
import TermsAndConditionsScreen from '../screens/Auth/TermsAndConditionsScreen';
import DataPrivacyScreen from '../screens/Auth/DataPrivacyScreen';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="AuthIndex"
        screenOptions={LeftToRightAnimation}
    >
        <Nav.Screen name="AuthIndex" component={AuthScreen}/>
        <Nav.Screen name="AuthLogin" component={LoginScreen}/>
        <Nav.Screen name="AuthRegister" component={RegisterScreen}/>
        <Nav.Screen name="AuthConfirmMobile" component={ConfirmMobileScreen}/>
        <Nav.Screen name="AuthPasswordRecovery" component={PasswordRecoveryScreen}/>
        <Nav.Screen name="AuthTermsAndConditions" component={TermsAndConditionsScreen}/>
        <Nav.Screen name="AuthDataPrivacy" component={DataPrivacyScreen}/>
    </Nav.Navigator>;
};

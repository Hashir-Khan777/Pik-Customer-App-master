/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';
import codePush from "react-native-code-push";
import {NavigationContainer} from '@react-navigation/native';
import {Provider as ReduxProvider} from 'react-redux';
import RootNavigator from './routes/rootNavigator';

// const store = createStore(rootReducer);
import store from './redux/store';

import {AuthProvider} from './utils/auth';

const App: () => React$Node = () => {
    return (
        <NavigationContainer>
            <ReduxProvider store={store}>
                <AuthProvider>
                    <RootNavigator/>
                </AuthProvider>
            </ReduxProvider>
        </NavigationContainer>
    );
};

let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    updateDialog: false,
    installMode: codePush.InstallMode.IMMEDIATE
};

export default codePush(codePushOptions)(App);

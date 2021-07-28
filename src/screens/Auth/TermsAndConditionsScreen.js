import React, {useState} from 'react';
import _ from 'lodash'
import {
    StyleSheet,
    View,
    Text, StatusBar,
} from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
} from '../../utils/constants';
import {API_BASE_URL} from '@env';
import WebView from 'react-native-webview'
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';

const TermsAndConditionsScreen = ({navigation}) => {
    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    title={'Terms And Conditions'}
                    color={HeaderPage.Colors.BLACK}
                />}
                noScroll
                contentStyle={{
                    flex: 1,
                }}
            >
                <WebView
                    source={{uri: `${API_BASE_URL}/page/Terms%20Of%20Service`}}
                    style={[StyleSheet.absoluteFill]}
                />
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        marginTop: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
});

export default TermsAndConditionsScreen;

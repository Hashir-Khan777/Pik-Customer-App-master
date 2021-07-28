import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
} from 'react-native';
import HeaderPage from '../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
} from '../utils/constants';
import {API_BASE_URL} from '@env';
import WebView from 'react-native-webview'
import PageContainerDark from '../components/PageContainerDark';
import KeyboardAvoidingScreen from '../components/KeyboardAvoidingScreen';

import { useTranslation } from 'react-i18next';

const CustomBackendPageScreen = ({navigation, route}) => {
    let { t } = useTranslation();

    let { pageTitle } = route.params || {}

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    title={t('pages.about_pik.' + pageTitle.replace(/\s/g, '')) || ""}
                    color={HeaderPage.Colors.BLACK}
                />}
                noScroll
                contentStyle={{
                    flex: 1,
                }}
            >
                {!!pageTitle ? (
                    <WebView
                        source={{uri: `${API_BASE_URL}/page/${pageTitle}`}}
                        style={[StyleSheet.absoluteFill]}
                    />
                ) : (
                    <Text style={styles.h1}>Page Title Not Defined</Text>
                )}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 16,
        marginTop: 16,
        textAlign: 'center'
    },
    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
});

export default CustomBackendPageScreen;

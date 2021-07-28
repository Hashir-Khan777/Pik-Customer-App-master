import React from 'react';
import {useNavigation} from '@react-navigation/native'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {COLOR_NEUTRAL_WHITE, COLOR_PRIMARY_1000, COLOR_PRIMARY_500} from '../utils/constants';
import Avatar from './Avatar';
import {uploadUrl} from '../utils/helpers';
import withAuth from '../redux/connectors/withAuth';

import { useTranslation } from 'react-i18next';

const HeaderHome = ({authUser}) => {
    let { t } = useTranslation();

    const navigation = useNavigation();

    const navigateToProfile = async () => {
        await navigation.navigate(
            "MainAccount",
            {
                screen: "MainAccountHome",
            }
        )
        navigation.navigate(
            "MainAccount",
            {
                screen: "MainProfileEdit",
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <View>
                    <Text style={styles.hello}>{t('pages.mainHome.Header.Hello')} {authUser.firstName}</Text>
                    <Text style={styles.help}>{t('pages.mainHome.Header.how_help')}</Text>
                </View>
                <TouchableOpacity onPress={() => navigateToProfile()}>
                    <Avatar
                        size={48}
                        source={{uri: uploadUrl(authUser.avatar)}}
                        borderColor={COLOR_PRIMARY_1000}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        paddingBottom: 16,
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    hello: {
        color: COLOR_PRIMARY_500,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
    help: {
        color: COLOR_NEUTRAL_WHITE,
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
    },
});

export default withAuth(HeaderHome)

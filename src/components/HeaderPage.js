import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomButton from './CustomButton';
import {BLACK, BLUE, GREEN, ORANGE} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderPage = ({color, title, rightButtons}) => {
    const navigation = useNavigation();

    const GoBackButton = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" style={styles.goBackIcon} color="white"/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[
            styles.container,
            styles['bg_' + color],
        ]}>
            <View style={styles.flex}>
                <View style={styles.buttonContainer}>
                    {(navigation && navigation.canGoBack()) && <GoBackButton/>}
                </View>
                <Text style={[
                    styles.title,
                ]}>{title}</Text>
                <View style={[styles.buttonContainer, {paddingRight: 5}]}>
                    {/*<Icon name="arrow-forward" size={30} color="white" />*/}
                    {rightButtons}
                </View>
            </View>
        </View>
    );
};
const Colors = {
    ORANGE: 'orange',
    BLACK: 'black',
    BLUE: 'blue',
    GREEN: 'green',
};

HeaderPage.Colors = Colors;

HeaderPage.propTypes = {
    title: PropTypes.string,
    color: PropTypes.oneOf(Object.values(Colors)),
};

HeaderPage.defaultProps = {
    color: Colors.BLACK,
    title: 'Header',
};

const styles = StyleSheet.create({
    container: {
        // height: 50,
        paddingTop: 25,
        paddingBottom: 16,
    },
    goBackIcon: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        paddingHorizontal: 16,
        // paddingRight: 0,
    },
    flex: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        flexGrow: 0,
    },
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 10,
        flexGrow: 1,
    },
    ['color_' + Colors.ORANGE]: {color: ORANGE},
    ['color_' + Colors.BLACK]: {color: BLACK},
    ['color_' + Colors.BLUE]: {color: BLUE},
    ['color_' + Colors.GREEN]: {color: GREEN},

    ['bg_' + Colors.ORANGE]: {backgroundColor: ORANGE},
    ['bg_' + Colors.BLACK]: {backgroundColor: BLACK},
    ['bg_' + Colors.BLUE]: {backgroundColor: BLUE},
    ['bg_' + Colors.GREEN]: {backgroundColor: GREEN},
});

export default HeaderPage;

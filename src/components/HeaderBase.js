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

const HeaderBase = ({color, title, containerStyle, childrenContainerStyle, children, rightButtons}) => {
    const navigation = useNavigation();

    const GoBackButton = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" style={{fontSize: 16, lineHeight: 24}} color="white"/>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[
            styles.container,
            styles['bg_' + color],
            containerStyle,
        ]}>
            <View style={styles.flex}>
                <View style={styles.buttonContainer}>
                    {(navigation && navigation.canGoBack()) && <GoBackButton/>}
                </View>
                <View style={[styles.childrenContainer, childrenContainerStyle]}>{children}</View>
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

HeaderBase.Colors = Colors;

HeaderBase.propTypes = {
    title: PropTypes.string,
    color: PropTypes.oneOf(Object.values(Colors)),
    rightButtons: PropTypes.oneOf([
        PropTypes.object,
        PropTypes.array,
    ]),
};

HeaderBase.defaultProps = {
    color: Colors.BLACK,
    title: 'Header',
    rightButtons: [],
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    flex: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        flexGrow: 0,
    },
    childrenContainer: {
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

export default HeaderBase;

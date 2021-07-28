import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import {ORANGE, BLACK, BLUE, GREEN, INPUT_HEIGHT} from '../utils/constants';

const CustomButton = ({title, color, onPress, border, style}) => {
    const _onPress = e => {
        onPress && onPress(e);
    };
    return <TouchableOpacity onPress={_onPress} style={[{height: INPUT_HEIGHT}, style]}>
        <View style={[
            styles.container,
            border ? styles.containerBordered : {},
            styles[(border ? 'bdr_' : 'bg_') + color],
            style
        ]}>
            <Text style={[
                styles.title,
                border ? styles['color_' + color] : {},
            ]}>{title}</Text>
        </View>
    </TouchableOpacity>;
};

const Colors = {
    ORANGE: 'orange',
    BLACK: 'black',
    BLUE: 'blue',
    GREEN: 'green',
};

CustomButton.Colors = Colors;

CustomButton.propTypes = {
    color: PropTypes.oneOf(Object.values(Colors)),
    border: PropTypes.bool,
};
CustomButton.defaultProps = {
    color: 'blue',
    border: false,
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        height: INPUT_HEIGHT,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerBordered: {
        borderWidth: 2,
    },
    ['color_' + Colors.ORANGE]: {color: ORANGE},
    ['color_' + Colors.BLACK]: {color: BLACK},
    ['color_' + Colors.BLUE]: {color: BLUE},
    ['color_' + Colors.GREEN]: {color: GREEN},

    ['bg_' + Colors.ORANGE]: {backgroundColor: ORANGE},
    ['bg_' + Colors.BLACK]: {backgroundColor: BLACK},
    ['bg_' + Colors.BLUE]: {backgroundColor: BLUE},
    ['bg_' + Colors.GREEN]: {backgroundColor: GREEN},

    ['bdr_' + Colors.ORANGE]: {borderColor: ORANGE},
    ['bdr_' + Colors.BLACK]: {borderColor: BLACK},
    ['bdr_' + Colors.BLUE]: {borderColor: BLUE},
    ['bdr_' + Colors.GREEN]: {borderColor: GREEN},

    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ffffff',
    },

});

export default CustomButton;

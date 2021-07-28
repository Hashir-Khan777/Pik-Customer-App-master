import React, {useState, useCallback} from 'react';
import RNLinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {SvgXml} from 'react-native-svg';

import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text, ActivityIndicator,
} from 'react-native';
import {INPUT_HEIGHT} from '../utils/constants';
import useComponentSize from '../utils/useComponentSize';

const GradientButton = ({title, onPress, gradient, inProgress, disabled, ...props}) => {
    const [size, onLayout] = useComponentSize();
    const _onPress = e => {
        onPress && onPress(e);
    };

    function rotate(cx, cy, x, y, radians) {
        let cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [nx, ny];
    }

    const calculateGradient = () => {
        if (!size) {
            return {};
        }

        let {width, height} = size;
        let theta = Math.atan(height / width);
        let h2 = (height * Math.cos(theta)) + (width * Math.sin(theta));
        let cx = width / 2, cy = height / 2;
        let dy = h2 / 2;

        let [x1, y1] = rotate(cx, cy, cx, cy - dy, theta);
        let [x2, y2] = rotate(cx, cy, cx, cy + dy, theta);

        return {start: {x: x1 / width, y: y1 / height}, end: {x: x2 / width, y: y2 / height}};
    };

    const buttonGradient = {...gradient, ...calculateGradient()};
    return <TouchableOpacity disabled={disabled} onPress={_onPress} style={props.style}>
        <RNLinearGradient onLayout={onLayout} {...buttonGradient} style={[styles.container, props.style]}>
            {inProgress ? (
                <ActivityIndicator style={styles.progress} size="large" color="white" />
            ) : (
                <Text style={[styles.title, props.titleStyle]}>{title}</Text>
            )}
            {disabled && <View style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(255, 255, 255, 0.4)'}]}/>}
        </RNLinearGradient>
    </TouchableOpacity>;
};

GradientButton.propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    gradient: PropTypes.object,
};

GradientButton.defaultProps = {
    title: 'Button',
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        height: INPUT_HEIGHT,
        // borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: INPUT_HEIGHT,
        color: '#ffffff',
    },
    progress:{
    }
});

export default GradientButton;

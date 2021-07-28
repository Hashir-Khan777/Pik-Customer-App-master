import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import GradientView from './GradientView';
import {COLOR_PRIMARY_1000, GRADIENT_2, GRADIENT_8} from '../utils/constants';

const ProgressBarGradient = ({value, style}) => {
    value = Math.min(100, parseFloat(value));
    return (
        <View style={[style, styles.container]}>
            <GradientView
                gradient={GRADIENT_2}
                rotation={0.01}
                style={StyleSheet.absoluteFill}
            />
            <GradientView
                gradient={GRADIENT_8}
                rotation={0}
                style={[StyleSheet.absoluteFill, styles.mask, {left: `${value}%`}]}
            />
        </View>
    );
};
ProgressBarGradient.defaultValue = {
    value: 50,
};

const styles = StyleSheet.create({
    container: {
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
    },
    mask: {
        right: '-1%',
    },
});

export default ProgressBarGradient;

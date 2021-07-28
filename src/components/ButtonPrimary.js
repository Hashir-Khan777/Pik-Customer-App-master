import React from 'react';
import PropTypes from 'prop-types';
import {} from 'react-native';
import GradientButton from './GradientButton';
import {GRADIENT_2} from '../utils/constants';

const PrimaryButton = ({title, size, onPress, inProgress, disabled, ...props}) => {
    return (
        <GradientButton
            {...props}
            title={title}
            onPress={onPress}
            disabled={disabled}
            inProgress={inProgress}
            gradient={GRADIENT_2}
        />
    );
};
PrimaryButton.propTypes = {
    title: PropTypes.string,
    size: PropTypes.oneOf(['lg', 'sm']),
    onPress: PropTypes.func,
};
PrimaryButton.defaultProps = {
    title: 'Button',
    size: 'lg',
    onPress: () => {
    },
};

export default PrimaryButton;

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';
import AnimatedInput from './AnimatedInput';
import {COLOR_NEUTRAL_GRAY, COLOR_TERTIARY_ERROR, GRAY_LIGHT_EXTRA} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useComponentSize from '../utils/useComponentSize';
import globalStyles from '../utils/globalStyles';

const CustomAnimatedInput = ({placeholder, value, onChangeText, errorText, validator, type, button, autoFocus, ...props}) => {
    const [buttonContainerSize, onLayout] = useComponentSize();

    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onFocus = e => {
        setFocused(true);
    };
    const onBlur = e => {
        setFocused(false);
    };

    return <React.Fragment>
        <View style={[styles.wrapper, !!errorText ? styles.hasError : {}]}>
            <AnimatedInput
                placeholder={placeholder}
                // valid={!(!!error)}
                // errorText={errorText}
                styleInput={{paddingRight: (buttonContainerSize?.width||0)}}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlure={onBlur}
                value={value}
                autoFocus={autoFocus}
                type={passwordVisible ? 'text' : type}
            />
            <View style={styles.buttonsContainer} onLayout={onLayout}>
                <View style={globalStyles.flexRowCenter}>
                    {type==='password' && (
                        <FontAwesome5
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            style={styles.passwordToggle}
                            size={22}
                            name={passwordVisible ? 'eye' : 'eye-slash'}

                        />
                    )}
                    {button}
                </View>
            </View>
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </React.Fragment>
};

CustomAnimatedInput.propTypes = {
    placeholder: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'number', 'password', 'email'])
};

CustomAnimatedInput.defaultProps = {
    type: 'text',
    autoFocus: false,
};

const styles = StyleSheet.create({
    wrapper: {
        // height: INPUT_HEIGHT,
        borderWidth: 0,
        backgroundColor: GRAY_LIGHT_EXTRA,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
    passwordToggle: {
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 24,
        marginRight: 8,
        color: COLOR_NEUTRAL_GRAY,
    },
    hasError:{
        borderWidth: 1,
        borderColor: COLOR_TERTIARY_ERROR,
    },
    input: {
        borderWidth: 1,
        padding: 0,
    },
    inputFocused: {
        // height: 0.66 * INPUT_HEIGHT,
        // lineHeight: 0.66 * INPUT_HEIGHT
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    },
    buttonsContainer: {
        position: 'absolute',
        right: 0,
        height: '100%',
        paddingHorizontal: 8,
    }
});

export default CustomAnimatedInput;

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
} from 'react-native';
import AnimatedInput from './AnimatedInput';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    GRAY_LIGHT_EXTRA,
    INPUT_HEIGHT,
} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const LocationPicker = ({placeholder, value, onChange, errorText, onPress, ...props}) => {

    return <React.Fragment>
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.wrapper, !!errorText ? styles.hasError : {}]}>
                {value ? (
                    <Text numberOfLines={1} style={styles.value}>{value.formatted_address}</Text>
                ) : (
                    <Text numberOfLines={1} style={styles.placeHolder}>{placeholder}</Text>
                )}
                <FontAwesome5 name="compass" style={[styles.icon]}/>
            </View>
        </TouchableOpacity>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </React.Fragment>
};

LocationPicker.propTypes = {
    placeholder: PropTypes.string,
    label: PropTypes.string,
};

const styles = StyleSheet.create({
    wrapper: {
        height: INPUT_HEIGHT,
        borderWidth: 0,
        backgroundColor: GRAY_LIGHT_EXTRA,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingRight: 32,
        paddingVertical: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        color: COLOR_PRIMARY_900,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        flexGrow: 1,
        textAlign: 'left',
    },
    placeHolder: {
        color: COLOR_NEUTRAL_GRAY,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        flexGrow: 1,
    },
    hasError:{
        borderWidth: 1,
        borderColor: COLOR_TERTIARY_ERROR,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    },
    icon: {
        color: COLOR_NEUTRAL_GRAY,
        fontSize: 16,
        lineHeight: 24,
        position: 'absolute',
        right: 8,
    }
});

export default LocationPicker;

import React from 'react'
import {
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    GRAY_LIGHT_EXTRA,
    INPUT_HEIGHT,
} from '../utils/constants';
import globalStyles from '../utils/globalStyles';

const CustomTextInput = ({
    style,
    value,
    leftIcon,
    rightIcon,
    onChangeText,
    placeholder,
    onPress,
    clearable,
    placeholderColor,
    color,
    backgroundColor
}) => {
    const renderLeftIcon = () => {
        if(!leftIcon)
            return null
        if(typeof leftIcon === 'string')
            return <FontAwesome5 name={leftIcon} style={[styles.icon, {color: placeholderColor}]}/>
        else
            return <View style={{marginRight: 16}}>{leftIcon}</View>
    }

    return <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.container, {backgroundColor}, style]}>
            {renderLeftIcon()}
            <View style={{flexGrow: 1, flex: 1}}>
                {onChangeText ? (
                    <TextInput
                        style={styles.input}
                        value={value}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        underlineColorAndroid="transparent"
                    />
                 ) : (
                     <View style={globalStyles.flexRowCenter}>
                         <View style={globalStyles.flexColumn}>
                             <Text numberOfLines={1} style={[styles.placeholder, {color: !!value ? color : placeholderColor}]}>{value || placeholder}</Text>
                         </View>
                     </View>
                )}
            </View>
            {rightIcon}
            {(clearable && !!onChangeText && !!value) && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <FontAwesome5 name='times-circle' solid style={styles.iconClean}/>
                </TouchableOpacity>
            )}
        </View>
    </TouchableWithoutFeedback>
}

CustomTextInput.propTypes = {
}

CustomTextInput.defaultProps = {
    backgroundColor: GRAY_LIGHT_EXTRA,
    placeholderColor: COLOR_NEUTRAL_GRAY,
    color: COLOR_PRIMARY_900,
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4e4b4b',
        borderRadius: 8,
        paddingHorizontal: 16,
        height: INPUT_HEIGHT,
        alignItems: 'center',
    },
    input: {
        borderWidth: 0,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        paddingVertical: 10,
    },
    placeholder: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
    },
    value: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    icon:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
        marginRight: 16,
    },
    iconClean:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
    },
})

export default CustomTextInput


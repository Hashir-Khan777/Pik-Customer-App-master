/**
 * extend of: https://www.npmjs.com/package/react-native-phone-number-input
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import CountryPicker, {
    getCallingCode,
    DARK_THEME,
    DEFAULT_THEME,
    CountryModalProvider,
} from 'react-native-country-picker-modal';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {COLOR_TERTIARY_ERROR} from '../../utils/constants';

const dropDown =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAi0lEQVRYR+3WuQ6AIBRE0eHL1T83FBqU5S1szdiY2NyTKcCAzU/Y3AcBXIALcIF0gRPAsehgugDEXnYQrUC88RIgfpuJ+MRrgFmILN4CjEYU4xJgFKIa1wB6Ec24FuBFiHELwIpQxa0ALUId9wAkhCnuBdQQ5ngP4I9wxXsBDyJ9m+8y/g9wAS7ABW4giBshQZji3AAAAABJRU5ErkJggg==';
import {PhoneNumberUtil} from 'google-libphonenumber';
const phoneUtil = PhoneNumberUtil.getInstance();

export default class PhoneInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            code: props.defaultCode ? undefined : '507',
            number: props.defaultValue ? props.defaultValue : '',
            modalVisible: false,
            countryCode: props.defaultCode ? props.defaultCode : 'PA',
            disabled: false,
            placeholder: props.placeholder
        };
    }

    async UNSAFE_componentWillMount() {
        const {defaultCode} = this.props;
        console.log("===== defaultCode ======= ", defaultCode, this.state.code);
        if (defaultCode) {
            const code = await getCallingCode(defaultCode);
            this.setState({code});
        }
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        const {defaultValue, defaultCode, onChangeFormattedText, disabled: nextDisabled} = nextProps;
        const {number, disabled, countryCode, code} = this.state;
        console.log("===== defaultCode, defaultValue ======= ", defaultCode, countryCode, defaultValue, code);

        if(onChangeFormattedText && defaultCode === undefined && code && defaultValue !== '') {
            onChangeFormattedText(`+${code}${defaultValue}`);
        }
        
        if ((defaultValue || defaultValue === '') && defaultValue !== number) {
            this.setState({number: defaultValue});
        }
        if(countryCode !== defaultCode){
            const code = await getCallingCode(defaultCode);
            this.setState({countryCode: defaultCode, code})
        }
        if (disabled !== nextDisabled) {
            this.setState({disabled: nextDisabled});
        }
    }

    getCountryCode = () => {
        return this.state.countryCode;
    };

    getCallingCode = () => {
        return this.state.code;
    };

    isValidNumber = (number) => {
        try {
            const {countryCode} = this.state;
            const parsedNumber = phoneUtil.parse(number, countryCode);
            return phoneUtil.isValidNumber(parsedNumber);
        } catch (err) {
            return false;
        }
    };

    onSelect = (country) => {
        this.setState({
            countryCode: country.cca2,
            code: country.callingCode[0],
        });
        const {onChangeFormattedText} = this.props;
        if (onChangeFormattedText) {
            if (country.callingCode[0]) {
                onChangeFormattedText(`+${country.callingCode[0]}${this.state.number}`);
            } else {
                onChangeFormattedText(this.state.number);
            }
        }
    };

    onChangeText = (text) => {
        this.setState({number: text});
        const {onChangeText, onChangeFormattedText} = this.props;
        if (onChangeText) {
            onChangeText(text);
        }
        if (onChangeFormattedText) {
            const {code} = this.state;
            if (code) {
                onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
            } else {
                onChangeFormattedText(text);
            }
        }
    };

    render() {
        const {
            withShadow,
            withDarkTheme,
            codeTextStyle,
            textInputProps,
            textInputStyle,
            autoFocus,
            disableArrowIcon,
            flagButtonStyle,
            containerStyle,
            textContainerStyle,
            errorText,
            placeholder
        } = this.props;
        const {modalVisible, code, countryCode, number, disabled} = this.state;
        return (
            <CountryModalProvider>
                <View
                    style={[
                        styles.container,
                        withShadow ? styles.shadow : {},
                        containerStyle ? containerStyle : {},
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.flagButtonView,
                            flagButtonStyle ? flagButtonStyle : {},
                            {borderWidth: errorText ? 1 : 0, borderColor: COLOR_TERTIARY_ERROR}
                        ]}
                        disabled={disabled}
                        onPress={() => this.setState({modalVisible: true})}
                    >
                        <CountryPicker
                            onSelect={this.onSelect}
                            withEmoji
                            withFilter
                            withFlag
                            countryCode={countryCode}
                            withCallingCode
                            disableNativeModal={disabled}
                            visible={modalVisible}
                            theme={withDarkTheme ? DARK_THEME : DEFAULT_THEME}
                            onClose={() => this.setState({modalVisible: false})}
                        />
                        {!disableArrowIcon && (
                            <Image
                                source={{uri: dropDown}}
                                resizeMode="contain"
                                style={styles.dropDownImage}
                            />
                        )}
                    </TouchableOpacity>
                    <View
                        style={[
                            styles.textContainer,
                            textContainerStyle ? textContainerStyle : {},
                        ]}
                    >
                        {code && (
                            <Text
                                style={[styles.codeText, codeTextStyle ? codeTextStyle : {}]}
                            >{`+${code}`}</Text>
                        )}
                        <TextInput
                            style={[styles.numberText, textInputStyle ? textInputStyle : {}]}
                            placeholder={placeholder}
                            onChangeText={this.onChangeText}
                            value={number}
                            editable={disabled ? false : true}
                            selectionColor="black"
                            keyboardAppearance={withDarkTheme ? 'dark' : 'default'}
                            keyboardType="number-pad"
                            autoFocus={autoFocus}
                            {...textInputProps}
                        />
                    </View>
                    {!!errorText && <Text style={styles.errorText}>
                        <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
                        <Text>  {errorText}</Text>
                    </Text>}
                </View>
            </CountryModalProvider>
        );
    }
}

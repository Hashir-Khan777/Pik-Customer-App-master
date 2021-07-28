import React, { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View, Image
} from 'react-native';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900, COLOR_TERTIARY_ERROR,
    GRAY_LIGHT_EXTRA,
    INPUT_HEIGHT,
} from '../utils/constants';
import globalStyles from '../utils/globalStyles';
import { SvgXml } from 'react-native-svg';
import svgs from '../utils/svgs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
    loadPaymentMethods as loadPaymentMethodsAction
} from '../redux/actions';

const STORAGE_KEY = 'last-used-credit-card'

import { useTranslation } from 'react-i18next';

const PaymentMethodPicker = ({ selected, onValueChange, items, placeholder, errorText, ...props }) => {
    let { t } = useTranslation();

    const navigation = useNavigation();

    const selectedItem = useMemo(() => {
        return items.find(item => item.id == selected)
    }, [items, selected])

    if (!props.paymentMethodLoaded && !props.paymentMethodLoading && props.loadPaymentMethods)
        props.loadPaymentMethods();


    const cardXml = type => {
        type = !!type ? type.toLowerCase() : type;
        if (svgs['icon-payment-' + type])
            return svgs['icon-payment-' + type]
        else
            return svgs['icon-payment-default']
    }

    const addSlashToExp = exp => `${exp.slice(0, 2)}/${exp.slice(2, 4)}`

    const setCreditCard = value => {
        AsyncStorage.setItem(`${props.authUser._id}-${STORAGE_KEY}`, value)
        onValueChange && onValueChange(value)
    }

    const goToCardList = () => {
        navigation.navigate('MainHomePaymentMethods', { setCreditCard, selected })
    }

    React.useEffect(() => {
        AsyncStorage.getItem(`${props.authUser._id}-${STORAGE_KEY}`)
            .then(value => {
                if (value)
                    onValueChange(value)
            })
    }, [])

    return <TouchableOpacity onPress={goToCardList}>
        <View style={[styles.wrapper, errorText ? styles.withError : {}]}>
            {(!!selectedItem && cardXml(selectedItem.cc_type)) && (
                <View>
                    {/* <SvgXml style={styles.logo} height={24} xml={cardXml(selectedItem.cc_type)}/> */}
                    <Image
                        style={{ height: 24, width: 32, resizeMode: 'contain' }}
                        source={cardXml(selectedItem.cc_type)}
                    />
                </View>
            )}
            <View style={styles.cardContainer}>
                {selectedItem ? (
                    <View>
                        <Text style={styles.cardNumber}>{selectedItem.cc_number}</Text>
                    </View>
                ) : (
                    <Text style={styles.placeHolder}>{placeholder || t('payment_detail.select_card_number')}</Text>
                )}
            </View>
            {selectedItem && <Text style={styles.placeHolder}>{addSlashToExp(selectedItem.cc_exp)}  </Text>}
            <View style={globalStyles.arrowDown} />
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]} />
            <Text>  {errorText}</Text>
        </Text>}

    </TouchableOpacity>
};

const mapStateToProps = state => {
    const { list, loaded, loading } = state.app.paymentMethods;
    const { user } = state.auth
    return {
        authUser: user,
        items: list,
        paymentMethodLoading: loading,
        paymentMethodLoaded: loaded,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadPaymentMethods: () => dispatch(loadPaymentMethodsAction())
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: GRAY_LIGHT_EXTRA,
        height: INPUT_HEIGHT,
        borderRadius: 5,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    withError: {
        borderWidth: 1,
        borderColor: COLOR_TERTIARY_ERROR
    },
    logo: {
        marginRight: 10,
        height: 24,
        maxWidth: 32,
    },
    cardContainer: {
        flexGrow: 1,
    },
    cardNumber: {
        color: COLOR_PRIMARY_900,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    placeHolder: {
        color: COLOR_NEUTRAL_GRAY,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodPicker);

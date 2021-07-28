import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {priceToFixed} from '../utils/helpers';

import { useTranslation } from 'react-i18next';

const PriceBreakdown = ({price, distance}) => {
    let { t } = useTranslation()
    const navigation = useNavigation();

    const gotoLegalPage = async () => {
        navigation.popToTop();
        await navigation.navigate(
            "MainAccount",
            {
                screen: "MainAccountHome",
            }
        )
        navigation.navigate(
            "MainAccount",
            {
                screen: "AboutUs"
            }
        )
    }

    return <>
        <View style={styles.priceItem}>
            <Text style={styles.priceItemTitle}>{t('payment_detail.distance')} {distance?.text}</Text>
            <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.distance)}</Text>
        </View>
        <View style={styles.priceItemSpacer}/>
        <View style={styles.priceItem}>
            <Text style={styles.priceItemTitle}>{t('payment_detail.vehicle_type')}</Text>
            <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.vehicleType)}</Text>
        </View>
        {(price?.businessCoverage > 0) && <>
            <View style={styles.priceItemSpacer}/>
            <View style={styles.priceItem}>
                <Text style={styles.priceItemTitle}>{t('payment_detail.coverage_discount')}</Text>
                <Text style={styles.priceItemValue}>- US$ {priceToFixed(price?.businessCoverage)}</Text>
            </View>
        </>}
        {!!price?.tax && <>
            <View style={styles.priceItemSpacer}/>
            <View style={styles.priceItem}>
                <Text style={styles.priceItemTitle}>{t('payment_detail.tax')}</Text>
                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.tax)}</Text>
            </View>
        </>}
        {(price?.businessCoverage > 0) && (price.distance + price.vehicleType - price.businessCoverage < 1) && <>
            <View style={styles.priceItemSpacer}/>
            <View style={styles.minTransaction}>
                <Text style={styles.minTransactionTxt}>Costo mínimo de transacción en PIK es de $1.00. </Text>
                <TouchableOpacity onPress={gotoLegalPage}>
                    <Text style={styles.minTransactionTxtLink}>Ver terminos de uso</Text>
                </TouchableOpacity>
            </View>
        </>}
    </>
}

const styles = StyleSheet.create({
    priceItem:{
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 16,
    },
    priceItemSpacer:{
        height: 1,
        backgroundColor: '#ddd',
    },
    priceItemTitle:{
        flexGrow: 1,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    priceItemValue:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    minTransaction: {
        paddingVertical: 16
    },
    minTransactionTxt: {
        color: '#f12711'
    },
    minTransactionTxtLink: {
        color: '#f12711',
        textDecorationLine: 'underline'
    }
})

export default PriceBreakdown;

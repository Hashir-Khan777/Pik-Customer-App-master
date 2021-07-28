import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressBarGradient from '../ProgressBarGradient';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';

const SubmenuScanQR = ({onAccept, onIgnore}) => {
    return (
        <>
            <View style={styles.dataWrapper}>
                <View style={styles.dataContainer}>
                    <View style={{flexGrow: 1}}>
                        <Text style={styles.title2}>Katarina Doe</Text>
                        <Text style={styles.title3}>Order ID: 14521245</Text>
                    </View>
                    <View>
                        <Text style={[styles.title1, {color: COLOR_PRIMARY_900}]}>0/4</Text>
                    </View>
                </View>
            </View>
            <View style={styles.dataWrapper}>
                <View style={styles.dataContainer}>
                    <View style={{paddingRight: 16}}>
                        <SvgXml width={22} xml={svgs['icon-package-closed']}/>
                    </View>
                    <View style={{flexGrow: 1}}>
                        <Text style={styles.title1}>Pickup</Text>
                        <Text style={styles.title2}>Dell Company Inc</Text>
                        <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                    </View>
                    <View>
                        <SvgXml width={22} xml={svgs['icon-checkbox-checked']}/>
                    </View>
                </View>
            </View>
            <View style={styles.dataWrapper}>
                <View style={styles.dataContainer}>
                    <View style={{paddingRight: 16}}>
                        <SvgXml width={22} xml={svgs['icon-package-closed']}/>
                    </View>
                    <View style={{flexGrow: 1}}>
                        <Text style={styles.title1}>Pickup</Text>
                        <Text style={styles.title2}>Dell Company Inc</Text>
                        <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                    </View>
                    <View>
                        <SvgXml width={22} xml={svgs['icon-checkbox-unchecked']}/>
                    </View>
                </View>
            </View>
            <FormControl>
                <ButtonPrimary
                    title="Done"
                />
            </FormControl>
        </>
    );
};

const styles = StyleSheet.create({
    dataWrapper: {
        marginBottom: 24,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    title2: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    title3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_PRIMARY_900,
    },
    value: {
        fontWeight: '800',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
        textAlign: 'right',
    },
});

export default SubmenuScanQR;

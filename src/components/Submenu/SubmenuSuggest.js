import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ProgressBarGradient from '../ProgressBarGradient';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../../utils/constants';

const SubmenuSuggest = ({onAccept, onIgnore}) => {
    return (
        <>
            <View style={styles.dataWrapper}>
                <View style={styles.dataContainer}>
                    <View>
                        <Text style={styles.title1}>Pickup</Text>
                        <Text style={styles.title2}>Dell Company Inc</Text>
                        <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                    </View>
                    <View>
                        <Text style={styles.title1}>Distance</Text>
                        <Text style={styles.value}>3.8 km</Text>
                    </View>
                </View>
            </View>
            <View style={styles.dataWrapper}>
                <View style={styles.dataContainer}>
                    <View>
                        <Text style={styles.title1}>Dropoff</Text>
                        <Text style={styles.title2}>Dell Company Inc</Text>
                        <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                    </View>
                    <View>
                        <Text style={styles.title1}>Earning</Text>
                        <Text style={styles.value}>$3.50</Text>
                    </View>
                </View>
            </View>
            <ProgressBarGradient style={{marginBottom: 65}} value={60}/>
            <FormControl>
                <ButtonPrimary
                    title="Accept Pickup"
                    onPress={() => {
                        onAccept && onAccept();
                    }}
                />
            </FormControl>
            <FormControl>
                <ButtonSecondary
                    title="Ignore"
                    onPress={() => {
                        onIgnore && onIgnore();
                    }}
                />
            </FormControl>
        </>
    );
};

const styles = StyleSheet.create({
    dataWrapper: {
        marginBottom: 40,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default SubmenuSuggest;

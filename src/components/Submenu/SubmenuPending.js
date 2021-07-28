import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR_PRIMARY_900} from '../../utils/constants';

const SubmenuPending = ({onPress}) => {
    const _onPress = () => (onPress && onPress);
    return (
        <View style={styles.container}>
            <Text onPress={_onPress} style={styles.title}>123 Suit, Abraham Mount, NyY</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_PRIMARY_900,
    },
});

export default SubmenuPending;

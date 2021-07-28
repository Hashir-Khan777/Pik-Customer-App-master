import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../utils/constants';
import ViewCollapsable from './ViewCollapsable';
import globalStyles from '../utils/globalStyles';

const SubmenuTracking = ({order, collapsed}) => {

    return (
        <>
            <ViewCollapsable collapsed={!collapsed}>
                <View style={styles.container}>
                    <Text style={styles.title}>sample text</Text>
                </View>
            </ViewCollapsable>
            <ViewCollapsable collapsed={collapsed}>
                <View style={styles.dataWrapper}>
                    <View style={styles.dataContainer}>
                        <Text>Sample Data</Text>
                    </View>
                </View>
            </ViewCollapsable>
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
});

export default SubmenuTracking;

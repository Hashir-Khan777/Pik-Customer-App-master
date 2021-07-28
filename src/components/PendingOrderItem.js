import React from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from 'react-native'
import globalStyles from '../utils/globalStyles';
import Avatar from './Avatar';
import BoxShadow from './BoxShadow';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../utils/constants';

const PendingOrderItem = ({order, style}) => {
    return <BoxShadow>
        <View style={{...style, ...styles.container}}>
            <TouchableOpacity onPress={() => {}}>
                <View>
                    <View style={styles.userInfoContainer}>
                        <Avatar border={1} style={styles.avatar} size={32}/>
                        <View style={{flexGrow: 1}}>
                            <View style={[globalStyles.flexRowCenter, {justifyContent: 'space-between'}]}>
                                <Text style={styles.name}>Miami Box</Text>
                                <Text style={styles.pendingTitle}>Address request</Text>
                            </View>
                            <Text style={styles.description}>San Fransisco, ave 13 sur</Text>
                        </View>
                        <View style={styles.icon}/>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    </BoxShadow>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    userInfoContainer: {
        position: 'relative',
        paddingVertical: 20,
        paddingHorizontal: 16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 10,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    pendingTitle: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
})

export default PendingOrderItem;

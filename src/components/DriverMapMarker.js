import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import Avatar from './Avatar';
import {uploadUrl} from '../utils/helpers';
import {COLOR_PRIMARY_600} from '../utils/constants';

const AVATAR_SIZE = 40
const BORDER_SIZE = 2

const DriverMapMarker = ({driver}) => {
    return (
        <View style={styles.wrapper}>
            <Avatar
                source={{uri: uploadUrl(driver.avatar)}}
                size={40}
                border={BORDER_SIZE}
                borderColor={COLOR_PRIMARY_600}
            />
            <View style={styles.pin}/>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
    },
    pin:{
        width: BORDER_SIZE*4,
        height: BORDER_SIZE*4,
        marginHorizontal: -BORDER_SIZE*4 + AVATAR_SIZE/2,
        marginTop: -BORDER_SIZE,
        borderColor: 'transparent',
        borderTopColor: COLOR_PRIMARY_600,
        borderTopWidth: BORDER_SIZE*4,
        borderRightWidth: BORDER_SIZE*4,
        borderLeftWidth: BORDER_SIZE*4,
        borderBottomWidth: 0,
    },
})

export default DriverMapMarker;

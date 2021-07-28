import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import MapView from "react-native-maps";
import Avatar from './Avatar';
const pikLogo = require('../assets/images/PIK-Delivery-logo.png')

const MapAvatar = ({sender, coordinate}) => {
    return (
        <MapView.Marker
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 1 }}
        >
            <View style={styles.wrapper}>
                <Avatar
                    source={!!sender?.avatar ? {uri: sender?.avatar} : {pikLogo}}
                    size={50}
                    border={1}
                />
                <View style={{alignItems: 'center'}}>
                    <View style={styles.point} />
                </View>
            </View>
            {/*<View style={styles.triangle}/>*/}
        </MapView.Marker>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        // backgroundColor: 'black',
        // borderRadius: 5,
    },
    point: {
        marginTop: 2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'black',
    }
})

export default MapAvatar;

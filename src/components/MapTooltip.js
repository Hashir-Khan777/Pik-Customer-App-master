import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import MapView from "react-native-maps";
import useComponentSize from '../utils/useComponentSize'

const MapTooltip = ({children, coordinate}) => {
    const [size, onLayout] = useComponentSize();
    return (
        <MapView.Marker
            coordinate={coordinate}
            anchor={{ x: size?(10/size.width):0, y: 1.1 }}
        >
            <View style={styles.wrapper} onLayout={onLayout}>
                <Text style={styles.text}>{children}</Text>
            </View>
            <View style={styles.triangle}/>
        </MapView.Marker>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'black',
        borderRadius: 5,
    },
    text: {
        color: 'white',
        paddingHorizontal: 16,
        paddingVertical: 4,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    },
    triangle:{
        width: 10,
        height: 5,
        marginLeft: 5,
        borderWidth: 5,
        borderBottomWidth: 0,
        borderColor: 'transparent',
        borderTopColor: 'black',
    },
})

export default MapTooltip;

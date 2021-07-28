import React, { Children } from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

const Row = ({children, space=0}) => {
    let childrenCount = Children.toArray(children).length
    let width = (100 / childrenCount) + '%'
    return <View style={[styles.row, {marginHorizontal: -space/2}]}>
        {Children.toArray(children).map((child, i) => (
            <View key={i} style={[styles.col, {width, paddingHorizontal: space/2}]}>{child}</View>
        ))}
    </View>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        // borderWidth: 1,
    },
    col: {
        // borderWidth: 1,
        // borderColor: 'red',
    },
})

export default Row;

import React from 'react'
import {
    View,
    Text,
} from 'react-native'
import globalStyles from '../utils/globalStyles';

const TextSingleLine = ({children, style}) => {
    return <View style={globalStyles.flexRow}>
        <View style={globalStyles.flexColumn}>
            <Text numberOfLines={1} style={style}>{children}</Text>
        </View>
    </View>
}

export default TextSingleLine

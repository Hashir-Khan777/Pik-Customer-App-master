import React from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import globalStyles from '../utils/globalStyles';
import Avatar from './Avatar';
import {COLOR_NEUTRAL_GRAY} from '../utils/constants';

const BusinessInfo = ({business}) => {
    return (
        <View style={globalStyles.flexRowCenter}>
            <Avatar source={{uri: business.logo}} style={{marginRight: 8}} size={40} border={0}/>
            <View style={{flexGrow: 1}}>
                <Text style={{fontWeight: '700', fontSize: 16, lineHeight: 24}}>
                    {business.name}
                </Text>
                <View style={globalStyles.flexRow}>
                    <View style={globalStyles.flexColumn}>
                        <Text numberOfLines={1} style={{
                            fontWeight: '400',
                            fontSize: 12,
                            lineHeight: 16,
                            color: COLOR_NEUTRAL_GRAY,
                            textAlign: 'left',
                        }}>
                            {business.address?.formatted_address}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
})

export default BusinessInfo;

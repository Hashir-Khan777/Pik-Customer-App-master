import React from 'react'
import moment from 'moment';
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import globalStyles from '../utils/globalStyles';
import Avatar from './Avatar';
import {COLOR_TERTIARY_HYPERLINK} from '../utils/constants';
import {uploadUrl} from '../utils/helpers';

import { useTranslation } from 'react-i18next';

const DriverInfo = ({driver}) => {
    let { t } = useTranslation();
    return (
        <View style={globalStyles.flexRowCenter}>
            <Avatar
                source={{uri: uploadUrl(driver.avatar)}}
                size={32}
                border={0}
                style={{marginRight: 8}}
            />
            <View style={{flexGrow: 1}}>
                <Text style={{fontWeight: '400', fontSize: 14, lineHeight: 24}}>
                    {`${driver.firstName} ${driver.lastName}`}
                </Text>
                <Text style={{fontWeight: '400', fontSize: 12, lineHeight: 16, color: COLOR_TERTIARY_HYPERLINK}}>{`${driver.vehicle.type} / ${driver.vehicle.makeModel}`}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
})

export default DriverInfo;

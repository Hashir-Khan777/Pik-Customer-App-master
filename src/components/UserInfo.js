import React from 'react'
import moment from 'moment';
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import globalStyles from '../utils/globalStyles';
import Avatar from './Avatar';
import {COLOR_NEUTRAL_GRAY} from '../utils/constants';

const UserInfo = ({user}) => {
    return (
        <View style={globalStyles.flexRowCenter}>
            <Avatar
                source={{uri: user?.avatar}}
                style={{marginRight: 8}}
                size={40}
                border={0}
            />
            <View>
                <Text style={{fontWeight: '400', fontSize: 14, lineHeight: 24, textAlign: 'left'}}>
                    {`${user.firstName} ${user.lastName}`.trim()}
                </Text>
                <Text style={{fontWeight: '400', fontSize: 12, lineHeight: 16, color: COLOR_NEUTRAL_GRAY}}>
                    {moment(user.createdAt).format('MMM Do hh:mm a')}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
})

export default UserInfo;

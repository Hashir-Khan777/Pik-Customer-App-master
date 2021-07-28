import React from 'react'
import {useRoute, useNavigation} from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';
import {connect} from 'react-redux';
import {compose} from 'redux';
import withAuth from '../redux/connectors/withAuth';

const OrderChat = ({driver, order, customer, authUser, style, ...props}) => {
    const navigation = useNavigation();
    const {chatList} = props

    let hasUnreadMessage = React.useMemo(() => {
        let chatId = `order_${order?._id}_driver_${driver?._id}_customer_${customer?._id}`
        let chat = chatList.find(({id}) => id===chatId)
        if(!chat)
            return false
        return (chat?.userList[authUser?._id]?.unread > 0)

    }, [driver, order, customer, chatList])

    return (
        <View style={style}>
            <SvgXml
                onPress={() => {
                    navigation.navigate('MainTravelOrderChat', {order})
                }}
                width={30} xml={svgs[`icon-comment${hasUnreadMessage ? '-unread' : ''}`]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
})

const mapStateToProps = state => {
    return {
        chatList: state.app.orderChatList
    }
}

const enhance = compose(
    withAuth,
    connect(mapStateToProps)
)

export default enhance(OrderChat)

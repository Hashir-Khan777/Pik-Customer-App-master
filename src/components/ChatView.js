import React, {useState, useEffect} from 'react';
import moment from 'moment'
import {
    StyleSheet,
    Image,
    View,
    Text
} from 'react-native'
import GradientView from './GradientView';
import {GRADIENT_2, GRAY_LIGHT_EXTRA} from '../utils/constants';

const ImageMessage = ({msg, isRtl}) => {
    const [imageStyle, setImageStyle] = useState(null)
    const IMAGE_WIDTH = 120

    let imageSize = useEffect(() => {
        Image.getSize(msg.image, (width, height) => {
            setImageStyle({width: IMAGE_WIDTH, height: IMAGE_WIDTH*(height/width)})
        });
    },[msg?.image])

    return (
        <View>
            <Image
                resizeMode="contain"
                style={[{backgroundColor: 'white'},imageStyle]}
                source={{uri: msg.image}}
            />
            <Text style={[styles.msgText, isRtl?styles.textWhite:{}]}>{msg.text}</Text>
        </View>
    )
}

const ChatBubble = ({msg, userId}) => {
    let isRtl = msg.sender._id === userId
    let WrapperComponent = isRtl ? GradientView : View;
    return (
        <View key={msg._id} style={[styles.msgWrapper, msg?.sender?._id === userId ? styles.rtl : {}]}>
            <WrapperComponent style={styles.msgBubble} gradient={GRADIENT_2}>
                {!!msg.image ? (
                    <ImageMessage msg={msg} isRtl={isRtl}/>
                ) : (
                    <Text style={[styles.msgText, isRtl?styles.textWhite:{}]}>
                        {msg.text}
                    </Text>
                )}
                <Text style={[styles.msgTime, isRtl?styles.textWhite:{}]}>
                    {moment(msg.time).format('hh:mm a')}
                </Text>
            </WrapperComponent>
        </View>
    )
}

const ChatView = ({messages, userId, style}) => {
    return (
        <View style={style}>
            <View style={styles.wrapper}>
                {messages.map((msg, index) => (
                    <ChatBubble key={index} msg={msg} userId={userId} />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex:1,
        flexDirection: 'column',
        minHeight: 100,
    },
    msgWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 50,
    },
    rtl: {
        flexDirection: 'row-reverse',
    },
    msgBubble: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: GRAY_LIGHT_EXTRA,
        minWidth: 115,
    },
    msgText: {
        // color: 'white',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'left'
    },
    msgTime: {
        // color: 'white',
        fontWeight: '400',
        fontSize: 10,
        lineHeight: 16,
        textAlign: 'right'
    },
    textWhite: {
        color: 'white',
    },
})

export default ChatView;

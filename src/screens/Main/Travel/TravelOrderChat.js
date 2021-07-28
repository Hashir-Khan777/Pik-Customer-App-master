import React, {useState, useCallback, useEffect} from 'react';
import firestore from '../../../utils/firestore'
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import ChatView from '../../../components/ChatView';
import CustomTextInput from '../../../components/CustomTextInput';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import svgs from '../../../utils/svgs';
import {SvgXml} from 'react-native-svg';
import useComponentSize from '../../../utils/useComponentSize';
import {chooseImage, takePhoto} from '../../../utils/images';
import ActionSheet from 'react-native-actionsheet';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900, DEVICE_ANDROID} from '../../../utils/constants';
import withAuth from '../../../redux/connectors/withAuth';
import Api from '../../../utils/api'
import {obj2FormData} from '../../../utils/helpers';
import globalStyles from '../../../utils/globalStyles';

import { useTranslation } from 'react-i18next';

const ORDER_CHAT_ROOT_COLLECTION = 'pik_delivery_order_chats';

const TraverOrderChat = ({navigation, route, authUser}) => {
    let { t } = useTranslation();

    const [messageToSend, setMessageToSend] = useState("")
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [loading, setLoading] = useState(true)
    let {order} = route.params;

    useEffect(() => {
        setLoading(true)
        console.log('getting chat rooms .........')
        const unsubscribe = firestore()
            .collection(ORDER_CHAT_ROOT_COLLECTION)
            .doc(`order_${order._id}_driver_${order.driver._id}_customer_${authUser._id}`)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(querySnapshot => {
                const threads = querySnapshot.docs.map(documentSnapshot => {
                    return {
                        _id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    }
                })

                setMessages(threads)
                console.log(`threads count: [${threads.length}]`)
                setLoading(false);
                // if (loading) {
                //     setLoading(false)
                // }
            })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if(!!messages.find(m => m.sender._id !== authUser._id)){
            Api.Customer.postOrderChatRead(order._id)
                .then(() => {})
        }

        if(page != null) setTimeout(() => page.scrollToEnd(), 200);
    }, [messages])

    const imageOptions = {
        // width: 800,
        // height: 800,
        // cropping: true,
        multiple: false,
        hideBottomControls: true,
    };

    const getPhotoFromLibrary = async () => {
        try {
            const newPhoto = await chooseImage(imageOptions);
            onPhotoSelect(newPhoto);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async () => {
        try {
            const newPhoto = await takePhoto(imageOptions);
            onPhotoSelect(newPhoto);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const onPhotoSelect = selectedPhoto => {
        console.log(selectedPhoto)
        setPhoto(selectedPhoto);
        // setPhoto(selectedPhoto)
    }

    const createMessageForm = () => {
        const data = new FormData();

        let formBody = {
            message: messageToSend
        }

        obj2FormData(data, formBody, '');

        if(!!photo){
            data.append("photo", {
                name: photo.fileName,
                type: photo.mime,
                uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace("file://", "")
            });
        }

        return data;
    }

    const onSend = () => {
        if(!messageToSend && !photo)
            return;
        console.log('sending message ...');

        let formData = createMessageForm()
        Api.Customer.postOrderChat(order._id, formData)
            .then(result => {
                console.log('send success', result)
            })
            .catch(error => {
                console.log('send error', error)
            })
            .then(() => {
            })

        setMessages([...messages, {
            _id: Date.now(),
            text: messageToSend,
            image: !!photo ? photo.uri : undefined,
            sender: {
                _id:authUser._id,
                name: authUser.name,
                type: 'customer',
            },
            time: Date.now(),
        }]);
        setMessageToSend('')
        setPhoto(null)
        setTimeout(() => page.scrollToEnd(), 200);
    }

    let photoSheetRef = null

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                ref={_ref => setPage(_ref)}
                Header={<HeaderPage title={order?.driver?.name} />}
                footer={<View style={{paddingVertical: 8, paddingHorizontal: 16}}>
                    {!!photo && (
                        <View style={globalStyles.inputWrapper}>
                            <Image style={styles.sendingPhotoThumb} source={{uri: photo.uri}} />
                        </View>
                    )}
                    <View style={{flexDirection: 'row',}}>
                        <CustomTextInput
                            style={{flex: 1}}
                            placeholder={t('pages.travel.chat.type') + "..."}
                            leftIcon={(
                                <FontAwesome5
                                    name="camera"
                                    size={16}
                                    color={COLOR_NEUTRAL_GRAY}
                                    onPress={() => photoSheetRef.show()}
                                />
                            )}
                            value={messageToSend}
                            onChangeText={setMessageToSend}
                            rightIcon={<SvgXml
                                onPress={onSend}
                                style={styles.uploadBtn}
                                width={32} height={32}
                                xml={svgs['icon-paper-plane']}
                            />}
                        />
                    </View>
                </View>
                }
                footerStyle={{paddingVertical: 8}}
            >
                <ChatView
                    messages={messages}
                    userId={authUser._id}
                />
                {loading && (
                    <View style={{position: 'absolute', top: 16, left: 0, right: 0}}>
                        <ActivityIndicator color={COLOR_PRIMARY_500} size="large" />
                    </View>
                )}
                <ActionSheet
                    testID="PhotoActionSheet"
                    ref={(o) => {
                        photoSheetRef = o;
                    }}
                    title={t('photo.select_photo')}
                    options={[t('photo.take_photo'), t('photo.choose_library'), t('photo.cancel')]}
                    cancelButtonIndex={2}
                    onPress={(index) => {
                        if (index === 0) {
                            getPhotoFromCamera();
                        } else if (index === 1) {
                            getPhotoFromLibrary();
                        }
                    }}
                />
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    )
};

const styles = StyleSheet.create({
    toolbox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    sendingPhotoThumb: {
        height: 50,
        width: 50,
    }
});

export default withAuth(TraverOrderChat);

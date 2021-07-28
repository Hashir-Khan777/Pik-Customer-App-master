import React, {useState} from 'react';
import codePush from 'react-native-code-push'
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import Avatar from '../../../components/Avatar';
import globalStyles from '../../../utils/globalStyles';
import PhoneInput from '../../../components/PhoneInput';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import {DEVICE_ANDROID} from '../../../utils/constants';
import {obj2FormData, uploadUrl} from '../../../utils/helpers';
import ActionSheet from 'react-native-actionsheet';
import {AVATAR_IMAGE_OPTIONS, chooseImage, takePhoto} from '../../../utils/images';
import Api from '../../../utils/api';
import _ from 'lodash';
import withAuth from '../../../redux/connectors/withAuth';
import PrimaryButton from '../../../components/ButtonPrimary';

import { useTranslation } from 'react-i18next';

const ProfileScreen = ({navigation, authUser, authReloadUser, authLogout}) => {
    let { t } = useTranslation();

    const [refreshing, setRefreshing] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState(authUser.firstName + " " + authUser.lastName);
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(authUser.email);
    const [mobile, setMobile] = useState('');
    const [mobileUnFormatted, setMobileUnFormatted] = useState(authUser.mobile);
    const [password, setPassword] = useState('');
    const [inProgress, setInProgress] = useState(false);

    const [codePushUpdate, setCodePushUpdate] = useState(false)

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await authReloadUser()
        setRefreshing(false);
    }, []);

    let avatarSheetRef = null;
    const getPhotoFromLibrary = async () => {
        try {
            const photo = await chooseImage(AVATAR_IMAGE_OPTIONS);
            setAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };
    const getPhotoFromCamera = async () => {
        try {
            const photo = await takePhoto(AVATAR_IMAGE_OPTIONS);
            setAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const createFormData = () => {
        let formData = new FormData();
        let body = _.pickBy({firstName, lastName, mobile, email, password}, (val, key) => {
            return !!val && val != authUser[key];
        })
        obj2FormData(formData, body, '');
        if(!!avatar) {
            formData.append("avatar", {
                name: avatar.fileName,
                type: avatar.mime,
                uri: DEVICE_ANDROID ? avatar.uri : avatar.uri.replace("file://", "")
            });
        }
        return formData
    }

    const updateProfile = () => {
        let update = _.pickBy({firstName, lastName, mobile, email, password}, (val, key) => {
            return !!val && val != authUser[key];
        })
        console.log('Updating fields:', update)
        // return;
        if(Object.keys(update).length > 0 || !!avatar){
            setInProgress(true)
            Api.Customer.updateProfile(createFormData())
                .then(async ({success, message}) => {
                    console.log(success, message);
                    if(success) {
                        await authReloadUser();
                        if(!!mobile){
                            navigation.push('ConfirmMobile', {user: authUser, onConfirm: () => navigation.goBack()});
                        }
                    }
                    else{
                        Alert.alert("Error", message || "Somethings went wrong")
                    }
                })
                .catch(console.error)
                .then(() => {
                    setInProgress(false)
                })
        }
        else {
            Alert.alert(t('general.Warning'), t('general.no_update_server'));
        }
    }

    React.useEffect(() => {
        codePush.getUpdateMetadata()
            .then(pkg => {
                console.log({pkg})
                setCodePushUpdate(pkg)
            })
    }, [])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark refreshing={refreshing} onRefresh={onRefresh}
                Header={
                    <HeaderPage
                        title={t('pages.profile.my_profile')}
                        color={HeaderPage.Colors.BLACK}
                        rightButtons={[
                            (codePushUpdate?.isPending) ? (
                                <PrimaryButton
                                    onPress={() => codePush.restartApp(true)}
                                    style={{height: 24, paddingHorizontal: 16}}
                                    titleStyle={{fontSize: 12}}
                                    title="Update App"
                                />
                            ) : null
                        ]}
                    />
                }>
                <View style={{paddingVertical: 20}}>
                    <View
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => avatarSheetRef.show()}>
                            <Avatar source={{uri: !!avatar ? avatar.uri : uploadUrl(authUser.avatar)}}/>
                        </TouchableOpacity>
                    </View>
                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            avatarSheetRef = o;
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
                </View>
                <Text
                    style={[
                        globalStyles.textHeadline5,
                        {textAlign: 'center'},
                    ]}>{`${authUser.firstName} ${authUser.lastName}`}</Text>
                <Text
                    style={[
                        globalStyles.textCaption1,
                        {textAlign: 'center', marginBottom: 40},
                    ]}>
                    {t('pages.profile.customer')}
                </Text>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder={t('pages.profile.fullname')}
                    />
                </View>
                {/* <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder={'Last Name'}
                    />
                </View> */}
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('pages.profile.email')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <PhoneInput
                        value={mobileUnFormatted}
                        onChangeText={setMobileUnFormatted}
                        onChangeFormattedText={setMobile}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        type="password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('pages.profile.password')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <PrimaryButton
                        title={t('pages.profile.update_profile')}
                        onPress={updateProfile}
                        inProgress={inProgress}
                        disabled={inProgress}
                    />
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    logoutBtn: {
        fontWeight: '900',
        color: 'white'
    }
});

export default withAuth(ProfileScreen);

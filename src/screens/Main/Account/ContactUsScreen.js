import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
} from 'react-native';
import CustomCheckbox from '../../../components/CustomCheckbox';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import GradientButton from '../../../components/GradientButton';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900, DEVICE_ANDROID,
    GRADIENT_2,
} from '../../../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import CustomPicker from '../../../components/CustomPicker';
import CustomTextInput from '../../../components/CustomTextInput';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../../utils/globalStyles';
import {chooseImage, takePhoto} from '../../../utils/images';
import ActionSheet from 'react-native-actionsheet';
import ButtonPrimary from '../../../components/ButtonPrimary';
import {isEmail, isMobile} from '../../../utils/validator';
import _ from 'lodash';
import Api from '../../../utils/api'
import AlertBootstrap from '../../../components/AlertBootstrap';
import {obj2FormData} from '../../../utils/helpers';

import { useTranslation } from 'react-i18next';

const ContactUsScreen = ({navigation, ...props}) => {
    let { t } = useTranslation();

    const [category, setCategory] = useState('')
    const [order, setOrder] = useState(null)
    const [photos, setPhotos] = useState([])
    const [details, setDetails] = useState('')
    const [inProgress, setInProgress] = useState(false)
    const [validationEnabled, setValidationEnabled] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    let photoRef = null;

    const reset = () => {
        setCategory('')
        setOrder(null)
        setPhotos([])
        setDetails('')
    }

    const onCheckboxChange = () => {
        if(!order){
            navigation.navigate(
                'AccountSelectOrder',
                {
                    title: t('pages.about_pik.select_order'),
                    onSelect: order => {
                        setOrder(order)
                        navigation.goBack()
                    }
                })
        }
        else{
            setOrder(null)
        }
    }

    const imageOptions = {
        // width: 600,
        // height: 600,
        // cropping: true,
        // useFrontCamera: false,
        multiple: true,
        maxFiles: 5,
        minFiles: 1,
        hideBottomControls: true,
    };

    const getPhotoFromLibrary = async () => {
        try {
            const newPhotos = await chooseImage(imageOptions);
            setPhotos([...photos, ...newPhotos]);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async () => {
        try {
            const newPhotos = await takePhoto(imageOptions);
            setPhotos([...photos, ...newPhotos]);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    // ================ Validations ====================
    const validateCategory = () => {
        if(!category)
            return t('pages.about_pik.enquiry_type_required');
    }
    const validateDetails = () => {
        if(!details)
            return t('pages.about_pik.write_some_details');
    }
    // =================================================

    const createFormData = () => {
        let formData = new FormData();
        const body = {
            category,
            details,
            orderId: order?._id,
        };
        obj2FormData(formData, body, '')
        !!photos && photos.map(photo => {
            formData.append('photos', {
                name: photo.fileName,
                type: photo.mime,
                uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace('file://', ''),
            });
        });
        return formData;
    }

    const send = () => {
        setMessage('')
        setMessageType('')
        let error = [
            validateCategory(),
            validateDetails(),
        ].filter(_.identity)

        if(error.length > 0){
            setValidationEnabled(true);
            return;
        }

        let formData = createFormData()

        setInProgress(true);
        Api.Customer.postContactUs(formData)
            .then(({success, message}) => {
                if(success){
                    navigation.push('ContactMail')
                    setMessageType('success')
                    setMessage(t('pages.about_pik.ticket_register_success'));
                }
                else{
                    setMessageType('danger')
                    setMessage(message || 'Somethings went wrong',
                    );
                }
            })
            .catch(error => {
                setMessageType('danger')
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'server side error',
                );
            })
            .then(() => {
                setInProgress(false);
            })
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={t('pages.support_center.header')}
                />}
                footer={(
                    <View style={{padding: 16}}>
                        <ButtonPrimary
                            title={t('pages.about_pik.send_message')}
                            onPress={send}
                            inProgress={inProgress}
                            disabled={inProgress}
                        />
                    </View>
                )}
            >
                <CustomPicker
                    placeholder={t('pages.about_pik.enquiry_type')}
                    items={props.categories}
                    getLabel={item => item.title}
                    getValue={item => item._id}
                    selectedValue={category}
                    onValueChange={setCategory}
                    errorText={validationEnabled && validateCategory()}
                />
                <TouchableOpacity onPress={onCheckboxChange}>
                    <View style={[globalStyles.flexRow, {paddingVertical: 16}]}>
                        <SvgXml style={{marginRight: 8}} xml={svgs[`icon-checkbox-square-${!!order ? 'on' : 'off'}`]}/>
                        <Text>{t('pages.about_pik.help_with_order')}</Text>
                    </View>
                </TouchableOpacity>
                {!!order && (
                    <View style={styles.inputWrapper}>
                        <CustomTextInput value={order.id} />
                    </View>
                )}
                <Text style={styles.headline}>{t('pages.about_pik.upload_image')}</Text>
                {/* <Text style={styles.description}>lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text> */}

                <View style={[globalStyles.flexRow, {flexWrap: 'wrap', paddingVertical: 16}]}>
                    {photos.map(p => <Image style={styles.packagePhoto} source={{uri: p.uri}}/>)}
                    <TouchableOpacity onPress={() => photoRef.show()}>
                        <SvgXml
                            style={styles.packagePhoto}
                            width={64} height={64}
                            xml={svgs['icon-plus-square']}
                        />
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    testID="PhotoActionSheet"
                    ref={(o) => {photoRef = o}}
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
                <View style={globalStyles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={t('pages.about_pik.how_we_help')}
                        value={details}
                        onChangeText={setDetails}
                        errorText={validationEnabled && validateDetails()}
                    />
                </View>
                {!!message && (
                    <AlertBootstrap
                        message={message}
                        type={messageType}
                        onClose={() => {
                            setMessage('')
                            setMessageType('')
                        }}
                    />
                )}
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
    headline: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    uploadBtn: {
    },
    packagePhoto:{
        height: 64,
        width: 64,
        marginRight: 5,
        marginBottom: 5,
    },
});

const mapStateToProps = state => {
    return {
        categories: state.app.faqCategories
    }
}

export default connect(mapStateToProps)(ContactUsScreen);

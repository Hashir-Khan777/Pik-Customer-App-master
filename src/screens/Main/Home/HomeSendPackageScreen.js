import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
    addNewOrder as addNewOrderAction,
} from '../../../redux/actions/appActions';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    View,
    Text,
} from 'react-native';
import Api from '../../../utils/api';
import {
    GRAY_LIGHT_EXTRA,
    COLOR_PRIMARY_900, GRADIENT_2, DEVICE_ANDROID, COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500,
} from '../../../utils/constants';
import PrimaryButton from '../../../components/ButtonPrimary';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import GradientView from '../../../components/GradientView';
import HeaderPage from '../../../components/HeaderPage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../../utils/globalStyles';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import RadioInputObject from '../../../components/RadioInputObject';
import PhoneInput from '../../../components/PhoneInput';
import PaymentMethodPicker from '../../../components/PaymentMethodPicker';
import ViewCollapsable from '../../../components/ViewCollapsable';
import LocationPicker from '../../../components/LocationPicker';
import { clearPhoneNumber, obj2FormData, priceToFixed } from '../../../utils/helpers';
import CustomTextInput from '../../../components/CustomTextInput';
import GoogleApi from '../../../utils/googleApi';
// import fakeDirection from '../../../../sample-directions-response';
import { chooseImage, takePhoto } from '../../../utils/images';
import ActionSheet from 'react-native-actionsheet';
import phoneNumber from 'react-native-phone-input/lib/phoneNumber';
import { PhoneNumberUtil } from 'google-libphonenumber';
import Avatar from '../../../components/Avatar';
const phoneUtils = PhoneNumberUtil.getInstance();
import { PaymentRequest } from 'react-native-payments';
import { DETAILS, METHOD_DATA } from '../../../payment/index'

import { NavigationActions, StackActions } from 'react-navigation'
import { StackAction, CommonActions, NavigationAction } from '@react-navigation/native'
import UserInfo from '../../../components/UserInfo';
import PriceBreakdown from '../../../components/PriceBreakdown';
import AlertBootstrap from '../../../components/AlertBootstrap';
import BoxShadow from '../../../components/BoxShadow';

import { useTranslation } from 'react-i18next';

const VehicleTypeBtn = ({ title, size, icon, active, onPress }) => {
    const Wrapper = active ? GradientView : View;
    return <TouchableOpacity onPress={onPress} style={{ flexGrow: 1 }}>
        <Wrapper gradient={GRADIENT_2} style={styles.vehicleTypeBtn}>
            <Text style={[styles.vehicleTypeText, { color: active ? "white" : COLOR_PRIMARY_900 }]}>
                <FontAwesome5 name={icon} size={15} color={active ? "white" : COLOR_PRIMARY_900} />
            </Text>
                <View>
                    <Text style={[styles.vehicleTypeText, { color: active ? "white" : COLOR_PRIMARY_900}]}>{title}</Text>
                    <Text style={[styles.vehicleTypeText, { color: active ? "white" : COLOR_PRIMARY_900}]}>{size}</Text>
                </View>
        </Wrapper>
    </TouchableOpacity>
}

const navigateToOrderDetail = async (navigation, orderId) => {
    // navigation.goBack();
    // navigation.navigate(
    //     "MainTravels",
    //     {
    //         screen: "MainTravelHome",
    //         params:{
    //             screen: "MainTravelOrderDetail",
    //             params: {orderId}
    //         }
    //     },
    // )
    navigation.popToTop();
    await navigation.navigate(
        "MainTravels",
        {
            screen: "MainTravelHome",
        }
    )
    navigation.navigate(
        "MainTravels",
        {
            screen: "MainTravelOrderDetail",
            params: { orderId }
        }
    )
}

const HomeSendPackageScreen = ({ navigation, route, ...props }) => {
    let { t } = useTranslation();

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [validateEnabled, setValidateEnabled] = useState(false);
    const [vehicleType, setVehicleType] = useState('Moto')
    const [payer, setPayer] = useState('Me')
    const [pickupAddress, setPickupAddress] = useState(null)
    const [hasPickupNote, setHasPickupNote] = useState(false)
    const [photos, setPhotos] = useState([])
    const [pickupNote, setPickupNote] = useState('')
    const [hasCustomerNote, setHasCustomerNote] = useState(false)
    const [customerNote, setCustomerNote] = useState('')
    const [deliveryAddress, setDeliveryAddress] = useState(null)
    const [requestDeliveryLocation, setRequestDeliveryLocation] = useState('Select')
    const [hasDeliveryNote, setHasDeliveryNote] = useState(false)
    const [deliveryNote, setDeliveryNote] = useState('')
    const [personName, setPersonName] = useState('')
    const [personContact, setPersonContact] = useState(null)
    const [personMobile, setPersonMobile] = useState('')
    const [person, setPerson] = useState(null);
    const [personNotFound, setPersonNotFound] = useState(false);
    const [mobileUnFormatted, setMobileUnFormatted] = useState('')
    const [creditCard, setCreditCard] = useState(null)
    // const {paymentMethods, paymentMethodLoaded, paymentMethodLoading, loadPaymentMethods} = props;
    const [seePriceBreakDown, setSeePriceBreakDown] = useState(false)
    const [direction, setDirection] = useState(null);
    const [price, setPrice] = useState(null);

    const selectPickupLocation = () => {
        navigation.navigate('LocationGet', { setLocation: setPickupAddress, address: pickupAddress })
    }

    const selectDeliveryLocation = () => {
        navigation.navigate('LocationGet', { setLocation: setDeliveryAddress, address: deliveryAddress })
    }

    const imageOptions = {
        // width: 800,
        // height: 800,
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
            // uploadAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async () => {
        try {
            const newPhotos = await takePhoto(imageOptions);
            setPhotos([...photos, ...newPhotos]);
            // uploadAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    useEffect(() => {
        if (personContact) {
            setMobileUnFormatted(clearPhoneNumber(personContact.phoneNumbers[0].number))
            setPersonMobile(clearPhoneNumber(personContact.phoneNumbers[0].number))
            // if(!personName)
            setPersonName(`${personContact.givenName} ${personContact.familyName}`.trim())
        }
    }, [personContact])

    useEffect(() => {
        setPersonNotFound(false)
        setPerson(null);

        if (!personMobile || validateReceiverPhone(personMobile))
            return;

        Api.Customer.getMobileInfo(personMobile)
            .then(({ success, message, customer }) => {
                console.log(customer)

                if (success && customer /*&& customer.status==='Registered'*/) {
                    setPerson(customer);
                }
                else
                    setPersonNotFound(true);
            })
            .catch(error => {
                setPersonNotFound(true);
            })
    }, [personMobile])

    // useEffect(() => {
    //     if(!pickupAddress || !deliveryAddress)
    //         return;
    //     GoogleApi.directions(`place_id:${pickupAddress.place_id}`, `place_id:${deliveryAddress.place_id}`)
    //         .then(direction => {
    //             setDirection(direction);
    //         })
    // },[pickupAddress, deliveryAddress])

    useEffect(() => {
        if (!pickupAddress || !deliveryAddress)
            return;
        Api.Customer.calcOrderPrice(vehicleType, pickupAddress, deliveryAddress)
            .then(({ success, price, direction, message }) => {
                console.log(price)
                if (success) {
                    setPrice(price);
                    setDirection(direction)
                }
            })
    }, [vehicleType, pickupAddress, deliveryAddress])

    // ======== Validations =============
    const validateAddress = address => {
        if (!address)
            return t('pages.mainHome.select_location')
    }
    const validateReceiverName = name => {
        if (!name)
            return t('pages.mainHome.write_receiver_name')
    }
    const validateReceiverPhone = phone => {
        if (!phone)
            return t('pages.mainHome.enter_receiver_phone')
        try {
            let number = phoneUtils.parseAndKeepRawInput(phone)
            if (!phoneUtils.isValidNumber(number)) {
                return t('pages.mainHome.invalid_phone_number')
            }
        } catch (e) {
            return t('pages.mainHome.invalid_phone_number')
        }
    }
    const validateCreditCard = cardNumber => {
        if (!cardNumber)
            return t('pages.mainHome.select_credit_card')
    }
    // ==================================

    const createFormData = () => {
        const data = new FormData();

        let formBody = {
            isRequest: requestDeliveryLocation === 'Select' ? false : true,
            vehicleType,
            pickupAddress,
            payer: payer === 'Me' ? 'sender' : 'receiver',
            personName,
            personMobile,
            pickupNote,
            customerNote,
            ...(requestDeliveryLocation === 'Select' ? {
                deliveryAddress,
                deliveryNote,
            } : {}),
            ...(payer === 'Me' ? {
                creditCard,
            } : {})
        }

        obj2FormData(data, formBody, '');

        !!photos && photos.map(photo => {
            data.append("photos", {
                name: photo.fileName,
                type: photo.mime,
                uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace("file://", "")
            });
        })

        return data;
    }

    const placeOrder = () => {
        setError('');

        let errors = [
            validateAddress(pickupAddress),
            validateReceiverName(personName),
            validateReceiverPhone(personMobile),
            ...(payer === "Me" ? [
                requestDeliveryLocation === 'Select' ? validateAddress(deliveryAddress) : null,
                validateCreditCard(creditCard),
            ] : []),
        ].filter(_.identity);

        if (errors.length > 0) {
            setValidateEnabled(true);
            setError(t('pages.mainHome.check_form_try'));
            return
        }

        if ((payer === 'Receiver' || requestDeliveryLocation === 'Request') && !person) {
            setValidateEnabled(true);
            setError(`${t('pages.mainHome.receiving_pik_user')}(${personMobile}) ${t('pages.mainHome.not_found')}`);
            return
        }

        let formData = createFormData();

        setInProgress(true);
        Api.Customer.postNewOrder(formData)
            .then(response => {
                console.log("Response", response)
                let { success, message, order } = response
                if (success) {
                    props.addNewOrderToRedux(order);
                    // alert('ok')
                    if (order.status === 'Pending')
                        navigation.navigate('MainHomeSearchingCarrier', { order })
                    else
                        navigateToOrderDetail(navigation, order._id)
                }
                else {
                    setError(message || "Somethings went wrong")
                }
            })
            .catch(error => {
                setError(error.message || "Somethings went wrong")
                console.error(JSON.stringify(error, null, 2), Date.now())
            })
            .then(() => {
                setInProgress(false)
            })
    }

    const deletePhoto = index => {
        let newList = [...photos]
        newList.splice(index, 1)
        setPhotos(newList);
    }
    let photoSheetRef = null

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                contentStyle={{ paddingBottom: 0 }}
                Header={
                    <HeaderPage
                        title={t('pages.mainHome.send_package')}
                        color={HeaderPage.Colors.BLACK}
                    />
                }
                footer={(
                    <PrimaryButton
                        style={{ borderRadius: 0, width: '100%' }}
                        title={t('general.place_order')}
                        inProgress={inProgress}
                        disabled={inProgress}
                        onPress={() => placeOrder()}
                    />
                )}
                footerStyle={{ marginHorizontal: -16 }}
            >
                <View style={{ flexGrow: 1 }}>
                    {/* ===== Vehicle type ===== */}
                    <View style={{ padding: 10, marginBottom: 16 }}>
                        <View style={styles.flexRow}>
                            <VehicleTypeBtn
                                active={vehicleType === 'Moto'}
                                icon="motorcycle"
                                title="Max 35 lbs"
                                size="45x45x45cm"
                                onPress={() => setVehicleType('Moto')}
                            />
                            <View style={{ width: 13 }} />
                            <VehicleTypeBtn
                                active={vehicleType === 'Carro'}
                                icon="car"
                                title="Max 165 lbs"
                                size="110x50x75cm"
                                onPress={() => setVehicleType('Carro')}
                            />
                        </View>
                    </View>

                    {/* ===== Pickup location ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <LocationPicker
                            placeholder={t('pages.mainHome.select_pickup_location')}
                            value={pickupAddress}
                            onPress={selectPickupLocation}
                            errorText={validateEnabled && validateAddress(pickupAddress)}
                        />
                    </View>

                    {/* ===== Who's paying ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <Text style={styles.h1}>{t('pages.mainHome.who_pay')}</Text>
                    </View>
                    <View style={globalStyles.inputWrapper}>
                        <RadioInputObject
                            value={payer}
                            items={[{ value: 'Me', label: t('pages.mainHome.me') }, { value: 'Receiver', label: t('pages.mainHome.receiver') }]}
                            onChange={setPayer}
                        />
                    </View>

                    {/* ===== Person name ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <CustomAnimatedInput
                            value={personName}
                            onChangeText={setPersonName}
                            placeholder={t('pages.mainHome.receiver_name')}
                            button={(
                                <Text
                                    onPress={() => navigation.navigate('MainHomePackageContacts', { setContact: setPersonContact })}
                                    style={globalStyles.link}
                                ><FontAwesome5 name="search" />{t('contact.title')}</Text>)}
                            errorText={validateEnabled && validateReceiverName(personName)}
                        />
                    </View>

                    {/* ===== Person Phone ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <PhoneInput
                            value={mobileUnFormatted}
                            onChangeText={setMobileUnFormatted}
                            onChangeFormattedText={setPersonMobile}
                            errorText={validateEnabled && validateReceiverPhone(personMobile)}
                        />
                        {(payer === 'Receiver' || requestDeliveryLocation === 'Request') && (
                            <Text style={styles.pikAccountAlert}>{t('pages.mainHome.phone_must_pik_account')}</Text>
                        )}
                    </View>
                    {(payer === 'Receiver' || requestDeliveryLocation === 'Request') && (
                        <View style={globalStyles.inputWrapper}>
                            {!!person && (
                                <View>
                                    <Text style={{ fontWeight: '600', fontSize: 16, lineHeight: 24, marginVertical: 16 }}>{t('pages.mainHome.request_to')}</Text>
                                    <UserInfo user={person} />
                                </View>
                            )}
                            {validateEnabled && !!personMobile && personNotFound && (
                                <AlertBootstrap
                                    type="danger"
                                    message={t('pages.mainHome.mobile_not_pik')}
                                />
                            )}
                        </View>
                    )}

                    {/* ===== Package photos ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <Text style={styles.h1}>{t('pages.mainHome.add_pictures')}</Text>
                    </View>
                    <View style={[globalStyles.inputWrapper, globalStyles.flexRow, { flexWrap: 'wrap', marginHorizontal: -8 }]}>
                        {photos.map((p, index) => (
                            <BoxShadow>
                                <View style={styles.imageContainer}>
                                    {/*<Image style={styles.packagePhoto} source={{uri: p.uri}}/>*/}
                                    <Image style={styles.image} source={{ uri: p.uri }} />
                                    <Text onPress={() => deletePhoto(index)} style={styles.removeBtn}>{t('pages.mainHome.remove')}</Text>
                                </View>
                            </BoxShadow>
                        ))}
                        <SvgXml
                            onPress={() => photoSheetRef.show()}
                            style={[styles.uploadBtn, { margin: 8 }]}
                            width={64} height={64}
                            xml={svgs['icon-plus-square']}
                        />
                    </View>
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

                    {/* ===== Pickup Note ===== */}
                    <View style={globalStyles.inputWrapper}>
                        {hasPickupNote ? (
                            <CustomAnimatedInput
                                placeholder={t('pages.mainHome.pickup_note')}
                                value={pickupNote}
                                autoFocus
                                onChangeText={setPickupNote}
                            />
                        ) : (
                            <Text onPress={() => setHasPickupNote(true)} style={globalStyles.link}>{t('pages.mainHome.note_to_driver')}</Text>
                        )}
                    </View>
                    {payer === 'Me' && (
                        <View>
                            {/* ===== Delivery location ===== */}
                            <View style={globalStyles.inputWrapper}>
                                <Text style={styles.h1}>{t('pages.mainHome.delivery_location')}</Text>
                            </View>
                            <View style={globalStyles.inputWrapper}>
                                <RadioInputObject
                                    value={requestDeliveryLocation}
                                    items={[{ value: 'Select', label: t('pages.mainHome.select') }, { value: 'Request', label: t('pages.mainHome.request') }]}
                                    onChange={setRequestDeliveryLocation}
                                />
                            </View>
                            <ViewCollapsable collapsed={requestDeliveryLocation !== 'Select'}>
                                <View style={globalStyles.inputWrapper}>
                                    <LocationPicker
                                        placeholder={t('pages.mainHome.select_delivery_location')}
                                        value={deliveryAddress}
                                        onPress={selectDeliveryLocation}
                                        errorText={validateEnabled && validateAddress(pickupAddress)}
                                    />
                                </View>
                                <View style={globalStyles.inputWrapper}>
                                    {hasDeliveryNote ? (
                                        <CustomAnimatedInput
                                            placeholder={t('pages.mainHome.delivery_note')}
                                            value={deliveryNote}
                                            autoFocus
                                            onChangeText={setDeliveryNote}
                                        />
                                    ) : (
                                        <Text onPress={() => setHasDeliveryNote(true)} style={globalStyles.link}>{t('pages.mainHome.note_to_driver')}</Text>
                                    )}
                                </View>
                            </ViewCollapsable>
                        </View>
                    )}

                    {/* ===== Customer Note ===== */}
                    <ViewCollapsable collapsed={payer === 'Me' && requestDeliveryLocation === 'Select'}>
                        <View style={globalStyles.inputWrapper}>
                            {hasCustomerNote ? (
                                <CustomAnimatedInput
                                    placeholder={t('pages.mainHome.customer_note')}
                                    value={customerNote}
                                    autoFocus
                                    onChangeText={setCustomerNote}
                                />
                            ) : (
                                <Text onPress={() => setHasCustomerNote(true)} style={globalStyles.link}>{t('pages.mainHome.note_to_customer')}</Text>
                            )}
                        </View>
                    </ViewCollapsable>

                    {payer === 'Me' && (
                        <View>
                            {/* ===== Price info ===== */}
                            <TouchableOpacity onPress={() => setSeePriceBreakDown(!seePriceBreakDown)}>
                                <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                    <Text style={styles.totalPriceTitle}>{t('payment_detail.see_price_breakdown')}</Text>
                                    <Text style={styles.totalPrice}>US$ {priceToFixed(price?.total)}</Text>
                                    <View style={globalStyles.arrowRight} />
                                </View>
                            </TouchableOpacity>
                            <ViewCollapsable collapsed={!seePriceBreakDown}>
                                <PriceBreakdown price={price} distance={!direction ? null : direction.routes[0].legs[0].distance} />
                            </ViewCollapsable>

                            <View style={styles.spacer} />
                        </View>
                    )}
                </View>
                <View>
                    {payer === 'Me' && <View style={globalStyles.inputWrapper}>
                        <PaymentMethodPicker
                            selected={creditCard}
                            onValueChange={setCreditCard}
                            errorText={validateEnabled && validateCreditCard(creditCard)}
                        />

                        {/*<View style={globalStyles.inputWrapper}>*/}
                        {/*    <PrimaryButton*/}
                        {/*        title="Payment"*/}
                        {/*        onPress={testPayment}*/}
                        {/*    />*/}
                        {/*</View>*/}
                    </View>}
                    {!!error && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type="danger"
                                message={error}
                                onClose={() => setError('')}
                            />
                        </View>
                    )}
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const mapStateToProps = state => {
    // let {loaded, loading, list, selected} = state.app.paymentMethods;
    return {
        // paymentMethodLoading: loading,
        // paymentMethodLoaded: loaded,
        // paymentMethods: list,
        // selectedPaymentMethod: selected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addNewOrderToRedux: newOrder => dispatch(addNewOrderAction(newOrder)),
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row'
    },
    h1: {
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 24,
    },
    vehicleTypeBtn: {
        backgroundColor: GRAY_LIGHT_EXTRA,
        height: 42,
        borderRadius: 18,
        padding: 6,
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    vehicleTypeText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 13,
        // lineHeight: 24,
    },
    pikAccountAlert: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    totalPriceTitle: {
        color: COLOR_PRIMARY_900,
        flexGrow: 1,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    totalPrice: {
        paddingHorizontal: 16,
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 24,
    },
    spacer: {
        backgroundColor: GRAY_LIGHT_EXTRA,
        height: 2,
        marginHorizontal: -16,
        marginVertical: 19,
    },
    imageContainer: {
        borderRadius: 5,
        overflow: 'hidden',
        margin: 8,
        // marginVertical: 20,
    },

    image: {
        width: 64,
        height: 64,
        borderWidth: 1,
        backgroundColor: "#999",
    },
    removeBtn: {
        backgroundColor: COLOR_PRIMARY_500 + "aa",
        color: 'white',
        position: 'absolute',
        left: 5,
        right: 5,
        bottom: 5,
        lineHeight: 24,
        textAlign: 'center',
        borderRadius: 5
    },
    uploadBtn: {
        width: 80,
        height: 80,
        // marginVertical: 20,
    },
    packagePhoto: {
        height: 64,
        width: 64,
        marginRight: 5,
        marginBottom: 5,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeSendPackageScreen);
export {
    VehicleTypeBtn,
    navigateToOrderDetail,
};

import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    addNewOrder as addNewOrderAction,
} from '../../../redux/actions/appActions';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import Api from '../../../utils/api';
import {
    GRAY_LIGHT_EXTRA,
    COLOR_PRIMARY_900, COLOR_NEUTRAL_GRAY,
} from '../../../utils/constants';
import PrimaryButton from '../../../components/ButtonPrimary';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
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
import { PhoneNumberUtil } from 'google-libphonenumber';
const phoneUtils = PhoneNumberUtil.getInstance();

import { VehicleTypeBtn, navigateToOrderDetail } from './HomeSendPackageScreen';
import UserInfo from '../../../components/UserInfo';

import { useTranslation } from 'react-i18next';

const HomeRequestPackageScreen = ({ navigation, route, ...props }) => {
    let { t } = useTranslation();

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [validateEnabled, setValidateEnabled] = useState(false);
    const [vehicleType, setVehicleType] = useState('Moto')
    const [pickupAddress, setPickupAddress] = useState(null)
    const [hasCustomerNote, setHasCustomerNote] = useState(false)
    const [customerNote, setCustomerNote] = useState('')
    const [hasPickupNote, setHasPickupNote] = useState(false)
    const [pickupNote, setPickupNote] = useState('')
    const [deliveryAddress, setDeliveryAddress] = useState(null)
    const [requestPickupLocation, setRequestPickupLocation] = useState('Select')
    const [hasDeliveryNote, setHasDeliveryNote] = useState(false)
    const [deliveryNote, setDeliveryNote] = useState('')
    const [personName, setPersonName] = useState('')
    const [personContact, setPersonContact] = useState(null)
    const [personMobile, setPersonMobile] = useState('')
    const [person, setPerson] = useState(null);
    const [personNotFound, setPersonNotFound] = useState(false);
    const [mobileUnFormatted, setMobileUnFormatted] = useState('')
    const [creditCard, setCreditCard] = useState(null)
    const [seePriceBreakDown, setSeePriceBreakDown] = useState(false)
    const [direction, setDirection] = useState(null);
    const [price, setPrice] = useState(null);

    const selectPickupLocation = () => {
        navigation.navigate('LocationGet', { setLocation: setPickupAddress, address: pickupAddress })
    }

    const selectDeliveryLocation = () => {
        navigation.navigate('LocationGet', { setLocation: setDeliveryAddress, address: deliveryAddress })
    }

    useEffect(() => {
        if (personContact) {
            console.log(clearPhoneNumber(personContact.phoneNumbers[0].number));

            setMobileUnFormatted(clearPhoneNumber(personContact.phoneNumbers[0].number))
            setPersonMobile(clearPhoneNumber(personContact.phoneNumbers[0].number))
            if (!personName)
                setPersonName(`${personContact.givenName} ${personContact.familyName}`.trim())
        }
    }, [personContact])

    useEffect(() => {
        setPersonNotFound(false)
        setPerson(null);

        console.log("============= personalMobile = ", personMobile);

        if (!personMobile || validateSenderPhone(personMobile))
            return;

        Api.Customer.getMobileInfo(personMobile)
            .then(({ success, message, customer }) => {
                console.log(customer)

                if (success && customer) {
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
            .then(({ success, price, message }) => {
                console.log(price)
                if (success)
                    setPrice(price);
            })
    }, [vehicleType, pickupAddress, deliveryAddress])

    // ======== Validations =============
    const validateAddress = address => {
        if (!address)
            return t('pages.mainHome.select_location')
    }
    const validateSenderName = name => {
        if (!name)
            return t('pages.mainHome.write_sender_name')
    }
    const validateSenderPhone = phone => {
        if (!phone)
            return t('pages.mainHome.enter_sender_phone')
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
            isRequest: requestPickupLocation === 'Select' ? false : true,
            vehicleType,
            deliveryAddress,
            deliveryNote,
            customerNote,
            payer: requestPickupLocation === 'Select' ? 'sender' : 'receiver',
            personName,
            personMobile,
            ...(requestPickupLocation === 'Select' ? {
                pickupAddress,
                pickupNote,
            } : {}),
            creditCard,
        }

        obj2FormData(data, formBody, '');

        return data;
    }

    const placeOrder = () => {
        setError('');

        let errors = [
            validateAddress(deliveryAddress),
            validateSenderName(personName),
            validateSenderPhone(personMobile),
            requestPickupLocation === 'Select' ? validateAddress(pickupAddress) : null,
            validateCreditCard(creditCard),
        ].filter(_.identity);

        if (errors.length > 0) {
            setValidateEnabled(true);
            setError(t('pages.mainHome.check_form_try'));
            return
        }

        if (requestPickupLocation !== 'Select' && !person) {
            setValidateEnabled(true);
            setError(`${t('pages.mainHome.sender_pik_user')}(${personMobile}) ${t('pages.mainHome.not_found')}`);
            return
        }

        let formData = createFormData();

        Api.Customer.postNewOrder(formData)
            .then(response => {
                console.log("Response", response)
                let { success, message, order } = response
                if (success) {
                    props.addNewOrderToRedux(order);
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
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                contentStyle={{ paddingBottom: 0 }}
                Header={
                    <HeaderPage
                        title={t('pages.mainHome.request_package')}
                        color={HeaderPage.Colors.BLACK}
                    />
                }
                footer={(
                    <PrimaryButton
                        style={{ marginHorizontal: -16, borderRadius: 0 }}
                        title={t('general.place_order')}
                        onPress={() => placeOrder()}
                    />
                )}
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
                        <Text style={styles.h1}>{t('pages.mainHome.pickup_location')}</Text>
                    </View>
                    <View style={globalStyles.inputWrapper}>
                        <RadioInputObject
                            value={requestPickupLocation}
                            items={[{value: 'Select', label: t('pages.mainHome.select')}, {value: 'Request', label: t('pages.mainHome.request')}]}
                            onChange={setRequestPickupLocation}
                        />
                    </View>
                    <ViewCollapsable collapsed={requestPickupLocation !== 'Select'}>
                        <View style={globalStyles.inputWrapper}>
                            <LocationPicker
                                placeholder={t('pages.mainHome.select_pickup_location')}
                                value={pickupAddress}
                                onPress={selectPickupLocation}
                                errorText={validateEnabled && validateAddress(pickupAddress)}
                            />
                        </View>

                        {/* ===== Pickup Note ===== */}
                        <View style={globalStyles.inputWrapper}>
                            {hasPickupNote ? (
                                <CustomAnimatedInput
                                    placeholder={t('pages.mainHome.note_to_driver')}
                                    autoFocus={true}
                                    value={pickupNote}
                                    onChangeText={setPickupNote}
                                />
                            ) : (
                                <Text
                                    onPress={() => setHasPickupNote(true)}
                                    style={globalStyles.link}
                                >{t('pages.mainHome.note_to_driver')}</Text>
                            )}
                        </View>
                    </ViewCollapsable>

                    {/* ===== Sender Note ===== */}
                    <View style={globalStyles.inputWrapper}>
                        {hasCustomerNote ? (
                            <CustomAnimatedInput
                                placeholder={t('pages.mainHome.note_to_sender')}
                                autoFocus={true}
                                value={customerNote}
                                onChangeText={setCustomerNote}
                            />
                        ) : (
                            <Text
                                onPress={() => setHasCustomerNote(true)}
                                style={globalStyles.link}
                            >{t('pages.mainHome.note_to_sender')}</Text>
                        )}
                    </View>

                    {/* ===== Sender Info ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <Text style={styles.h1}>{t('pages.mainHome.request_to')}</Text>
                    </View>

                    {/* ===== Sender name ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <CustomAnimatedInput
                            value={personName}
                            onChangeText={setPersonName}
                            placeholder={t('pages.mainHome.sender_name')}
                            button={(
                                <Text
                                    onPress={() => navigation.navigate('MainHomePackageContacts', { setContact: setPersonContact })}
                                    style={globalStyles.link}
                                >
                                    <FontAwesome5 name="search" />
                                    <Text> {t('contact.title')}</Text>
                                </Text>
                            )}
                            errorText={validateEnabled && validateSenderName(personName)}
                        />
                    </View>

                    {/* ===== Sender Phone ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <PhoneInput
                            value={mobileUnFormatted}
                            onChangeText={setMobileUnFormatted}
                            onChangeFormattedText={setPersonMobile}
                            errorText={validateEnabled && validateSenderPhone(personMobile)}
                        />
                        {requestPickupLocation !== 'Select' && (<Text style={styles.pikAccountAlert}>{t('pages.mainHome.phone_must_pik_account')}</Text>)}
                    </View>
                    <View style={globalStyles.inputWrapper}>
                        {!!person && (
                            <UserInfo user={person} />
                        )}
                        {requestPickupLocation !== 'Select' && !!personMobile && personNotFound && (
                            <Text style={[globalStyles.alert, globalStyles.alertWarning]}>
                                {t('pages.mainHome.mobile_not_pik')}
                            </Text>
                        )}
                    </View>

                    {/* ===== Delivery location ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <LocationPicker
                            placeholder={t('pages.mainHome.select_delivery_location')}
                            value={deliveryAddress}
                            onPress={selectDeliveryLocation}
                            errorText={validateEnabled && validateAddress(pickupAddress)}
                        />
                    </View>

                    {/* ===== Delivery note ===== */}
                    <View style={globalStyles.inputWrapper}>
                        {hasDeliveryNote ? (
                            <CustomAnimatedInput
                                placeholder={t('pages.mainHome.delivery_note')}
                                autoFocus={true}
                                value={deliveryNote}
                                onChangeText={setDeliveryNote}
                            />
                        ) : (
                            <Text onPress={() => setHasDeliveryNote(true)} style={globalStyles.link}>{t('pages.mainHome.delivery_note')}</Text>
                        )}
                    </View>
                    <ViewCollapsable collapsed={requestPickupLocation !== 'Select'}>
                        {/* ===== Price info ===== */}
                        <TouchableOpacity onPress={() => setSeePriceBreakDown(!seePriceBreakDown)}>
                            <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                <Text style={styles.totalPriceTitle}>{t('payment_detail.see_price_breakdown')}</Text>
                                <Text style={styles.totalPrice}>US$ {priceToFixed(price?.total)}</Text>
                                <View style={globalStyles.arrowRight} />
                            </View>
                        </TouchableOpacity>
                        <ViewCollapsable collapsed={!seePriceBreakDown}>
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>{t('payment_detail.distance')}</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.distance)}</Text>
                            </View>
                            <View style={styles.priceItemSpacer} />
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>{t('payment_detail.vehicle_type')}</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.vehicleType)}</Text>
                            </View>
                            <View style={styles.priceItemSpacer} />
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>{t('payment_detail.tax')}</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.tax)}</Text>
                            </View>
                        </ViewCollapsable>
                    </ViewCollapsable>

                    <View style={styles.spacer} />
                </View>
                <View>
                    <View style={globalStyles.inputWrapper}>
                        <PaymentMethodPicker
                            selected={creditCard}
                            onValueChange={setCreditCard}
                            errorText={validateEnabled && validateCreditCard(creditCard)}
                        />
                    </View>
                    {!!error && <Text style={[globalStyles.alert, globalStyles.alertDanger, { marginBottom: 16 }]}>{error}</Text>}
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
        height: 36,
        borderRadius: 18,
        padding: 6,
    },
    vehicleTypeText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
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
    priceItem: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 16,
    },
    priceItemSpacer: {
        height: 1,
        backgroundColor: '#ddd',
    },
    priceItemTitle: {
        flexGrow: 1,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    priceItemValue: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    spacer: {
        backgroundColor: GRAY_LIGHT_EXTRA,
        height: 2,
        marginHorizontal: -16,
        marginVertical: 19,
    },
    packagePhoto: {
        height: 64,
        width: 64,
        marginRight: 5,
        marginBottom: 5,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeRequestPackageScreen);

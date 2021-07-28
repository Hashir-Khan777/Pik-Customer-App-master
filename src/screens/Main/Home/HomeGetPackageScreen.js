import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
    updateOrder as updateOrderAction,
    loadOrdersList as loadOrdersListAction,
    reloadSingleOrder as reloadSingleOrderAction,
} from '../../../redux/actions/appActions';
import {
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    View,
    Text,
} from 'react-native';
import Api from '../../../utils/api';
import {
    GRAY_LIGHT_EXTRA,
    COLOR_PRIMARY_900, COLOR_NEUTRAL_GRAY, GRADIENT_2, COLOR_PRIMARY_500,
} from '../../../utils/constants';
import PrimaryButton from '../../../components/ButtonPrimary';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/globalStyles';
import {
    clearPhoneNumber,
    expandCustomTimeFrames,
    getDateScheduleTimes,
    obj2FormData,
    priceToFixed,
} from '../../../utils/helpers';
import { PhoneNumberUtil } from 'google-libphonenumber';
import BusinessInfo from '../../../components/BusinessInfo';
import ViewCollapsable from '../../../components/ViewCollapsable';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonSecondary from '../../../components/ButtonSecondary';
import LocationPicker from '../../../components/LocationPicker';
import ActionSheet from 'react-native-actionsheet';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import PaymentMethodPicker from '../../../components/PaymentMethodPicker';
import GradientView from '../../../components/GradientView';
import OrderSchedulePicker from '../../../components/OrderSchedulePicker';
import AlertBootstrap from '../../../components/AlertBootstrap';
import { navigateToOrderDetail } from './HomeSendPackageScreen';
import PriceBreakdown from '../../../components/PriceBreakdown';
const phoneUtils = PhoneNumberUtil.getInstance();

import { useTranslation } from 'react-i18next';

const OnOffBtn = ({ title, on, disabled, onPress }) => {
    let titleStyle = { fontWeight: '700', fontSize: 16, color: COLOR_PRIMARY_900 };
    let wrapperStyle = {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    }
    if (disabled) {
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={[wrapperStyle, { borderColor: GRAY_LIGHT_EXTRA, borderWidth: 1 }]}>
                    <Text style={[titleStyle, { color: GRAY_LIGHT_EXTRA }]}>{title}</Text>
                </View>
            </View>
        )
    } else if (on) {
        return (
            <TouchableOpacity style={{ flexGrow: 1 }} onPress={onPress}>
                <GradientView style={wrapperStyle} gradient={GRADIENT_2}>
                    <Text style={[titleStyle, { color: 'white' }]}>{title}</Text>
                </GradientView>
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity style={{ flexGrow: 1 }} onPress={onPress}>
                <View style={[wrapperStyle, { borderWidth: 1 }]}>
                    <Text style={titleStyle}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const HomeGetPackageScreen = ({ navigation, route, ...props }) => {
    let { t } = useTranslation();

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [customTimeFrames, setCustomTimeFrames] = useState({});
    const [scheduleType, setScheduleType] = useState('now'); // now/schedule
    const [schedule, setSchedule] = useState(null)
    const [validateEnabled, setValidateEnabled] = useState(false);
    const [address, setAddress] = useState(null)
    const [hasNote, setHasNote] = useState(false)
    const [note, setNote] = useState('')
    const [creditCard, setCreditCard] = useState(null)
    const [seePackages, setSeePackages] = useState(false)
    const [seePriceBreakDown, setSeePriceBreakDown] = useState(false)
    const [direction, setDirection] = useState(null);
    const [price, setPrice] = useState(null);
    const [refreshing, setRefreshing] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const { orderId } = route.params;
    const { orders, ordersLoaded, ordersLoading, loadOrdersList } = props;
    const order = useMemo(() => {
        let o = props.orders.find(o => o._id === orderId)
        if (!o)
            loadOrdersList()
        return o;
    }, [orderId, JSON.stringify(orders)])

    const selectLocation = () => {
        navigation.navigate('LocationGet', { setLocation: setAddress, address })
    }

    useEffect(() => {
        if (!order || !address || !order?.sender?.address)
            return;
        Api.Customer.calcOrderPrice(order.vehicleType, order.pickup.address, address, order.sender._id)
            .then(({ success, price, direction, message }) => {
                if (success) {
                    console.log('price:', price)
                    setPrice(price);
                    if (price.total && price.businessCoverage && price.total <= price.businessCoverage) {
                        setIsFree(true)
                    }
                    setDirection(direction);
                }
            })
    }, [order, address])

    const reloadCustomTimeFrames = () => {
        setCustomTimeFrames({})
        if (!order)
            return;
        return Api.Customer.getBusinessTimeFrames(order.sender._id)
            .then(({ customTimeFrames }) => {
                let result = expandCustomTimeFrames(customTimeFrames)
                setCustomTimeFrames(result)
            })
            .catch(console.log)
    }

    useEffect(() => {
        reloadCustomTimeFrames()
    }, [order])

    let nowSchedule = useMemo(() => {
        if (!order)
            return null;
        let current = moment()
        let scheduleDate = current.format('YYYY-MM-DD')
        let timeItems = getDateScheduleTimes(scheduleDate, order.sender.timeFrames, customTimeFrames);

        if (timeItems.length > 0) {
            let scheduleTile = moment(scheduleDate + ' ' + timeItems[0].from)
            if (current.add(30, 'minutes').isBefore(scheduleTile)) {
                setScheduleType('schedule');
                return null;
            }
            return {
                date: scheduleDate,
                time: timeItems[0].value
            }
        }
        else
            return null;
    }, [JSON.stringify(order?.sender?.timeFrames), Object.keys(customTimeFrames).join(',')])

    let orderSchedule = useMemo(() => {
        return scheduleType === 'now' ? nowSchedule : schedule
    }, [JSON.stringify(nowSchedule), scheduleType, JSON.stringify(schedule)])

    // ======== Validations =============
    const validateSchedule = () => {
        if (!orderSchedule?.date || !orderSchedule?.time)
            return t('pages.mainHome.schedule_packages');
    }
    const validateAddress = address => {
        if (!address)
            return "Por favor seleccione una ubicación"
    }
    const validateCreditCard = cardNumber => {
        if (!cardNumber && !isFree)
            return t('pages.mainHome.select_credit_card');
    }
    // ==================================

    const createFormData = () => {
        const data = new FormData();

        let formBody = {
            scheduleType,
            schedule: orderSchedule,
            address,
            note,
            creditCard,
            isFree
        }
        obj2FormData(data, formBody, '');

        return data;
    }

    const completeOrder = () => {
        setError('');

        let errors = [
            validateSchedule(scheduleType, schedule),
            validateAddress(address),
            validateCreditCard(creditCard),
        ].filter(_.identity);

        if (errors.length > 0) {
            setValidateEnabled(true);
            setError(errors[0]);
            return
        }

        let formData = createFormData();
        setInProgress(true);

        Api.Server.getTime()
            .then(({ success, timestamp, deltaTime }) => {
                console.log('deltat time:', deltaTime)
                if (deltaTime && Math.abs(deltaTime) > 6000000)
                    throw { message: t('pages.mainHome.server_time_not_match') }
                console.log('formData:', formData)
                return Api.Customer.completeOrder(order._id, formData)
            })
            .then(response => {
                console.log("Response", response)
                let { success, message, order } = response
                if (success) {
                    props.reduxUpdateOrder(order._id, order);
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
            .finally(() => {
                setInProgress(false);
            })
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await props.reloadSingleOrder(orderId)
        await reloadCustomTimeFrames()
        setRefreshing(false);
    }, []);

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentStyle={{ paddingBottom: 0 }}
                Header={(
                    <HeaderPage
                        title={t('pages.mainHome.get_packages')}
                        color={HeaderPage.Colors.BLACK}
                    />
                )}
                footer={(
                    <PrimaryButton
                        style={{ marginHorizontal: -16, borderRadius: 0 }}
                        title={t('pages.mainHome.get_packages')}
                        inProgress={inProgress}
                        disabled={inProgress}
                        onPress={() => completeOrder()}
                    />
                )}
                footerStyle={{ marginHorizontal: -16 }}
            >
                {!order && <ActivityIndicator size="large" color={COLOR_PRIMARY_500} />}
                {!!order && <View style={{ flexGrow: 1 }}>
                    <View style={globalStyles.inputWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate('MainHomeBusinessInfo', { business: order.sender })}>
                            <BusinessInfo business={order.sender} />
                        </TouchableOpacity>
                    </View>

                    {/* ===== Packages Info ===== */}
                    <TouchableOpacity onPress={() => navigation.navigate('HomePackageView', { order })}>
                        <View style={[styles.flexRow, styles.packagesItems]}>
                            <Text style={styles.totalPriceTitle}>{order?.packages?.length} {t('pages.mainHome.packages_pickup')}</Text>
                            <View style={globalStyles.arrowRight} />
                        </View>
                    </TouchableOpacity>

                    {/* ===== Booking Title ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <Text style={styles.h1}>
                            <FontAwesome5 name="calendar" />
                            <Text> {t('pages.mainHome.book_delivery')}</Text>
                        </Text>
                    </View>

                    {/* ===== Booking Schedule ===== */}
                    {/*<Text>{JSON.stringify(nowSchedule)}</Text>*/}
                    <View style={globalStyles.inputWrapper}>
                        <View style={globalStyles.flexRowCenter}>
                            <OnOffBtn
                                on={scheduleType === 'now'}
                                disabled={!nowSchedule}
                                title={t('pages.mainHome.pik_now')}
                                onPress={() => setScheduleType('now')}
                            />
                            <View style={{ width: 16 }} />
                            <OnOffBtn
                                on={scheduleType === 'schedule' || !nowSchedule}
                                title={t('pages.mainHome.schedule')}
                                onPress={() => setScheduleType('schedule')}
                            />
                        </View>
                    </View>
                    <ViewCollapsable collapsed={scheduleType === 'schedule' || !nowSchedule}>
                        <View style={globalStyles.inputWrapper}>
                            <Text style={styles.scheduleComment}>{t('pages.mainHome.order_start_immediately')}</Text>
                        </View>
                    </ViewCollapsable>
                    {/*<Text>{scheduleType}</Text>*/}
                    {/*<Text>{JSON.stringify(nowSchedule)}</Text>*/}
                    {/*<Text>{JSON.stringify(schedule)}</Text>*/}
                    {/*<Text>schedule: {JSON.stringify(orderSchedule)}</Text>*/}
                    <ViewCollapsable collapsed={scheduleType === 'now' && !!nowSchedule}>
                        <View style={{ paddingVertical: 25 }}>
                            <OrderSchedulePicker
                                schedule={schedule}
                                timeFrames={order.sender.timeFrames}
                                customTimeFrames={customTimeFrames}
                                onChange={(s) => { setSchedule(s); setScheduleType('schedule'); }}
                                errorText={validateEnabled && validateSchedule()}
                            />
                        </View>
                    </ViewCollapsable>

                    {/*<Text>{JSON.stringify(customTimeFrames)}</Text>*/}

                    <View style={globalStyles.inputWrapper}>
                        <LocationPicker
                            placeholder={t('pages.mainHome.select_delivery_location')}
                            value={address}
                            onPress={selectLocation}
                            errorText={validateEnabled && validateAddress(address)}
                        />
                    </View>

                    {/* ===== Pickup Note ===== */}
                    <View style={globalStyles.inputWrapper}>
                        {hasNote ? (
                            <CustomAnimatedInput
                                placeholder={t('pages.mainHome.delivery_note')}
                                value={note}
                                onChangeText={setNote}
                                autoFocus
                            />
                        ) : (
                            <Text onPress={() => setHasNote(true)} style={globalStyles.link}>+ {t('pages.mainHome.delivery_note')}</Text>
                        )}
                    </View>

                    {/* ===== Pickup Note ===== */}
                    <View style={globalStyles.inputWrapper}>
                        <PaymentMethodPicker
                            selected={creditCard}
                            onValueChange={setCreditCard}
                            errorText={validateEnabled && validateCreditCard(creditCard)}
                        />
                    </View>
                    {/* {price && price.total > price.businessCoverage && (
                        <>
                            <View style={globalStyles.inputWrapper}>
                                <PaymentMethodPicker
                                    selected={creditCard}
                                    onValueChange={setCreditCard}
                                    errorText={validateEnabled && validateCreditCard(creditCard)}
                                />
                            </View>
                        </>
                    )} */}
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

                </View>}
                <View>
                    <View style={styles.spacer} />
                    {!!error && <View style={globalStyles.inputWrapper}>
                        <AlertBootstrap type='danger' message={error} onClose={() => setError('')} />
                    </View>}
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const mapStateToProps = state => {
    let { orders, ordersLoaded, ordersLoading } = state.app;
    return { orders, ordersLoaded, ordersLoading }
}

const mapDispatchToProps = dispatch => {
    return {
        loadOrdersList: () => dispatch(loadOrdersListAction()),
        reloadSingleOrder: orderId => dispatch(reloadSingleOrderAction(orderId)),
        reduxUpdateOrder: (orderId, update) => dispatch(updateOrderAction(orderId, update)),
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
    packagesItems: {
        borderBottomColor: GRAY_LIGHT_EXTRA,
        borderBottomWidth: 1,
        marginHorizontal: -16,
        padding: 16,
        marginBottom: 16,
    },
    h1: {
        color: COLOR_PRIMARY_900,
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

    itemName: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    itemBarcode: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
    },
    itemIcon: {
        marginVertical: 'auto',
        marginRight: 18,
    },
    scheduleComment: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeGetPackageScreen);

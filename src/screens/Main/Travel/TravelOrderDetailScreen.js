import React, { useState, useMemo, useEffect } from 'react'
import moment from 'moment';
import 'moment/locale/es'
import { compose } from 'redux';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    View,
    Text, Image
} from 'react-native';
import Share from 'react-native-share';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
    GRADIENT_2,
} from '../../../utils/constants';
import globalStyles from '../../../utils/globalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import GradientButton from '../../../components/GradientButton';
import { SvgUri, SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import AlertBootstrap from '../../../components/AlertBootstrap';
import {
    loadOrdersList as loadOrdersListAction,
    updateOrder as updateOrderAction
} from '../../../redux/actions';
import UserInfo from '../../../components/UserInfo';
import Api from '../../../utils/api'
import BaseModal from '../../../components/BaseModal';
import OrderStatuses from '../../../../../node-back/src/constants/OrderStatuses'
import { callPhoneNumber, generateQrCode, priceToFixed, uploadUrl } from '../../../utils/helpers';
import PrimaryButton from '../../../components/ButtonPrimary';
import DriverInfo from '../../../components/DriverInfo';
import CircleProgress from '../../../components/CircleProgress';
import TextSingleLine from '../../../components/TextSingleLine';
import ButtonSecondary from '../../../components/ButtonSecondary';
import ViewCollapsable from '../../../components/ViewCollapsable';
import FeedbackModal from '../../../components/FeedbackModal';
import PriceBreakdown from '../../../components/PriceBreakdown';
import withAuth from '../../../redux/connectors/withAuth';
import OrderChat from '../../../components/OrderChat';
import Row from '../../../components/Row';
import ProgressModal from '../../../components/ProgressModal';
import BoxShadow from '../../../components/BoxShadow';
import ImageGallery from '../../../components/ImageGallery';

import { useTranslation } from 'react-i18next';

const PriceSection = ({ order }) => {
    let { t } = useTranslation();

    let price = order.cost
    let [collapsed, setCollapsed] = useState(true);
    return <>
        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
            <View style={[styles.infoRow, { alignItems: 'center', marginTop: 20 }]}>
                <View style={{ flexGrow: 1 }}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>{t('payment_detail.see_price_breakdown')}</Text>
                        <Text style={[styles.infoVal, { fontWeight: '700' }]}>${priceToFixed(price?.total)}</Text>
                    </View>
                    <Text style={styles.infoDescription}>{t('payment_detail.will_charge_order_start')}</Text>
                </View>
                <View style={[globalStyles.arrowRight, { flexGrow: 0, marginLeft: 16 }]} />
            </View>
        </TouchableOpacity>
        <ViewCollapsable collapsed={collapsed}>
            <PriceBreakdown price={price} distance={!order.direction ? null : order.direction.routes[0].legs[0].distance} />
        </ViewCollapsable>
        <View style={styles.infoSpacer} />
    </>
}

const TravelOrderDetailScreen = ({ navigation, route, authUser, ...props }) => {
    let { t } = useTranslation();

    let [qrModalVisible, setQrModalVisible] = useState(false)
    let [refreshing, setRefreshing] = useState(false);
    let [cancelModalVisible, setCancelModalVisible] = useState(false);
    let [cancelInProgress, setCancelInProgress] = useState(false)
    let [error, setError] = useState('')
    let [waitingTime, setWaitingTime] = useState(null)
    let [inProgress, setInProgress] = useState(false)
    const { orderId } = route.params;
    const { orders, ordersLoaded, ordersLoading, loadOrdersList } = props;
    const [order, setOrder] = useState(props.orders.find(o => o._id === orderId));
    // const order = useMemo(() => {
    //     let o = props.orders.find(o => o._id===orderId)
    //     if(!o)
    //         loadOrdersList()
    //     return o;
    // }, [orderId, JSON.stringify(orders)]);

    useEffect(() => {
        let intervalOrder = setInterval(() => {
            console.log("******* get order detail");
            Api.Customer.getOrderDetail(orderId)
                .then((response) => {
                    setOrder(response.order);
                })
                .catch(error => {
                    console.log(error);
                })
        }, 8000);
        return () => clearInterval(intervalOrder)
    }, [])

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadOrdersList()
        setRefreshing(false);
    }, []);

    const orderCanCancel = () => {
        return [
            OrderStatuses.Created,
            OrderStatuses.Scheduled,
            OrderStatuses.Pending,
            OrderStatuses.Reschedule,
        ].includes(order.status);
    }

    const processOrderCancellation = () => {
        setCancelInProgress(true);
        Api.Customer.cancelOrder(orderId)
            .then(({ success, message, order: newOrder }) => {
                if (success) {
                    // return auth .reloadUserInfo();
                    props.reduxUpdateOrder(orderId, newOrder)
                } else {
                    setError(message || 'Somethings went wrong');
                }
            })
            .catch(error => {
                setError(error.message || 'Somethings went wrong')
            })
            .then(() => setCancelInProgress(false));
    }

    const cancelOrder = () => {
        if (!orderCanCancel()) {
            setError(t('pages.travel.order_cannot_cancel'))
            return;
        }
        setCancelModalVisible();
    }

    const onRescheduleConfirm = () => {
        editOrder({ scheduleConfirm: true })
    }

    const editOrderLocation = () => {
        // navigation.navigate('MainTravelEditPackage', {orderId: order._id, edit: 'deliveryAddress'})
        navigation.navigate('LocationGet', {
            address: order?.delivery?.address,
            setLocation: (newAddress => {
                editOrder({ deliveryAddress: newAddress })
            }),
        })
    }

    const editOrder = update => {
        setInProgress(true);
        Api.Customer.editOrder(orderId, update)
            .then(response => {
                let { success, message, order } = response
                if (success) {
                    props.reduxUpdateOrder(order._id, order);
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

    const computed = useMemo(() => {
        if (!order)
            return {}
        let { isRequest, status, sender, receiver, payer } = order;
        let waitForComplete = (status === 'Created' && (
            (!isRequest && !order.delivery.address)
            ||
            (isRequest && !order.pickup.address)
        ))
        let personToComplete = waitForComplete ? (
            isRequest
                ?
                (sender._id === authUser._id ? "You" : sender.name)
                :
                (receiver._id === authUser._id ? "You" : receiver.name)
        ) : ''

        let nowDate = moment().format('YYYY-MM-DD')
        let after30Minutes = moment().add(30, 'minutes').format('HH:mm')

        let needToSchedule = (
            ['Scheduled', 'Reschedule'].includes(order?.status)
            && !!order?.schedule?.date
            // && nowDate === moment(order.schedule.date).format('YYYY-MM-DD')
            // && after30Minutes > order.schedule.from
            // && after30Minutes < order.schedule.to;
        )
        let needToAcceptSchedule = (
            needToSchedule
            && nowDate === moment(order.schedule.date.split('T')[0]).format('YYYY-MM-DD')
            && after30Minutes >= order.schedule.from
            && after30Minutes < order.schedule.to
        )
        return {
            waitForComplete,
            personToComplete,
            needToSchedule,
            needToAcceptSchedule,
        }
    }, [order, moment().format('HH:mm')])

    const shareQrCode = () => {
        let qrForShare = generateQrCode(order.confirmationCode, { type: 'png', cellSize: 4 })
        let shareImage = {
            title: t('pages.travel.pik_delivery'),//string
            message: `${t('pages.travel.order_delivery_code')} ${order.confirmationCode}`,//string
            url: qrForShare,
        };
        Share.open(shareImage).catch(err => console.log(err));
    }

    const qrCode = React.useMemo(() => {
        if (order?.confirmationCode) {
            return generateQrCode(order.confirmationCode)
        }
        else {
            return null
        }
    }, [order?.confirmationCode])

    const dropOfWaiting = React.useMemo(() => {
    }, [order?.time?.deliveryArrival])

    React.useEffect(() => {
        let intervalId = setInterval(() => {

            let hasWaitingTime = (
                (authUser._id === order.sender._id && !!order?.time?.pickupArrival && !order?.time?.pickupComplete)
                ||
                (authUser._id === order.receiver._id && !!order?.time?.deliveryArrival && !order?.time?.deliveryComplete)
            )
            if (order?.status === 'Progress' && hasWaitingTime) {
                let t1 = moment(order.time.deliveryArrival || order.time.pickupArrival).toDate().getTime()
                let t2 = Date.now();

                let secondsLeft = 600 - Math.floor((t2 - t1) / 1000)
                secondsLeft = Math.max(0, secondsLeft)
                setWaitingTime(
                    Math.floor(secondsLeft / 60).toString().padStart(2, '0') +
                    ":" +
                    Math.floor(secondsLeft % 60).toString().padStart(2, '0')
                );
            }
            else {
                if (waitingTime !== null)
                    setWaitingTime(null);
            }
        }, 1000);
        return () => clearInterval(intervalId)
    }, [order])

    let isPriceVisible = React.useMemo(() => {
        if (!order || !order.cost)
            return false;
        let userCondition = order?.senderModel === 'business'
            || (order.isRequest && order[order.payer]?._id === authUser._id);
        let orderCondition = ['Created', 'Scheduled', 'Reschedule'].includes(order.status);

        let userCondition1 = order?.senderModel === 'customer'
            || (order[order.payer]?._id === authUser._id);
        let orderCondition1 = ['Pending'].includes(order.status);
        return (userCondition && orderCondition) || (userCondition1 && orderCondition1)
    }, [order])

    let photos = useMemo(() => {
        if (!order)
            return []
        return order.packages.map(p => p.photos).reduce((prev, next) => prev.concat(next))
    }, [JSON.stringify(order?.packages)])

    let imageGalleryRef = null;

    const getTitleOne = () => {
        if (order.status === 'Scheduled') {
            // console.log("++++", order.schedule.date, " : ", moment(order.schedule.date.split('T')[0]).format('dddd Do'));
            return `Programado para el `
                + moment(order.schedule.date.split('T')[0]).format('dddd Do')
                + moment(order.schedule.from, 'hh:mm').format(' h:mm A')
        }

        return `${t('pages.travel.driver')} ${!order.driver ? t('pages.travel.not') : order.status == 'Returned' ? t('pages.travel.not') : ''} ${t('pages.travel.assigned')}`
    }

    const target = useMemo(() => {
        if (order.receiver._id === authUser._id)
            return order.pickup;
        return order.delivery
    }, [order])
    moment.locale('es');
    const getSpanishDate = (date, format) => {
        let localDate = moment(date);
        moment.locale('es');
        return localDate.format('D MMMM');
    }

    return <KeyboardAvoidingScreen>
        <PageContainerDark
            refreshing={refreshing} onRefresh={onRefresh}
            Header={<HeaderPage title={t('pages.travel.order_details')} />}
        >
            <View style={{ flexGrow: 1 }}>
                {!order && <ActivityIndicator size="large" color={COLOR_PRIMARY_500} />}
                {!!order && <View>
                    {computed.waitForComplete && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type='warning'
                                message={`esperando que la orden sea completada por ${computed.personToComplete}.`}
                                // message={`${t('pages.travel.waiting')} ${computed.personToComplete} ${t('pages.travel.complete_order')}`}
                            />
                        </View>
                    )}
                    {order.status === 'Canceled' && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type="danger"
                                message={`${t('pages.travel.request_canceled')} ${moment(order.cancel?.date).format('MMMM Do hh:mm A')}`}
                            />
                        </View>
                    )}
                    {/*{order.status === 'Delivered' && (*/}
                    {/*    <AlertBootstrap*/}
                    {/*        type='success'*/}
                    {/*        message={`Delivery Code: ${order.confirmationCode}`}*/}
                    {/*    />*/}
                    {/*)}*/}
                    {!!waitingTime && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type='info'
                                // message={`Driver arrive your place.\nWaiting time: 10:20`}
                                message={<Text>
                                    <Text>{order.driver.name} {t('pages.travel.arrive_your_place')}.</Text>
                                    <Text>{"\n"}</Text>
                                    <Text style={{ fontWeight: 'bold' }}>{t('pages.travel.waiting_time')}: {waitingTime}</Text>
                                </Text>}
                            />
                        </View>
                    )}
                    {(order.status === 'Returned') && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type='danger'
                                // message={`Driver arrive your place.\nWaiting time: 10:20`}
                                message={<Text>
                                    <Text>{order.time.returnComplete ? t('pages.travel.returned_to_pickup_location') : t('pages.travel.returning_to_pickup_location')}</Text>
                                </Text>}
                            />
                        </View>
                    )}
                    {(order.status === 'Reschedule') && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type='danger'
                                // message={`Driver arrive your place.\nWaiting time: 10:20`}
                                message={<Text>
                                    <Text>{t('pages.travel.booking_cancelled_not_confirmed')}</Text>
                                </Text>}
                            />
                        </View>
                    )}
                    {computed?.needToSchedule && (
                        <View style={styles.rescheduleContainer}>
                            {computed?.needToAcceptSchedule && <Text style={styles.rescheduleTitle}>{t('pages.travel.order_will_start_confirm_location')}</Text>}
                            <View style={globalStyles.flexRow}>
                                <Text style={styles.rescheduleT1}>{t('pages.mainHome.delivery_location')}</Text>
                                <View style={{ flexGrow: 1 }} />
                                <Text
                                    onPress={editOrderLocation}
                                    style={styles.rescheduleT2}
                                >{t('pages.travel.change_location')}</Text>
                            </View>
                            <TextSingleLine style={styles.rescheduleAddress}>{order?.delivery?.address?.formatted_address}</TextSingleLine>
                            <Row space={16}>
                                <ButtonSecondary
                                    title={t('pages.travel.reschedule')}
                                    onPress={() => navigation.navigate('MainTravelEditPackage', { orderId: order._id, edit: 'schedule' })}
                                    style={{ height: 36 }}
                                />
                                {computed?.needToAcceptSchedule && (
                                    <GradientButton
                                        title={t('pages.travel.accept')}
                                        style={{ height: 36 }}
                                        titleStyle={{ fontWeight: '700', fontSize: 16, lineHeight: 24 }}
                                        gradient={GRADIENT_2}
                                        inProgress={inProgress}
                                        disabled={inProgress}
                                        onPress={onRescheduleConfirm}
                                    />
                                )}
                            </Row>
                        </View>
                    )}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>{t('pages.travel.order_id')}</Text>
                        <Text style={styles.infoVal}>{order.id}</Text>
                    </View>
                    <View style={styles.infoSpacer} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>{t('pages.travel.date')}</Text>
                        {/*<Text style={styles.infoVal}>Dec 5th, 2020</Text>*/}
                        <Text style={styles.infoVal}>{moment(order.time.confirm || order.createdAt).format('MMMM Do, YYYY hh:mmA')}</Text>
                    </View>
                    <View style={styles.infoSpacer} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>{t('pages.travel.vehicle_type')}</Text>
                        <Text style={styles.infoVal}>{t('pages.travel.vehicle.' + order.vehicleType)}</Text>
                    </View>
                    {!!target && <>
                        <View style={styles.infoSpacer} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoTitle}>{target?.name}</Text>
                            <Text style={styles.infoVal}>{target?.phone}</Text>
                        </View>
                    </>}
                    {(
                        !!qrCode
                        && !!order.time.pickupComplete
                        && !order?.time?.deliveryComplete
                        && !order?.time?.returnComplete
                    ) && <>
                            <View style={styles.infoSpacer} />
                            <View style={styles.infoRow}>
                                <View style={globalStyles.flexRowCenter}>
                                    <TouchableOpacity onPress={() => setQrModalVisible(true)}>
                                        <SvgXml style={{ width: 50, height: 50, marginRight: 12 }} xml={qrCode} />
                                    </TouchableOpacity>
                                    <View style={{ flexGrow: 1 }}>
                                        <View style={globalStyles.flexRow}>
                                            <Text style={styles.qrTitle}>{t('pages.travel.delivery_code')}</Text>
                                            <View style={{ flexGrow: 1 }} />
                                            <Text
                                                onPress={shareQrCode}
                                                style={globalStyles.link}
                                            >
                                                {t('pages.travel.share_qr_code')}
                                        </Text>
                                        </View>
                                        <Text style={styles.qrValue}>{order.confirmationCode}</Text>
                                    </View>
                                </View>
                            </View>
                        </>}

                    {computed.waitForComplete && (
                        <React.Fragment>
                            <View style={[globalStyles.flexRowCenter, { marginTop: 32, marginBottom: 16, }]}>
                                <Text style={[styles.h1, { flexGrow: 1 }]}>{t('pages.travel.request_to')}</Text>
                                {order.status === 'Created' && <ActivityIndicator size="small" color={COLOR_PRIMARY_900} />}
                            </View>
                            <UserInfo user={order.isRequest ? order.sender : order.receiver} />
                        </React.Fragment>
                    )}

                    {!computed.waitForComplete && (
                        <React.Fragment>
                            <View style={styles.progressContainer}>
                                <CircleProgress n={1} completed={!!order.driver} style={{ marginRight: 16 }} />
                                <View style={{ flexGrow: 1 }}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.progressTitle1}>
                                            <Text>{t('pages.travel.rider_start')}  </Text>
                                            {!!order.driver ? (order.status == 'Returned' ? null : (
                                                <Text style={{ color: COLOR_TERTIARY_SUCCESS }}>{t('pages.travel.status.Completed')}</Text>
                                            )) : (
                                                order.status === 'Pending'
                                                    ?
                                                    <Text style={{ color: COLOR_PRIMARY_500 }}>{t('pages.travel.status.InProgress')}</Text>
                                                    :
                                                    null
                                            )}
                                        </Text>
                                        {!!order.time?.driverAssign && <Text style={styles.progressTimeVal}>{moment(order.time.driverAssign).format('h:mm a')}</Text>}
                                    </View>
                                    <Text style={styles.progressTitle2}>{getTitleOne()}</Text>
                                    <Text style={styles.progressTitle3}>
                                        {!!order.driver ? (order.status == 'Returned' ? t('pages.travel.waiting') + ' ...' : `${order.driver.firstName} ${order.driver.lastName}`) : t('pages.travel.waiting') + ' ...'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <CircleProgress n={2} completed={!!order.time?.pickupComplete} style={{ marginRight: 16 }} />
                                <View style={{ flexGrow: 1 }}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.progressTitle1}>
                                            <Text>{t('pages.travel.PickupFrom')}  </Text>
                                            {!!order.time?.pickupComplete ? (
                                                <Text style={{ color: COLOR_TERTIARY_SUCCESS }}>{t('pages.travel.status.Completed')}</Text>
                                            ) : (
                                                !!order.driver
                                                    ?
                                                    <Text style={{ color: COLOR_PRIMARY_500 }}>{t('pages.travel.status.InProgress')}</Text>
                                                    :
                                                    null
                                            )}
                                        </Text>
                                        {!!order.time?.pickupComplete && <Text style={styles.progressTimeVal}>{moment(order.time.pickupComplete).format('h:mm a')}</Text>}
                                    </View>
                                    <View style={styles.infoRow}>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <Text numberOfLines={1} style={styles.progressTitle2}>{order.pickup.address?.formatted_address || t('pages.travel.waiting_for_address') + ' ...'}</Text>
                                        </View>
                                    </View>
                                    {!!order.pickup.note && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.progressTitle3}>
                                                <FontAwesome5 name="comment" />
                                            </Text>
                                            <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 8 }}>
                                                <Text style={styles.progressTitle3}>{order.pickup.note}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={styles.progressContainer}>
                                <CircleProgress
                                    n={3}
                                    completed={!!order.time?.deliveryComplete || !!order?.time?.returnComplete}
                                    style={{ marginRight: 16 }}
                                />
                                <View style={{ flexGrow: 1 }}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.progressTitle1}>
                                            {order.status === 'Returned' ? <Text>{t('pages.travel.ReturnedTo')}  </Text> : <Text>{t('pages.travel.DropOff')}  </Text>}
                                            {(!!order.time?.deliveryComplete || !!order?.time?.returnComplete) ? (
                                                <Text style={{ color: COLOR_TERTIARY_SUCCESS }}>{t('pages.travel.status.Completed')}</Text>
                                            ) : (
                                                !!order.time?.pickupComplete
                                                    ?
                                                    <Text style={{ color: COLOR_PRIMARY_500 }}>{t('pages.travel.status.InProgress')}</Text>
                                                    :
                                                    null
                                            )}
                                        </Text>
                                        {(!!order.time?.deliveryComplete || !!order?.time?.returnComplete) && (
                                            <Text style={styles.progressTimeVal}>
                                                {moment(order.time.deliveryComplete || order?.time?.returnComplete).format('h:mm a')}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.infoRow}>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            {order?.status === 'Returned' ? (
                                                <Text numberOfLines={1} style={styles.progressTitle2}>
                                                    {order?.pickup?.address?.formatted_address}
                                                </Text>
                                            ) : (
                                                <Text numberOfLines={1} style={styles.progressTitle2}>
                                                    {order?.delivery?.address?.formatted_address || t('pages.travel.waiting_for_address') + ' ...'}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    {(!!order.delivery.note && order?.status != 'Returned') && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.progressTitle3}>
                                                <FontAwesome5 name="comment" />
                                            </Text>
                                            <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 8 }}>
                                                <Text style={styles.progressTitle3}>{order.delivery.note}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </React.Fragment>
                    )}

                    {photos && <View style={[globalStyles.inputWrapper, globalStyles.flexRow, { flexWrap: 'wrap', marginHorizontal: -8 }]}>
                        {photos.map((p, i) => (
                            <TouchableOpacity key={i} onPress={() => imageGalleryRef.show()}>
                                <BoxShadow>
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} source={{ uri: p }} />
                                    </View>
                                </BoxShadow>
                            </TouchableOpacity>
                        ))}
                        <ImageGallery
                            ref={ref => { imageGalleryRef = ref }}
                            imageUrls={photos}
                        />
                    </View>}

                    {isPriceVisible && <PriceSection order={order} />}

                    {(order.status === 'Progress' && !!order.driver) && (
                        <React.Fragment>
                            <View style={[styles.infoRow, { alignItems: 'center' }]}>
                                <Text style={styles.h1}>{t('pages.travel.driver')} {t('pages.travel.assigned')}</Text>
                                <GradientButton
                                    onPress={() => navigation.navigate("MainTravelOrderTracking", { order })}
                                    style={{ height: 32 }}
                                    titleStyle={{ fontWeight: '400', fontSize: 12, lineHeight: 16 }}
                                    gradient={GRADIENT_2}
                                    title={t('pages.travel.live_tracking')}
                                />
                            </View>
                            <View style={[styles.infoRow, { alignItems: 'center', paddingVertical: 22 }]}>
                                <DriverInfo driver={order.driver} />
                                <TouchableOpacity onPress={() => callPhoneNumber(order.driver.mobile)}>
                                    <SvgXml style={{ marginLeft: 28 }} width={28} xml={svgs['icon-phone']} />
                                </TouchableOpacity>
                                <OrderChat
                                    style={{ marginLeft: 28 }}
                                    order={order}
                                    driver={order.driver}
                                    customer={authUser}
                                />
                            </View>

                            {/*<FeedbackModal order={order} />*/}
                        </React.Fragment>
                    )}
                    {order.time.pickupComplete && (
                        <BaseModal
                            visible={!!qrCode && qrModalVisible}
                        >
                            <View style={{ minWidth: 250, alignItems: 'center' }}>
                                {qrCode && <SvgXml style={{ width: 150, height: 150 }} xml={qrCode} />}
                            </View>
                            <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 24, lineHeight: 32, marginTop: 24 }}>
                                {order.confirmationCode}
                            </Text>
                            <Text style={{
                                textAlign: 'center', fontWeight: '400',
                                fontSize: 14, lineHeight: 24, color: COLOR_NEUTRAL_GRAY,
                                marginTop: 8, marginBottom: 32
                            }}>
                                Scan Delivery Code
                            </Text>
                            <PrimaryButton
                                title={t('general.done')}
                                onPress={() => setQrModalVisible(false)}
                            />
                        </BaseModal>
                    )}
                </View>}
            </View>
            {!!order && <View>
                {!!error && (
                    <AlertBootstrap
                        type="danger"
                        message={error}
                        onClose={() => setError('')}
                    />
                )}
                {orderCanCancel() && (
                    <React.Fragment>
                        <TouchableOpacity onPress={cancelOrder}>
                            <Text style={styles.cancelBtn}>{t('pages.mainHome.cancel_order')}</Text>
                        </TouchableOpacity>
                        <BaseModal
                            title="Cancelación de orden"
                            visible={cancelModalVisible}
                            maxWidth={350}
                            onRequestClose={() => setCancelModalVisible(false)}
                            buttons={[
                                {
                                    title: <Text style={{ color: COLOR_PRIMARY_500 }}>{t('pages.travel.go_back')}</Text>,
                                    onPress: () => setCancelModalVisible(false)
                                },
                                {
                                    title: <Text style={{ color: COLOR_NEUTRAL_GRAY }}>{t('pages.mainHome.cancel_order')}</Text>,
                                    onPress: () => {
                                        setCancelModalVisible(false);
                                        processOrderCancellation();
                                    }
                                },
                            ]}
                        >
                            <Text style={{ fontWeight: '400', fontSize: 16, lineHeight: 24, textAlign: 'center' }}>
                                {
                                    !!order.driver ?
                                        "If you cancel this order you wil be charged for $2,00 as cancellation fee"
                                        :
                                        t('pages.mainHome.ru_cancel_order')
                                }
                            </Text>
                        </BaseModal>
                    </React.Fragment>
                )}
            </View>}
            <ProgressModal
                title={t('pages.travel.please_wait') + " ..."}
                visible={inProgress}
            />
        </PageContainerDark>
    </KeyboardAvoidingScreen>
}



const styles = StyleSheet.create({
    h1: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoTitle: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    infoDescription: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    infoVal: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    infoSpacer: {
        height: 1,
        backgroundColor: '#F0EFEF',
        marginVertical: 16,
    },
    progressContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        maxWidth: '100%',
    },
    progressTimeVal: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_TERTIARY_HYPERLINK,
    },
    progressTitle1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    progressTitle2: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    progressTitle3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    cancelBtn: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 16,
        color: COLOR_TERTIARY_ERROR,
    },
    qrTitle: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24
    },
    qrValue: {
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 32
    },
    rescheduleContainer: {
        backgroundColor: '#F0EFEF',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
    },
    rescheduleTitle: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 16,
        marginBottom: 20,
    },
    rescheduleT1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY
    },
    rescheduleT2: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_TERTIARY_HYPERLINK,
    },
    rescheduleAddress: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 26,
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
        backgroundColor: "#999",
    },
})

const mapStateToProps = state => {
    let { orders, ordersLoaded, ordersLoading } = state.app;
    return { orders, ordersLoaded, ordersLoading }
}

const mapDispatchToProps = dispatch => ({
    loadOrdersList: () => dispatch(loadOrdersListAction()),
    reduxUpdateOrder: (orderId, update) => dispatch(updateOrderAction(orderId, update)),
})

const enhance = compose(
    withAuth,
    connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TravelOrderDetailScreen);

import React, {useState, useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import {
    updateOrder as updateOrderAction, loadOrdersList as loadOrdersListAction,
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
    COLOR_PRIMARY_900, COLOR_NEUTRAL_GRAY, GRADIENT_2,
} from '../../../utils/constants';
import PrimaryButton from '../../../components/ButtonPrimary';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/globalStyles';
import ViewCollapsable from '../../../components/ViewCollapsable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LocationPicker from '../../../components/LocationPicker';
import GradientView from '../../../components/GradientView';
import OrderSchedulePicker from '../../../components/OrderSchedulePicker';
import AlertBootstrap from '../../../components/AlertBootstrap';
import {getDateScheduleTimes, priceToFixed} from '../../../utils/helpers';

import { useTranslation } from 'react-i18next';

const OnOffBtn = ({title, on, disabled, onPress}) => {
    let { t } = useTranslation();

    let titleStyle= {fontWeight: '700', fontSize: 16};
    let wrapperStyle = {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    }
    if(disabled){
        return (
            <View style={{flexGrow: 1}}>
                <View style={[wrapperStyle, {borderColor: GRAY_LIGHT_EXTRA, borderWidth: 2}]}>
                    <Text style={[titleStyle, {color: GRAY_LIGHT_EXTRA}]}>{title}</Text>
                </View>
            </View>
        )
    }else if(on){
        return (
            <TouchableOpacity style={{flexGrow: 1}} onPress={onPress}>
                <GradientView style={wrapperStyle} gradient={GRADIENT_2}>
                    <Text style={[titleStyle, {color: 'white'}]}>{title}</Text>
                </GradientView>
            </TouchableOpacity>
        )
    }else{
        return (
            <TouchableOpacity style={{flexGrow: 1}} onPress={onPress}>
                <View style={[wrapperStyle, {borderWidth: 2}]}>
                    <Text style={titleStyle}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const TravelEditPackageScreen = ({navigation, route, ...props}) => {
    let { t } = useTranslation();

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState('');
    const [customTimeFrames, setCustomTimeFrames] = useState({});
    const [scheduleType, setScheduleType] = useState('now'); // now/schedule
    const [schedule, setSchedule] = useState(null)
    const [validateEnabled, setValidateEnabled] = useState(false);
    const [address, setAddress] = useState(null)
    const [seePriceBreakDown, setSeePriceBreakDown] = useState(false)
    const [price, setPrice] = useState(null);

    const {orderId, edit} = route.params;
    const {orders, ordersLoaded, ordersLoading, loadOrdersList} = props;
    const order = useMemo(() => {
        let o = props.orders.find(o => o._id===orderId)
        if(!o)
            loadOrdersList()
        return o || {};
    }, [orderId, JSON.stringify(orders)])

    const selectLocation = () => {
        navigation.navigate('LocationGet', {setLocation: setAddress, address: (address || order?.delivery?.address)})
    }

    useEffect(() => {
        if(!order || !address || !order?.sender?.address)
            return;
        Api.Customer.calcOrderPrice(order.vehicleType, order.pickup.address, address, order.sender._id)
            .then(({success, price, message}) => {
                if(success)
                    setPrice(price);
            })
    },[order, address])

    useEffect(() => {
        setCustomTimeFrames({})
        if(!order)
            return;
        Api.Customer.getBusinessTimeFrames(order.sender._id)
            .then(({customTimeFrames}) => {
                let result = {}
                customTimeFrames.map(item => {
                    let d1 = moment(item.from), d2 = moment(item.to);
                    let dateFormat = 'YYYY-MM-DD'
                    while(d1.format(dateFormat) <= d2.format(dateFormat)){
                        let key = d1.format(dateFormat);
                        result[key] = {
                            totallyClosed: item.totallyClosed,
                            open: item.open,
                            close: item.close,
                        };
                        d1 = d1.add(1, 'days');
                    }
                })
                setCustomTimeFrames(result)
            })
            .catch(console.log)
    }, {order})

    let nowSchedule = useMemo(() => {
        if(!order)
            return null;
        let current = moment()
        let scheduleDate = current.format('YYYY-MM-DD')
        let timeItems = getDateScheduleTimes(scheduleDate, order.sender.timeFrames, customTimeFrames);

        if(timeItems.length > 0){
            let scheduleTile = moment(scheduleDate + ' ' + timeItems[0].from)
            if(current.add(30, 'minutes').isBefore(scheduleTile)) {
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
    }, [JSON.stringify(order.sender.timeFrames), Object.keys(customTimeFrames).join(',')])

    // ======== Validations =============
    const validateSchedule = () => {
        if(edit === 'schedule') {
            if (scheduleType === 'now') {
                if (!nowSchedule && (!schedule?.date || !schedule?.time))
                    return "Seleccione la fecha / hora para enviar sus paquetes"
            } else {
                if (!schedule?.date || !schedule?.time)
                    return "Seleccione la fecha / hora para enviar sus paquetes"
            }
        }
    }
    const validateAddress = address => {
        if(edit === 'deliveryAddress') {
            if (!address)
                return "seleccionar ubicación"
        }
    }
    // ==================================

    const createFormData = () => {
        const data = new FormData();

        let formBody = {
            scheduleType,
            schedule: (!!nowSchedule && scheduleType==='now') ? nowSchedule : schedule,
            address
        }
        obj2FormData(data, formBody, '');

        return data;
    }

    const completeOrder = () => {
        setError('');

        let errors = [
            validateSchedule(scheduleType, schedule),
            validateAddress(address),
        ].filter(_.identity);

        if(errors.length > 0){
            setValidateEnabled(true);
            setError('Por favor verifique los campos para continuar');
            return
        }

        let orderInfo = {};
        if(edit === 'schedule'){
            orderInfo = {schedule: (!!nowSchedule && scheduleType==='now') ? nowSchedule : schedule}
        }
        else if(edit === 'deliveryAddress'){
            orderInfo = {deliveryAddress: address}
        }
        else{
            setValidateEnabled(true);
            setError('Tipo de edición no válida');
            return
        }

        setInProgress(true);
        Api.Customer.editOrder(order._id, orderInfo)
            .then(response => {
                console.log("Response", response)
                let {success, message, order} = response
                if(success){
                    props.reduxUpdateOrder(order._id, order);
                    navigation.goBack()
                }
                else{
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

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                contentStyle={{paddingBottom: 0}}
                Header={(
                    <HeaderPage
                        title={'Reprogramar entrega'}
                        color={HeaderPage.Colors.BLACK}
                    />
                )}
                footer={(
                    <PrimaryButton
                        style={{marginHorizontal: -16, borderRadius: 0}}
                        title={t('general.confirm')}
                        inProgress={inProgress}
                        disabled={inProgress}
                        onPress={() => completeOrder()}
                    />
                )}
                footerStyle={{marginHorizontal: -16}}
            >
                <View style={{flexGrow: 1}}>
                    {edit==='schedule' && <>
                        {/* ===== Booking Title ===== */}
                        <View style={globalStyles.inputWrapper}>
                            <Text style={styles.h1}>
                                <FontAwesome5 name="calendar"/>
                                <Text>Entrega de libros</Text>
                            </Text>
                        </View>

                        {/* ===== Booking Schedule ===== */}
                        {/*<Text>{JSON.stringify([nowSchedule, schedule])}</Text>*/}
                        <View style={globalStyles.inputWrapper}>
                            <View style={globalStyles.flexRowCenter}>
                                <OnOffBtn
                                    on={scheduleType==='now'}
                                    disabled={!nowSchedule}
                                    title="PIK ahora"
                                    onPress={() => setScheduleType('now')}
                                />
                                <View style={{width: 16}} />
                                <OnOffBtn
                                    on={scheduleType==='schedule' || !nowSchedule}
                                    title="Calendario"
                                    onPress={() => setScheduleType('schedule')}
                                />
                            </View>
                        </View>
                        <ViewCollapsable collapsed={scheduleType==='schedule' || !nowSchedule}>
                            <View style={globalStyles.inputWrapper}>
                                <Text style={styles.scheduleComment}>Su orden de retiro comenzará inmediatamente.</Text>
                            </View>
                        </ViewCollapsable>
                        <ViewCollapsable collapsed={scheduleType==='now' && !!nowSchedule}>
                            <View style={{paddingVertical: 25}}>
                                <OrderSchedulePicker
                                    schedule={schedule}
                                    timeFrames={order.sender.timeFrames}
                                    customTimeFrames={customTimeFrames}
                                    onChange={(s) => {setSchedule(s); setScheduleType('schedule');}}
                                    errorText={validateEnabled && validateSchedule()}
                                />
                            </View>
                        </ViewCollapsable>
                    </>}

                    {edit==='deliveryAddress' && <>
                        <View style={globalStyles.inputWrapper}>
                            <LocationPicker
                                placeholder={t('pages.mainHome.select_delivery_location')}
                                value={address || order?.delivery?.address}
                                onPress={selectLocation}
                                errorText={validateEnabled && validateAddress(address)}
                            />
                        </View>

                        {/* ===== Price info ===== */}
                        <TouchableOpacity onPress={() => setSeePriceBreakDown(!seePriceBreakDown)}>
                            <View style={[styles.flexRow, {alignItems: 'center'}]}>
                                <Text style={styles.totalPriceTitle}>Ver desglose de precios</Text>
                                <Text style={styles.totalPrice}>US$ {priceToFixed(price?.total)}</Text>
                                <View style={globalStyles.arrowRight}/>
                            </View>
                        </TouchableOpacity>
                        <ViewCollapsable collapsed={!seePriceBreakDown}>
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>Distancia</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.distance)}</Text>
                            </View>
                            <View style={styles.priceItemSpacer}/>
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>Tipo de vehiculo</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.vehicleType)}</Text>
                            </View>
                            <View style={styles.priceItemSpacer}/>
                            <View style={styles.priceItem}>
                                <Text style={styles.priceItemTitle}>Impuesto</Text>
                                <Text style={styles.priceItemValue}>US$ {priceToFixed(price?.tax)}</Text>
                            </View>
                        </ViewCollapsable>
                    </>}
                </View>
                <View>
                    {!!error && <View style={globalStyles.inputWrapper}>
                        <AlertBootstrap type='danger' message={error} onClose={() => setError('')} />
                    </View>}
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const mapStateToProps = state => {
    let {orders, ordersLoaded, ordersLoading} = state.app;
    return {orders, ordersLoaded, ordersLoading}
}

const mapDispatchToProps = dispatch => {
    return {
        loadOrdersList: () => dispatch(loadOrdersListAction()),
        reduxUpdateOrder: (orderId, update) => dispatch(updateOrderAction(orderId, update)),
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    flexRow:{
        flex: 1,
        flexDirection: 'row'
    },
    h1: {
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 24,
    },
    vehicleTypeBtn:{
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
    pikAccountAlert:{
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    totalPriceTitle:{
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
    priceItem:{
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 16,
    },
    priceItemSpacer:{
        height: 1,
        backgroundColor: '#ddd',
    },
    priceItemTitle:{
        flexGrow: 1,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    priceItemValue:{
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
    packagePhoto:{
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

export default connect(mapStateToProps, mapDispatchToProps)(TravelEditPackageScreen);

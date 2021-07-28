import React, {useState, useMemo} from 'react';
import {connect} from 'react-redux';
import moment from 'moment'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import {
    loadOrdersList as loadOrdersListAction,
} from '../../../redux/actions/appActions';
import {
    getOrdersGroupedByDate as getOrdersGroupedByDateSelector
} from '../../../redux/selectors/index';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
} from '../../../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useTranslation } from 'react-i18next';

const OrderItem = ({order}) => {
    let { t } = useTranslation();

    const statusTitle = useMemo(() => {
        let map = {
            "Created": "Pending",
            "Scheduled": "Pending",
            "Pending": "Pending",
            "Progress": "In Progress",
            "Reschedule": "Reschedule",
            "Canceled": "Canceled",
            "Returned": "Returned",
            "Delivered": "Completed",
        }
        return map[order?.status] || order?.status || 'Unknown';
    }, [order])
    return (
        <View style={styles.orderItem}>
            <View style={styles.row}>
                <Text style={styles.orderItemTitle}>{t('pages.about_pik.id')}: {order.id}</Text>
                {!!order.cost && <Text style={styles.orderItemCost}>${order.cost?.total}</Text>}
            </View>
            <View style={styles.row}>
                <Text style={styles.orderItemDescription}>
                    <Text>{(order.isRequest || order.senderModel==='business') ? t('pages.about_pik.from') + ' ' + order.sender?.name : t('pages.about_pik.to') + ' ' + order.receiver?.name}</Text>
                    {/*<FontAwesome5 name="clock"/>*/}
                    {/*<Text> {moment(order.createdAt).format("h:mma")}     </Text>*/}
                    {/*<FontAwesome5 name="map-marker-alt"/>*/}
                    {/*<Text> {order.direction.routes[0].legs[0].distance.text}</Text>*/}
                </Text>
                <Text style={[styles.orderItemStatus, styles[`statusColor${statusTitle}`]]}>{t(('pages.travel.status.' + statusTitle).replace(/\s/g, ''))}</Text>
            </View>
        </View>
    )
}

const AccountSelectOrderScreen = ({navigation, route, ordersList, ...props}) => {
    let { t } = useTranslation();

    let [refreshing, setRefreshing] = useState(false)
    let onSelect = route.params?.onSelect;
    let pageTitle = route.params?.title;

    React.useEffect(() => {
        if(!props.ordersLoading)
            props.loadOrdersList();
    }, [])

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await props.loadOrdersList()
        setRefreshing(false);
    }, []);

    return (
        <KeyboardAvoidingScreen >
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={pageTitle || t('pages.travel.tabs.travels')}
                    color={HeaderPage.Colors.BLACK}
                />}
                contentStyle={{paddingTop: 0}}
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                {Object.keys(ordersList.days).map((day, i) => (
                    <View key={day}>
                        <Text style={[styles.dayTitle, i==0?{paddingTop: 24}:{}]}>{ordersList.days[day].title}</Text>
                        {ordersList.days[day].orders.map(order => (
                            <TouchableOpacity onPress={() => (onSelect && onSelect(order))}>
                                <OrderItem order={order} key={order._id} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dayTitle: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#E5E5E5',
        marginHorizontal: -16,
        padding: 16
    },
    orderItem: {
        paddingVertical: 16,
    },
    orderItemTitle: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
    },
    orderItemCost: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 24,
    },
    orderItemDescription: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    orderItemStatus: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_TERTIARY_HYPERLINK,
    },
    "statusColorCompleted":{color: COLOR_TERTIARY_SUCCESS},
    "statusColorCanceled":{color: COLOR_TERTIARY_ERROR},
    "statusColorReturned":{color: COLOR_TERTIARY_ERROR},
})

const mapStateToProps = state => ({
    ordersList: getOrdersGroupedByDateSelector(state)
})

const mapDispatchToProps = dispatch => ({
    loadOrdersList: () => dispatch(loadOrdersListAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelectOrderScreen);

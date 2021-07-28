import React, { useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/es';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import globalStyles from '../../../utils/globalStyles';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, COLOR_TERTIARY_ERROR, COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS, GRADIENT_2,
} from '../../../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Avatar from '../../../components/Avatar';
import GradientButton from '../../../components/GradientButton';
import { connect } from 'react-redux';
import { compose } from 'redux'
import {
    loadOrdersList as loadOrdersListAction,
    setTabBarVisible as setTabBarVisibleAction,
} from '../../../redux/actions';
import OrderStatuses from '../../../../../node-back/src/constants/OrderStatuses'
import withAuth from '../../../redux/connectors/withAuth';
import { isAvailableOrder, uploadUrl } from '../../../utils/helpers';

import { useTranslation } from 'react-i18next';

const Header = ({ active, onTabSwitch }) => {
    let { t } = useTranslation();

    const tabs = [t('pages.travel.tabs.travels'), t('pages.travel.tabs.started_by_me'), t('pages.travel.tabs.started_by_other')]
    return (
        <View style={{ flexDirection: 'row', paddingTop: 25 }}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} style={{ width: '33%' }} onPress={() => onTabSwitch(index)}>
                    <Text style={[styles.tabItem, active === index ? styles.tabItemActive : null]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const OrderItem = ({ navigation, order, user }) => {
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

    const orderTitle = useMemo(() => {
        // package is form me
        if (order.receiver._id === user._id) {
            switch (order.status) {
                case 'Created':
                case 'Scheduled':
                case 'Pending':
                case 'Progress':
                case 'Delivered': return "Pickup From";
                case 'Canceled': return "Delivered To";
                case 'Returned': return "Returned To";
                case 'Reschedule': return "Package From";

            }
        }
        // i send the package
        else {
            switch (order.status) {
                case 'Created':
                case 'Scheduled':
                case 'Pending':
                case 'Progress': return "Sending To";
                case 'Delivered': return "Delivered To";
                case 'Canceled': return "Delivered To";
                case 'Returned': return "Returned To";
                case 'Reschedule': return "Package To";

            }
        }
    }, [order])

    const orderAddress = useMemo(() => {
        let defaultAddress = order.receiver.mobile
        // package is form me
        if (order.receiver._id === user._id) {
            return order?.pickup?.address?.formatted_address || order.sender.mobile;
        }
        // i send the package
        else {
            switch (order.status) {
                case 'Created':
                case 'Scheduled':
                case 'Pending':
                case 'Progress': return order?.delivery?.address?.formatted_address || defaultAddress;
                case 'Delivered': return order?.delivery?.address?.formatted_address;
                case 'Canceled': return order?.pickup?.address?.formatted_address;
                case 'Returned': return order?.pickup?.address?.formatted_address;
                case 'Reschedule': return order?.pickup?.address?.formatted_address;

            }
        }
    }, [order])

    const getSpanishDate = (date) => {
        let localDate = moment(date);
        moment.locale('es');
        return localDate.format('D MMMM');
    }

    return (
        <View style={styles.orderContainer}>
            <Text style={styles.orderTitle}>{t('pages.travel.' + orderTitle.replace(/\s/g, ''))}</Text>
            <View style={[globalStyles.flexRowCenter, { justifyContent: 'space-between' }]}>
                <Text style={styles.orderAddress} numberOfLines={1}>{orderAddress}</Text>
                {order.cost && <Text style={styles.orderPrice}> US$ {order.cost.total.toFixed(2)}</Text>}
            </View>
            <View style={globalStyles.flexRowCenter}>
                <Text style={styles.orderTime}>
                    <FontAwesome5 name="clock" />
                    <Text> {moment(order.createdAt).format("h:mma")}   </Text>
                    <FontAwesome5 name="calendar" />
                    <Text> {getSpanishDate(order.createdAt)}</Text>
                </Text>
                <Text style={[styles.orderStatus, styles[statusTitle]]}>{t(('pages.travel.status.' + statusTitle).replace(/\s/g, ''))}</Text>
            </View>
            {order.status === 'Progress' && (
                <View style={[globalStyles.flexRowCenter, { paddingTop: 16 }]}>
                    <Avatar
                        source={{ uri: uploadUrl(order.driver.avatar) }}
                        size={32}
                        border={0}
                        style={{ marginRight: 8 }}
                    />
                    <View style={{ flexGrow: 1 }}>
                        <Text style={styles.orderDriverName}>
                            {`${order.driver.firstName} ${order.driver.lastName}`}
                        </Text>
                        <Text style={styles.orderDriverTitle}>{t('pages.travel.vehicle.' + order.vehicleType)}</Text>
                    </View>
                    <GradientButton
                        onPress={() => navigation.navigate("MainTravelOrderTracking", { order })}
                        style={{ height: 32, paddingHorizontal: 24 }}
                        titleStyle={{ fontSize: 12 }}
                        title={t('pages.travel.live_tracking')}
                        gradient={GRADIENT_2}
                    />
                </View>
            )}
        </View>
    )
}

const TravelsHomeScreen = ({ navigation, setTabBarVisible, authUser, ...props }) => {
    let { t } = useTranslation();

    const [refreshing, setRefreshing] = React.useState(false);
    let [activeTab, setActiveTab] = useState(0);
    let { orders, ordersLoaded, ordersLoading, loadOrdersList } = props;

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadOrdersList()
        setRefreshing(false);
    }, []);

    React.useEffect(() => {
        if (!authUser?.loggedIn)
            return
        if (!ordersLoading)
            loadOrdersList();
    }, [authUser])

    let filteredOrder = useMemo(() => {
        let user = authUser;
        return orders.filter(o => {
            if (o.status == 'Canceled' && o.senderModel == 'business') return false;
            if (isAvailableOrder(o, user))
                return false
            if (activeTab === 0)
                return true;
            if (activeTab === 1)
                return (!o.isRequest && (o.sender._id === user._id || o.sender === user._id))
                    || (o.isRequest && (o.receiver._id === user._id || o.receiver === user._id))
            return (!o.isRequest && (o.receiver._id === user._id || o.receiver === user._id))
                || (o.isRequest && (o.sender._id === user._id || o.sender === user._id))
        })
            .sort((a, b) => (b.createdAt < a.createdAt ? -1 : (b.createdAt > a.createdAt ? 1 : 0)))
    }, [authUser, activeTab, orders])

    // useFocusEffect(() => {
    //     setTabBarVisible(true)
    //     return () => {
    //         setTabBarVisible(false)
    //     }
    // }, [])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                refreshing={refreshing} onRefresh={onRefresh}
                Header={<Header active={activeTab} onTabSwitch={setActiveTab} />}
                contentWrapperStyle={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}
            >

                {(ordersLoading && !refreshing) && <ActivityIndicator size="large" color={COLOR_PRIMARY_500} />}

                {orders.length === 0 && <Text>{t('pages.travel.no_order')}</Text>}

                {filteredOrder.map((order, index) => {
                    if (order.sender != null && order.receiver != null) {
                        return (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('MainTravelOrderDetail', { orderId: order._id })}>
                                <OrderItem navigation={navigation} order={order} user={authUser} />
                            </TouchableOpacity>
                        );
                    }
                    else {
                        console.log("order sender or receiver has null==============");
                    }
                })}

            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    tabItem: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'center',
        paddingBottom: 8,
        color: COLOR_NEUTRAL_GRAY,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemActive: {
        color: 'white',
        borderBottomColor: 'white',
    },
    orderContainer: {
        paddingVertical: 16,
    },
    orderTitle: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        textTransform: 'uppercase',
    },
    orderAddress: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        paddingRight: 16,
        maxWidth: '70%',
        textAlign: 'left',
    },
    orderPrice: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
    },
    orderTime: {
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        flexGrow: 1,
    },
    orderStatus: {
        fontWeight: '500',
        fontSize: 13,
        lineHeight: 16,
        color: COLOR_PRIMARY_500,
    },
    orderDriverName: {
        fontWeight: '500',
        fontSize: 13,
        lineHeight: 16,
    },
    orderDriverTitle: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    'Completed': {
        color: COLOR_TERTIARY_SUCCESS,
    },
    'Pending': {
        color: COLOR_TERTIARY_HYPERLINK,
    },
    'Canceled': {
        color: COLOR_TERTIARY_ERROR,
    },
    'Returned': {
        color: COLOR_NEUTRAL_GRAY,
    },
    'In Progress': {
        color: COLOR_PRIMARY_500,
    },
    'Reschedule': {
        color: COLOR_TERTIARY_HYPERLINK,
    },
});

const mapStateToProps = state => {
    let { orders, ordersLoaded, ordersLoading } = state.app;
    return { orders, ordersLoaded, ordersLoading }
}

const mapDispatchToProps = dispatch => ({
    setTabBarVisible: visible => dispatch(setTabBarVisibleAction(visible)),
    loadOrdersList: () => dispatch(loadOrdersListAction())
})

const enhance = compose(
    withAuth,
    connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TravelsHomeScreen);

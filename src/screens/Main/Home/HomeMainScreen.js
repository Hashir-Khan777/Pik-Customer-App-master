import React, {useState, useEffect, useMemo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderHome from '../../../components/HeaderHome';
import BannerView from '../../../components/BannerView';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import BoxShadow from '../../../components/BoxShadow';
import AvailableOrderItem from '../../../components/AvailableOrderItem';
import {
    loadOrdersList as loadOrdersListAction,
    setTabBarVisible as setTabBarVisibleAction,
} from '../../../redux/actions';
import {
    getAvailables as getAvailablesSelector,
    getFeedbackList as getFeedbackListSelector,
} from '../../../redux/selectors';
import {connect} from 'react-redux';
import globalStyles from '../../../utils/globalStyles';
import {COLOR_NEUTRAL_GRAY} from '../../../utils/constants';
import FeedbackModal from '../../../components/FeedbackModal';
import Api from '../../../utils/api';

import { useTranslation } from 'react-i18next';

const HomeMainScreen = ({navigation, setTabBarVisible, ...props}) => {
    let { t } = useTranslation();

    let {authUser, orders, ordersLoaded, ordersLoading, loadOrdersList, availableOrders} = props;
    const [collapsed, setCollapsed] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadOrdersList()
        setRefreshing(false);
    }, []);

    useEffect(() => {
        if(!ordersLoading)
            loadOrdersList();
    }, [authUser])

    const computed = useMemo(() => {
        let pendingOrders = orders.filter(({isRequest, sender, receiver, senderModel, status, delivery}) => {
            return senderModel === 'customer'
                && status === 'Created' &&
                (
                    (!isRequest && receiver._id === authUser._id && !delivery?.address)
                    || (isRequest && sender._id === authUser._id)
                )
        });
        return {
            pendingOrders,
        }
    },[JSON.stringify(orders)])

    const navigateToPendingPackage = async (orderId) => {
        navigation.navigate("MainHomePendingPackage",{orderId})
    }

    const navigateToGetPackage = async (orderId) => {
        navigation.navigate("MainHomeGetPackage",{orderId})
    }

    const navigateToCancelPackage = async (orderId) => {
        console.log("cancel order id - ", orderId);

        Api.Customer.cancelOrder(orderId)
            .then((response) => {
                console.log(response);
                loadOrdersList();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // useFocusEffect(() => {
    //     setTabBarVisible(true)
    //     return () => {
    //         setTabBarVisible(false)
    //     }
    // }, [])

    return (

        <KeyboardAvoidingScreen>
            <PageContainerDark refreshing={refreshing} onRefresh={onRefresh}
                Header={<HeaderHome />}
            >
                <BoxShadow opacity={0.4}>
                    <BannerView/>
                </BoxShadow>
                <Text style={styles.headline}>{t('pages.mainHome.actions')}</Text>

                <View>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity onPress={() => navigation.navigate('MainHomeSendPackage')} style={{flexGrow: 1}}>
                            <BoxShadow>
                                    <View style={styles.actionBox}>
                                        <SvgXml width={44} height={44} xml={svgs['icon-package-closed']}/>
                                        <Text style={styles.actionTitle}>{t('pages.mainHome.send_package')} </Text>
                                    </View>
                            </BoxShadow>
                        </TouchableOpacity>
                        <View style={{width: 16}}/>
                        <TouchableOpacity onPress={() => navigation.navigate('MainHomeRequestPackage')} style={{flexGrow: 1}}>
                            <BoxShadow>
                                <View style={styles.actionBox}>
                                    <SvgXml width={44} height={44} xml={svgs['icon-package-open']}/>
                                    <Text style={styles.actionTitle}>{t('pages.mainHome.request_package')}</Text>
                                </View>
                            </BoxShadow>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ===== Pending Orders ===== */}
                {computed.pendingOrders.length > 0 && (
                    <>
                        <Text style={styles.headline}>{t('pages.mainHome.pending')}</Text>
                        {computed.pendingOrders.map(order => (
                            <View key={order._id} style={globalStyles.inputWrapper}>
                                <AvailableOrderItem
                                    order={order}
                                    onGetPackages={() => navigateToPendingPackage(order._id)}
                                    // onCancelPackages={() => navigateToCancelPackage(order._id)}
                                />
                            </View>
                        ))}
                    </>
                )}

                {/* ===== Available Orders ===== */}
                <View style={globalStyles.flexRowCenter}>
                    <Text style={[styles.headline, {flexGrow: 1}]}>{t('pages.mainHome.available')}</Text>
                    <Text style={styles.headline}>{availableOrders.count} {t('pages.mainHome.packages')}</Text>
                </View>
                {availableOrders.count>0 ? (
                    availableOrders.list.map(order => (
                        <View key={order._id} style={globalStyles.inputWrapper}>
                            <AvailableOrderItem
                                order={order}
                                onGetPackages={() => navigateToGetPackage(order._id)}
                                onCancelPackages={() => navigateToCancelPackage(order._id)}
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.noPackage}>{t('pages.mainHome.no_package')}</Text>
                )}
                {props.feedbackList.length > 0 && (
                    <FeedbackModal
                        order={props.feedbackList[0]}
                    />
                )}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    headline: {
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24,
        marginTop: 24,
        marginBottom: 16,
    },
    actionsRow: {
        flex: 1,
        flexDirection: 'row',
    },
    actionBox: {
        flexGrow: 1,
        // flexShrink: 1,
        padding: 16,
        // borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    actionTitle: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
    },
    noPackage:{
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
        textAlign: 'center',
    }
});

const mapStateToProps = state => {
    let {orders, ordersLoaded, ordersLoading} = state.app;
    let {user} = state.auth
    return {
        authUser: user,
        orders,
        ordersLoaded,
        ordersLoading,
        availableOrders: getAvailablesSelector(state),
        feedbackList: getFeedbackListSelector(state),
    }
}

const mapDispatchToProps = dispatch => ({
    setTabBarVisible: visible => dispatch(setTabBarVisibleAction(visible)),
    loadOrdersList: () => dispatch(loadOrdersListAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeMainScreen);

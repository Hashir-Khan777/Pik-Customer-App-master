import React, { useEffect, useState, useMemo } from 'react';
import {
    StyleSheet,
    Animated,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import Avatar from './Avatar';
import { COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900 } from '../utils/constants';
import BoxShadow from './BoxShadow';
import { SvgXml } from 'react-native-svg';
import svgs from '../utils/svgs';
import PrimaryButton from './ButtonPrimary';
import ViewCollapsable from './ViewCollapsable';
import globalStyles from '../utils/globalStyles';
import BaseModal from './BaseModal';
import ButtonSecondary from './ButtonSecondary';

import { useTranslation } from 'react-i18next';

const AvailableOrderItem = ({ style, order, onGetPackages, onCancelPackages }) => {
    let { t } = useTranslation();

    const [collapsed, setCollapsed] = useState(true);
    const [cancelOrder, setCancelOrder] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);

    let computed = useMemo(() => {
        let { isRequest, sender, receiver, senderModel } = order;
        let isAvailable = senderModel === 'business';
        let owner = isAvailable ? sender : (isRequest ? receiver : sender)
        let address = isRequest ? order.delivery?.address?.formatted_address : order.pickup?.address?.formatted_address;
        let requestType = '';
        if (!isAvailable) {
            requestType = isRequest ? t('pages.mainHome.send_request') : t('pages.mainHome.address_request')
        }
        return {
            isAvailable,
            isRequest,
            owner,
            address,
            requestType,
        }
    }, [order])

    const onUserClick = () => {
        if (computed.isAvailable)
            toggleCollapse()
        else
            onGetPackages && onGetPackages()
    }

    const onCancelClick = () => {
        setCancelOrder(true);
    }

    const onOkHandle = () => {
        setCancelOrder(false);
        onCancelPackages && onCancelPackages();
    }

    const onCancelHandle = () => {
        setCancelOrder(false);
    }

    return (
        <BoxShadow>
            <View style={{ ...style, ...styles.container }}>
                <TouchableOpacity onPress={onUserClick}>
                    <View>
                        <View style={styles.userInfoContainer}>
                            <Avatar
                                source={{ uri: (computed.owner.logo || computed.owner.avatar) }}
                                border={1}
                                style={styles.avatar}
                                size={32}
                            />
                            <View style={{ flexGrow: 1 }}>
                                <View style={[globalStyles.flexRowCenter, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.name}>{computed.owner.name}</Text>
                                    <Text style={styles.pendingTitle}>{computed.isAvailable ? '' : (computed.isRequest ? t('pages.mainHome.send_request') : t('pages.mainHome.address_request'))}</Text>
                                </View>
                                <View style={globalStyles.flexRow}>
                                    <View style={globalStyles.flexColumn}>
                                        <Text
                                            style={styles.description}
                                            numberOfLines={1}
                                        >
                                            {computed.isAvailable ? `${order?.packages?.length} ${t('pages.mainHome.packages')}` : computed.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {computed.isAvailable && <View style={styles.icon} />}
                        </View>
                    </View>
                </TouchableOpacity>
                {computed.isAvailable && (
                    <ViewCollapsable collapsed={collapsed}>
                        <View style={{ padding: 16, paddingBottom: 24 }}>
                            {order.packages.map((item, index) => (
                                <View key={index}>
                                    <View style={{ height: 24, marginBottom: 8 }}>
                                        <View style={styles.flexRow}>
                                            <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-document']} />
                                            <Text style={styles.itemName}>{item.description}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 24, marginBottom: 24 }}>
                                        <View style={styles.flexRow}>
                                            <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-barcode']} />
                                            <Text style={styles.itemBarcode}>{item.trackingCode}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            <PrimaryButton title={t('pages.mainHome.get_packages')} onPress={onGetPackages} />
                            <TouchableOpacity onPress={onCancelClick} style={styles.cancelOrder}>
                                <Text style={styles.cancelOrderText}>{t('pages.mainHome.cancel_order')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ViewCollapsable>
                )}
                {cancelOrder && (
                    <BaseModal
                        // visible={visible}
                        style={{ minWidth: 320 }}
                    >
                        <Text style={{fontSize: 17, padding: 10}}>{t('pages.mainHome.ru_cancel_order')}</Text>
                        <View style={styles.cancelOrderButtonContainer}>
                            <PrimaryButton style={{ width: 120, height: 35 }} onPress={onOkHandle} title={t('general.yes')} />
                            <ButtonSecondary style={{ width: 120, height: 35 }} onPress={onCancelHandle}  title={t('general.no')} />
                        </View>

                    </BaseModal>
                )}
            </View>
        </BoxShadow>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    userInfoContainer: {
        position: 'relative',
        paddingVertical: 20,
        paddingHorizontal: 16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 10,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    pendingTitle: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    icon: {
        flexGrow: 0,
        width: 0,
        height: 0,
        marginTop: 8,
        borderWidth: 8,
        borderTopColor: COLOR_PRIMARY_900,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
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
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelOrder: {
        marginTop: 10
    },
    cancelOrderText: {
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    cancelOrderButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    }
});

export default AvailableOrderItem;

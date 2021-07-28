import React, { useState, useMemo, useEffect } from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text
} from 'react-native'
import MapView from 'react-native-maps';
import BottomDrawer from '../../../components/BottomDrawer';
import ViewCollapsable from '../../../components/ViewCollapsable';
import UserInfo from '../../../components/UserInfo';
import globalStyles from '../../../utils/globalStyles';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import DriverInfo from '../../../components/DriverInfo';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
} from '../../../utils/constants';
import decodePolyline from '../../../utils/decodePolyline'
import { callPhoneNumber, uploadUrl } from '../../../utils/helpers';
import Api from '../../../utils/api';
import DriverMapMarker from '../../../components/DriverMapMarker';
import BoxShadow from '../../../components/BoxShadow';
import CircleProgress from '../../../components/CircleProgress';
import moment from 'moment';
import TextSingleLine from '../../../components/TextSingleLine';
import MapTooltip from '../../../components/MapTooltip';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import HeaderPage from '../../../components/HeaderPage';
import PageContainerDark from '../../../components/PageContainerDark';
import OrderChat from '../../../components/OrderChat';
import withAuth from '../../../redux/connectors/withAuth';
import MapAvatar from '../../../components/MapAvatar';
import MapCenterButton from '../../../components/MapCenterButton';

import { useTranslation } from 'react-i18next';

const TravelOrderTrackingScreen = ({ navigation, route, authUser }) => {
    let { t } = useTranslation();

    const [mapView, setMapView] = useState(null)
    const [subMenuCollapsed, setSubMenuCollapsed] = useState(true)
    const [driverLocation, setDriverLocation] = useState(null)

    const { order } = route.params

    let { northeast: ne, southwest: sw } = order.direction.routes[0].bounds;
    let directionRegion = {
        latitude: (ne.lat + sw.lat) / 2,
        longitude: (ne.lng + sw.lng) / 2,
        latitudeDelta: Math.abs(ne.lat - sw.lat) * 1.5,
        longitudeDelta: Math.abs(ne.lng - sw.lng) * 1.5,
    }
    let [region, setRegion] = useState(directionRegion)

    let trackRegion = useMemo(() => {
        let { northeast, southwest } = order.direction.routes[0].bounds;
        let lats = [northeast.lat, southwest.lat]
        let lngs = [northeast.lng, southwest.lng]
        console.log({ driverLocation })
        if (!!driverLocation) {
            lats.push(driverLocation.coords.latitude)
            lngs.push(driverLocation.coords.longitude)
        }
        const min = arr => arr.reduce((acc, val) => Math.min(acc, val), arr[0])
        const max = arr => arr.reduce((acc, val) => Math.max(acc, val), arr[0])
        return {
            latitude: (min(lats) + max(lats)) / 2,
            longitude: (min(lngs) + max(lngs)) / 2,
            latitudeDelta: Math.abs(min(lats) - max(lats)) * 1.5,
            longitudeDelta: Math.abs(min(lngs) - max(lngs)) * 1.5,
        }
    }, [order, driverLocation])

    let orderPolyline = useMemo(() => {
        if (!order?.direction?.routes)
            return null
        return decodePolyline(order.direction.routes[0].overview_polyline.points)
    }, [order]);

    const updateDriverLocation = () => {
        Api.Customer.getOrderDriverLocation(order._id)
            .then(data => {
                console.log(data)
                setDriverLocation(data.geoLocation)
            })
    }

    useEffect(() => {
        updateDriverLocation()
        const interval = setInterval(() => {
            updateDriverLocation()
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const moveToMyLocation = () => {
        if (!mapView || !orderPolyline)
            return;

        let userRegion = {
            latitude: order.direction.routes[0].legs[0].end_location.lat,
            longitude: order.direction.routes[0].legs[0].end_location.lng,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
        }
        setRegion(userRegion)

        mapView.animateToRegion(userRegion, 200);
    }
    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                noScroll
                contentStyle={{ padding: 0 }}
                Header={<HeaderPage title={t('pages.travel.carrier_delivering')} />}
            >
                {/*<View styles={styles.container}>*/}
                <MapView
                    ref={setMapView}
                    style={styles.map}
                    // initialRegion={region}
                    region={trackRegion}
                // showsUserLocation={true}
                >
                    {!!driverLocation && <>
                        {/*<MapView.Marker*/}
                        {/*    coordinate={{*/}
                        {/*        latitude: driverLocation.coords.latitude,*/}
                        {/*        longitude: driverLocation.coords.longitude,*/}
                        {/*    }}*/}
                        {/*    anchor={{ x: 0.5, y: 0.5 }}*/}
                        {/*>*/}
                        {/*    <SvgXml size={32} xml={svgs['map-marker-current-location']} />*/}
                        {/*</MapView.Marker>*/}
                        <MapAvatar
                            coordinate={{
                                latitude: driverLocation.coords.latitude,
                                longitude: driverLocation.coords.longitude,
                            }}
                            sender={order.sender}
                        />
                    </>}
                    {!!orderPolyline && <>
                        <MapView.Polyline
                            coordinates={orderPolyline}
                            strokeWidth={4}
                        // strokeColor={COLOR_PRIMARY_600}
                        />
                        <MapTooltip
                            coordinate={{
                                latitude: order.direction.routes[0].legs[0].start_location.lat,
                                longitude: order.direction.routes[0].legs[0].start_location.lng,
                            }}
                        >
                            <FontAwesome5 name="shopping-bag" />
                            <Text> Recogida</Text>
                        </MapTooltip>
                        <MapTooltip
                            coordinate={{
                                latitude: order.direction.routes[0].legs[0].end_location.lat,
                                longitude: order.direction.routes[0].legs[0].end_location.lng,
                            }}
                        >
                            {t('pages.travel.delivery')} - {order.direction.routes[0].legs[0].duration.text}
                        </MapTooltip>
                    </>}
                </MapView>

                <BoxShadow style={styles.topAbsolute}>
                    <View style={styles.topBox}>
                        <View style={[styles.progressContainer, { marginBottom: 16 }]}>
                            <CircleProgress n={1} completed={!!order.time.pickupComplete} style={{ marginRight: 16 }} />
                            <View style={{ flexGrow: 1 }}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.progressTitle1}>
                                        <Text>Recogida  </Text>
                                        {!!order.time.pickupComplete ? (
                                            <Text style={{ color: COLOR_TERTIARY_SUCCESS }}>Completado</Text>
                                        ) : (
                                            <Text style={{ color: COLOR_PRIMARY_500 }}>en progreso</Text>
                                        )}
                                    </Text>
                                </View>
                                <TextSingleLine>{order.pickup.address.formatted_address}</TextSingleLine>
                            </View>
                        </View>
                        <View style={styles.progressContainer}>
                            <CircleProgress n={2} completed={!!order.time.deliveryComplete} style={{ marginRight: 16 }} />
                            <View style={{ flexGrow: 1 }}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.progressTitle1}>
                                        <Text>{t('pages.travel.delivery')}  </Text>
                                        {!!order.time.deliveryComplete ? (
                                            <Text style={{ color: COLOR_TERTIARY_SUCCESS }}>Completado</Text>
                                        ) : (
                                            <Text style={{ color: COLOR_PRIMARY_500 }}>en progreso</Text>
                                        )}
                                    </Text>
                                </View>
                                <TextSingleLine>{order?.delivery?.address?.formatted_address}</TextSingleLine>
                            </View>
                        </View>
                    </View>
                </BoxShadow>

                <View style={{ marginLeft: 'auto', position: 'absolute', bottom: 100, right: 10 }}>
                    <MapCenterButton
                        status={'on'}
                        onPress={moveToMyLocation}
                    />
                </View>

                <BottomDrawer onPress={() => setSubMenuCollapsed(!subMenuCollapsed)}>
                    <View style={{ paddingVertical: 16 }}>
                        <View style={globalStyles.flexRowCenter}>
                            <DriverInfo
                                driver={order.driver}
                            />
                            <View style={{ flexGrow: 1 }} />
                            <TouchableOpacity onPress={() => callPhoneNumber(order.driver.mobile)}>
                                <SvgXml style={{ marginLeft: 28 }} width={28} xml={svgs['icon-phone']} />
                            </TouchableOpacity>
                            <OrderChat
                                style={{ marginLeft: 28 }}
                                order={order}
                                driver={order.driver}
                                cuatomer={authUser}
                            />
                        </View>
                    </View>
                    <ViewCollapsable collapsed={subMenuCollapsed}>
                        <View style={{ flexDirection: 'row', paddingVertical: 16 }}>
                            <View style={styles.carInfoBox}>
                                <Text style={styles.carInfoH1}>{t('vehicle_info.make_modal')}</Text>
                                <Text style={styles.carInfoDescription}>{order.driver.vehicle.makeModel}</Text>

                                <Text style={styles.carInfoH1}>{t('vehicle_info.plate')}</Text>
                                <Text style={styles.carInfoDescription}>{order.driver.vehicle.plate}</Text>

                                <Text style={styles.carInfoH1}>{t('vehicle_info.color')}</Text>
                                <Text style={styles.carInfoDescription}>{order.driver.vehicle.color}</Text>
                            </View>
                            <View style={styles.imageBox}>
                                <Image
                                    source={{ uri: uploadUrl(order.driver.vehicle.photos[0]) }}
                                    style={styles.vehiclePhoto}
                                />
                            </View>
                        </View>
                    </ViewCollapsable>
                </BottomDrawer>
                {/*</View>*/}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    )
}

const styles = StyleSheet.create({
    topAbsolute: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
    },
    topBox: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    carInfoBox: {
        width: '50%',
    },
    carInfoH1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY
    },
    carInfoDescription: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 24,
        marginBottom: 8,
    },
    imageBox: {
        width: '50%',
    },
    vehiclePhoto: {
        width: '100%',
        minHeight: 130,
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
})

export default withAuth(TravelOrderTrackingScreen);

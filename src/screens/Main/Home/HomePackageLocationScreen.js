import React, {useState, useEffect, useMemo} from 'react'
import Geolocation from '@react-native-community/geolocation';
import {
    StyleSheet,
    Alert,
    View,
    Text
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import PageContainerDark from '../../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import HeaderBase from '../../../components/HeaderBase';
import CustomTextInput from '../../../components/CustomTextInput';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import useComponentSize from '../../../utils/useComponentSize';
import PrimaryButton from '../../../components/ButtonPrimary';
import {COLOR_NEUTRAL_GRAY} from '../../../utils/constants';

import {connect} from 'react-redux'
import {
    loadRecentAddresses as loadRecentAddressesList,
    loadSavedAddresses as loadSavedAddressesAction,
    setRecentAddresses as setRecentAddressesAction,
} from '../../../redux/actions/appActions';
import GoogleApi from '../../../utils/googleApi';
import MapCenterButton from '../../../components/MapCenterButton';

import { useTranslation } from 'react-i18next';

const HomePackageLocationScreen = ({navigation, route, type, recentAddresses, /**selectedAddress,*/ ...props}) => {
    let { t } = useTranslation();

    const {currentLocation, locationAvailable} = props

    const [markerSize, onMarkerLayout] = useComponentSize();
    const { setLocation, address: defaultAddress } = route.params;
    const [inProgress, setInProgress] = useState(false)

    const [mapView, setMapView] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState(defaultAddress || null)
    const [mapCenterAddress, setMapCenterAddress] = useState(null);

    let [region, setRegion] = useState({
        latitude: defaultAddress ? parseFloat(defaultAddress.geometry.location.lat) : 8.985936,
        longitude: defaultAddress ? parseFloat(defaultAddress.geometry.location.lng) : -79.518217,
        latitudeDelta: defaultAddress ? 0.008 : 0.5,
        longitudeDelta: defaultAddress ? 0.008 : 0.5,
        // latitudeDelta: 0.922,
        // longitudeDelta: 0.421,
    })

    const selectLocation = () => {
        setInProgress(true)
        Promise.resolve(true)
            .then(() => {
                // if(selectedAddress)
                //     return selectedAddress
                // else
                    return GoogleApi.geocoding([region.latitude, region.longitude])
                        .then(({results}) => {
                            let address = results[0];
                            return {
                                ...address,
                                geometry: {
                                    ...address.geometry,
                                    location: {
                                        lat: region.latitude,
                                        lng: region.longitude
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            console.error(error)
                            return {
                                formatted_address: `${region.latitude},${region.longitude}`,
                                geometry: {
                                    location: {
                                        lat: region.latitude,
                                        lng: region.longitude,
                                    }
                                }
                            }
                        })
            })
            .then(address => {
                if(!address){
                    Alert.alert("Sorry", 'Corresponding address not found')
                    return;
                }

                let newRecentAddresses = recentAddresses.filter(a => a.place_id !== address.place_id)
                props.setRecentAddresses([address, ...newRecentAddresses].slice(0, 5))

                setLocation(address);
                navigation.goBack();
            })
            .catch(error => {})
            .then(() => {
                setInProgress(false)
            })
    }

    useEffect(() => {
        if(selectedAddress || !mapView)
            return
        Geolocation.getCurrentPosition(info => {
            console.log('user current location', info)
            let userRegion = {
                latitude: info?.coords?.latitude,
                longitude: info?.coords?.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            }
            setRegion(userRegion)

            mapView.animateToRegion(userRegion, 100);
        })
    }, [mapView])

    useEffect(() => {
        props.loadRecentAddresses();
        props.loadSavedAddresses();
        console.log('loading recent addresses')
    }, [props.loadRecentAddresses])

    useEffect(() => {
        if(!mapView)
            return

        if(selectedAddress){
            mapView.animateToRegion({
                latitude: selectedAddress.geometry.location.lat,
                longitude: selectedAddress.geometry.location.lng,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            }, 100);
        }
    }, [mapView, selectedAddress])

    useEffect(() => {
        if(!mapView){
            setMapCenterAddress(null)
        }else{
            console.log('selectedAddress.geometry.location.lat:',selectedAddress.geometry.location.lat)
            console.log('Oops!',region)
            GoogleApi.geocoding([region.latitude, region.longitude])
                .then(({results}) => {
                    let address = results[0];
                    return {
                        ...address,
                        geometry: {
                            ...address.geometry,
                            location: {
                                lat: region.latitude,
                                lng: region.longitude
                            }
                        }
                    }
                })
                .catch(error => {
                    return {
                        formatted_address: `${region.latitude},${region.longitude}`,
                        geometry: {
                            location: {
                                lat: region.latitude,
                                lng: region.longitude,
                            }
                        }
                    }
                })
                .then(address =>{
                   
                    setMapCenterAddress(address)})
        }
    }, [mapView, selectedAddress, region])

    const moveToMyLocation = () => {
        if(!locationAvailable){
            Alert.alert(t("general.Attention"), t('general.your_gps_off'))
            return;
        }
        if(!mapView || !currentLocation)
            return;

        let userRegion = {
            latitude: currentLocation?.coords?.latitude,
            longitude: currentLocation?.coords?.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
        }
        setRegion(userRegion)

        mapView.animateToRegion(userRegion, 200);
    }

    const markerTranslate = markerSize ? {translateX: -markerSize.width/2 + 16, translateY: -markerSize.height*0.99 + 16} : {};
    // let _mapView = null;
    console.log('mapCenterAddress:',mapCenterAddress);
    return <KeyboardAvoidingScreen>
        <PageContainerDark
            Header={(
                <HeaderBase childrenContainerStyle={styles.headerChildrenContainer}>
                    <CustomTextInput
                        backgroundColor="#4e4b4b"
                        placeholderColor={COLOR_NEUTRAL_GRAY}
                        leftIcon="search"
                        placeholder="Search"
                        value={mapCenterAddress?.formatted_address}
                        color={'white'}
                        onPress={() => navigation.navigate('LocationSearch', {setSelectedAddress})}
                    />
                </HeaderBase>
            )}
            noScroll
            contentStyle={StyleSheet.absoluteFill}
        >
            <MapView
                ref = {setMapView}
                style={StyleSheet.absoluteFill}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                onPress={() => setSelectedAddress(null)}
                zoomEnabled={true}
                zoomControlEnabled={false}
                showsUserLocation={true}
                userLocationPriority='low'
                showsMyLocationButton={false}
            >
                {/*{selectedAddress && (*/}
                {/*    <MapView.Marker*/}
                {/*        coordinate={{*/}
                {/*            latitude: parseFloat(selectedAddress.geometry.location.lat),*/}
                {/*            longitude: parseFloat(selectedAddress.geometry.location.lng),*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <SvgXml*/}
                {/*            onLayout={onMarkerLayout}*/}
                {/*            size={32}*/}
                {/*            xml={svgs['map-marker']}*/}
                {/*        />*/}
                {/*    </MapView.Marker>*/}
                {/*)}*/}

                {/*<MapView.Marker*/}
                {/*    coordinate={region}*/}
                {/*/>*/}
            </MapView>
            <View style={[styles.centerIndicator, markerTranslate]}>
                <SvgXml
                    onLayout={onMarkerLayout}
                    xml={svgs['map-marker']}
                />
            </View>
            <View style={styles.btnContainer}>
                <View style={{paddingBottom: 32, marginLeft: 'auto'}}>
                    <MapCenterButton
                        status={locationAvailable ? 'on' : 'off'}
                        onPress={moveToMyLocation}
                    />
                </View>
                <PrimaryButton
                    // disabled={!selectedAddress}
                    title={t('general.confirm')}
                    onPress={selectLocation}
                    inProgress={inProgress}
                    disabled={inProgress}
                />
            </View>
        </PageContainerDark>
    </KeyboardAvoidingScreen>
}

const styles = StyleSheet.create({
    headerChildrenContainer: {
        paddingHorizontal: 16,
    },
    centerIndicator:{
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
    btnContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
    },
    selectedAddressTitle:{
        position: 'absolute',
        backgroundColor: 'white',
        left: 16,
        right: 16,
        top: 16,
        padding: 16,
        borderRadius: 8,
        borderColor: COLOR_NEUTRAL_GRAY,
        // borderWidth: 1,
    }
})

const mapStateToProps = state => ({
    recentAddresses: state.app.recentAddresses,
    currentLocation: state.app.location.current,
    locationAvailable: state.app.location.available,
})

const mapDispatchToProps = dispatch => ({
    loadRecentAddresses: () => dispatch(loadRecentAddressesList()),
    loadSavedAddresses: () => dispatch(loadSavedAddressesAction()),
    setRecentAddresses: list => dispatch(setRecentAddressesAction(list)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePackageLocationScreen);

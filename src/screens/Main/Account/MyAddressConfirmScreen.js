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
    setRecentAddresses as setRecentAddressesAction,
} from '../../../redux/actions/appActions';
import GoogleApi from '../../../utils/googleApi';

import { useTranslation } from 'react-i18next';

const HomePackageLocationScreen = ({navigation, route, type, recentAddresses, /**selectedAddress,*/ ...props}) => {
    let { t } = useTranslation();

    const [markerSize, onMarkerLayout] = useComponentSize();
    const { onConfirm, address: defaultAddress } = route.params;
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

                // let newRecentAddresses = recentAddresses.filter(a => a.place_id !== address.place_id)
                // props.setRecentAddresses([address, ...newRecentAddresses].slice(0, 5))
                console.log('calling on confirm')
                onConfirm(address);
            })
            .catch(console.error)
            .then(() => {
                setInProgress(false)
            })
    }

    useEffect(() => {
        if(!mapView)
            return

        if(selectedAddress){
            mapView.animateToRegion({
                latitude: selectedAddress.geometry.location.lat,
                longitude: selectedAddress.geometry.location.lng,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            }, 1000);
        }
    }, [mapView, selectedAddress])

    useEffect(() => {
        if(!mapView){
            setMapCenterAddress(null)
        }else{
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
                .then(address => setMapCenterAddress(address))
        }
    }, [mapView, selectedAddress, region])

    const markerTranslate = markerSize ? {translateX: -markerSize.width/2 + 16, translateY: -markerSize.height*0.99 + 16} : {};
    // let _mapView = null;
    return <KeyboardAvoidingScreen>
        <PageContainerDark
            Header={(
                <HeaderBase childrenContainerStyle={styles.headerChildrenContainer}>
                    <CustomTextInput
                        backgroundColor="#4e4b4b"
                        placeholderColor={COLOR_NEUTRAL_GRAY}
                        leftIcon="search"
                        placeholder={t('pages.support_center.search')}
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
                showsUserLocation={true}
                userLocationPriority='low'
                showsMyLocationButton={true}
            >
            </MapView>
            <View style={[styles.centerIndicator, markerTranslate]}>
                <SvgXml
                    onLayout={onMarkerLayout}
                    xml={svgs['map-marker']}
                />
            </View>
            <View style={styles.btnContainer}>
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
})

const mapDispatchToProps = dispatch => ({
    loadRecentAddresses: () => dispatch(loadRecentAddressesList()),
    setRecentAddresses: list => dispatch(setRecentAddressesAction(list)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePackageLocationScreen);

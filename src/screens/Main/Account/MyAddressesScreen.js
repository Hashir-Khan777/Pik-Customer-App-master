import React, {useState, useEffect} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import GoogleApi from '../../../utils/googleApi';
import HeaderPage from '../../../components/HeaderPage';
import PageContainerDark from '../../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import CustomTextInput from '../../../components/CustomTextInput';
import globalStyles from '../../../utils/globalStyles';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900, COLOR_TERTIARY_HYPERLINK} from '../../../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {
    loadSavedAddresses as loadSavedAddressesAction,
    setSavedAddresses as setSavedAddressesAction,
} from '../../../redux/actions';
import Api from '../../../utils/api'

import { useTranslation } from 'react-i18next';

const MyAddressesScreen = ({navigation, route, savedAddresses, ...props}) => {
    let { t } = useTranslation();

    let [refreshing, setRefreshing] = useState(false);
    let [searchText, setSearchText] = useState('');
    let [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        props.loadSavedAddresses();
        console.log('loading saved addresses')
    }, [props.loadSavedAddresses])

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await props.loadSavedAddresses()
        setRefreshing(false);
    }, []);

    let timeout = null;
    useEffect(() => {
        if (timeout) {
            // console.log(`canceling timeout ${timeout}`)
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => requestGeocoding(), 500);

        return () => {
            if (timeout) {
                // console.log(`canceling timeout ${timeout}`)
                clearTimeout(timeout);
            }
        };
    }, [searchText]);

    let searchRequest = null;
    const requestGeocoding = () => {
        timeout = null;
        if (searchRequest) {
            searchRequest.reject();
        }
        if (!searchText) {
            return;
        }
        console.log(`requesting for ${searchText}`);
        searchRequest = GoogleApi.search(searchText)
            .then(({results}) => {
                // console.log(results[0])
                setSearchResult(results);
            })
            .catch(console.error)
            .then(() => {
                searchRequest = null;
            });
    };

    const onAddressEdit = (savedAddress, name, address) => {
        if(savedAddress._id){
            return Api.Customer.editSavedAddress(savedAddress._id, name, address)
                .then(({success, address}) => {
                    if(success){
                        props.setSavedAddresses([address, ...savedAddresses.filter(a => a._id!==savedAddress._id)])
                        setSearchText('')
                        setSearchResult([])
                    }
                })
                .then(() => {
                    navigation.goBack()
                })
        }
        else{
            return Api.Customer.postNewAddress(name, address)
                .then(({success, address}) => {
                    if(success){
                        props.setSavedAddresses([address, ...savedAddresses])
                        setSearchText('')
                        setSearchResult([])
                    }
                })
                .then(() => {
                    navigation.goBack()
                })
        }
    }

    const onAddressDelete = (savedAddress) => {
        return Api.Customer.deleteSavedAddress(savedAddress._id)
            .then(({success}) => {
                if(success){
                    props.setSavedAddresses(savedAddresses.filter(a => a._id!==savedAddress._id))
                    setSearchText('')
                    setSearchResult([])
                }
            })
            .then(() => {
                navigation.goBack()
            })
    }

    const onAddressConfirm = (savedAddress, confirmed) => {
        navigation.replace(
            'MyAddressEdit',
            {
                address: confirmed,
                onConfirm: (name, address) => onAddressEdit(savedAddress, name, address)
            },
        );
    }

    const confirmAddress = address => {
        navigation.navigate(
            'MyAddressConfirm',
            {
                address,
                onConfirm: address => onAddressConfirm({}, address)
            },
        );
        // setSelectedAddress(address)
        // navigation.goBack();
    };

    const editAddress = savedAddress => {
        navigation.navigate(
            'MyAddressEdit',
            {
                address: savedAddress.address,
                name: savedAddress.name,
                onConfirm: (name, address) => onAddressEdit(savedAddress, name, address),
                onDelete: () => onAddressDelete(savedAddress),
            },
        );
        // setSelectedAddress(address)
        // navigation.goBack();
    };

    const SavedAddressItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <FontAwesome5 style={styles.itemIcon} name="map-marker-alt"/>
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{item.name || 'untitled'}</Text>
                    <Text style={styles.itemAddress}>{item.address.formatted_address}</Text>
                </View>
            </View>
        </TouchableOpacity>;
    };

    const AddressItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <FontAwesome5 style={styles.itemIcon} name="map-marker-alt"/>
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{item.formatted_address}</Text>
                    <Text style={styles.itemAddress}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>;
    };

    return <KeyboardAvoidingScreen>
        <PageContainerDark
            Header={<HeaderPage title={t('pages.my_address.header')}/>}
            refreshing={refreshing}
            onRefresh={onRefresh}
        >
            <View style={globalStyles.inputWrapper}>
                <CustomTextInput
                    style={{flexGrow: 1}}
                    value={searchText}
                    onChangeText={text => {
                        setSearchText(text);
                    }}
                    clearable
                    placeholder={t('pages.my_address.search_place_address')}
                />
            </View>

            {!!searchText ? (
                <View>
                    <Text style={styles.h1}>{t('pages.my_address.search_result')}: {searchText}</Text>
                    {searchResult.map((address, index) => (
                        <AddressItem
                            key={index}
                            onPress={() => confirmAddress(address)}
                            item={address}
                        />
                    ))}
                    {/*<Text>{JSON.stringify(searchResult, null, 2)}</Text>*/}
                </View>
            ) : (
                <View>
                    {savedAddresses.length > 0 ? (
                        <>
                            <Text style={styles.h1}>{t('pages.my_address.saved_address')}</Text>
                            {savedAddresses.map((adr, index) => <SavedAddressItem
                                    onPress={() => editAddress(adr)}
                                    key={index}
                                    item={adr}
                                />,
                            )}
                        </>
                    ) : (
                        <Text style={styles.description}>
                            <Text>{t('pages.my_address.no_custom_address')}.</Text>
                            {'\n'}
                            <Text>{t('pages.my_address.search_new_address')}</Text>
                        </Text>
                    )}
                </View>)
            }
        </PageContainerDark>
    </KeyboardAvoidingScreen>;
};

const styles = StyleSheet.create({
    h1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        marginTop: 24,
        marginBottom: 16,
    },
    description: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
        marginTop: 24,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0efef',
        marginHorizontal: -16,
    },
    itemIcon: {
        fontWeight: '300',
        fontSize: 16,
        lineHeight: 40,
        color: COLOR_NEUTRAL_GRAY,
        marginRight: 8,
    },
    itemTitle: {
        textAlign: 'left',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    itemAddress: {
        textAlign: 'left',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
});

const mapStateToProps = state => ({
    savedAddresses: state.app.savedAddresses,
});

const mapDispatchToProps = dispatch => ({
    loadSavedAddresses: () => dispatch(loadSavedAddressesAction()),
    setSavedAddresses: list => dispatch(setSavedAddressesAction(list)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAddressesScreen);

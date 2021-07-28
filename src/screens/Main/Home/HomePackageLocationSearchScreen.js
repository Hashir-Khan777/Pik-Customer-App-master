import React, {useState, useEffect} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native'
import GoogleApi from '../../../utils/googleApi';
import Api from '../../../utils/api';
import HeaderPage from '../../../components/HeaderPage';
import PageContainerDark from '../../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import CustomTextInput from '../../../components/CustomTextInput';
import globalStyles from '../../../utils/globalStyles';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900, COLOR_TERTIARY_HYPERLINK} from '../../../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import ProgressModal from '../../../components/ProgressModal';

const HomePackageLocationSearchScreen = ({navigation, route, recentAddresses, savedAddresses}) => {
    let [inProgress, setInProgress] = useState(false)
    let [searchText, setSearchText] = useState('')
    let [searchResult, setSearchResult] = useState([])
    let [savedItems, setSavedItems] = useState([]);
    let {setSelectedAddress} = route.params;

    const cancelSearch = () => {
        navigation.goBack();
    }

    let timeout = null;
    useEffect(() => {
        if(timeout) {
            // console.log(`canceling timeout ${timeout}`)
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => requestGeocoding(), 500);

        return () => {
            if(timeout) {
                // console.log(`canceling timeout ${timeout}`)
                clearTimeout(timeout);
            }
        }
    }, [searchText])

    let searchRequest = null;
    const requestGeocoding = () => {
        timeout = null;
        if(searchRequest)
            searchRequest.reject();
        if(!searchText)
            return;
        console.log(`requesting for ${searchText}`)
        // searchRequest = GoogleApi.search(searchText)
        //     .then(({results}) => {
        //         // console.log(results[0])
        //         setSearchResult(results)
        //     })
        //     .catch(console.error)
        //     .then(() => {
        //         searchRequest = null;
        //     })
        searchRequest = Api.Geo.autocomplete(searchText)
            .then(({success, predictions, results}) => {
                // console.log(results[0])
                if(success) {
                    predictions.sort((a,b) => (a.description.length-b.description.length))
                    setSearchResult(predictions)
                }
            })
            .catch(console.error)
            .then(() => {
                searchRequest = null;
            })
    }

    const selectAutocomplete = item => {
        console.log('item:',item)
        setInProgress(true)
        Api.Geo.search(item.description)
            .then(({success, results}) => {
                if(success && results[0]){
                    // console.log('results[0]:',results[0])
                    console.log('result:',results)
                    setSelectedAddress(results[0])
                    navigation.goBack();
                }
            })
            .catch(console.error)
            .then(() => {
                setInProgress(false)
            })
    }

    const selectAddress = address => {
        setSelectedAddress(address)
        navigation.goBack();
    }

    const SavedAddressItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <FontAwesome5 style={styles.itemIcon} name="map-marker-alt" />
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{item.name || "untitled"}</Text>
                    <Text style={styles.itemAddress}>{item.address.formatted_address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    const AddressItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <FontAwesome5 style={styles.itemIcon} name="map-marker-alt" />
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{item.formatted_address}</Text>
                    <Text style={styles.itemAddress}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    const AutocompleteItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <FontAwesome5 style={styles.itemIcon} name="map-marker-alt" />
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{item.description}</Text>
                    <Text style={styles.itemAddress}>{item.structured_formatting?.main_text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    return <KeyboardAvoidingScreen>
        <PageContainerDark
            Header={<HeaderPage title="Select Location" />}
        >
            <View style={globalStyles.inputWrapper}>
                <View style={globalStyles.flexRowCenter}>
                    <CustomTextInput
                        style={{flexGrow: 1}}
                        value={searchText}
                        onChangeText={text => {
                            console.log(`text changed`);
                            setSearchText(text)
                        }}
                        clearable
                        placeholder="Search place or address name"
                    />
                    <Text style={styles.cancelBtn} onPress={cancelSearch}>Cancel</Text>
                </View>
            </View>

            {!!searchText ? (
                <View>
                    <Text style={styles.h1}>Search result: {searchText}</Text>
                    {searchResult.map((item, index) => (
                        <AutocompleteItem
                            key={index}
                            onPress={() => selectAutocomplete(item)}
                            item={item}
                        />
                    ))}
                    {/*<Text>{JSON.stringify(searchResult, null, 2)}</Text>*/}
                </View>
            ) : (
                <View>
                    {(savedAddresses.length>0) && (
                        <>
                            <Text style={styles.h1}>Saved address</Text>
                            {savedAddresses.map((adr, index) => <SavedAddressItem
                                key={index}
                                item={adr}
                                onPress={() => selectAddress(adr.address)}
                            />)}
                        </>
                    )}
                    <Text style={styles.h1}>Recent address</Text>
                    {recentAddresses.map((adr, index) => <AddressItem onPress={() => selectAddress(adr)} key={index} item={adr} />)}
                </View>)
            }
            <ProgressModal
                title="Please wait ..."
                visible={inProgress}
            />
        </PageContainerDark>
    </KeyboardAvoidingScreen>
}

const styles = StyleSheet.create({
    h1:{
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        marginTop: 24,
        marginBottom: 16,
    },
    cancelBtn: {
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_TERTIARY_HYPERLINK,
        marginLeft: 16,
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
    itemTitle:{
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        color: COLOR_PRIMARY_900,
    },
    itemAddress: {
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'left',
        color: COLOR_NEUTRAL_GRAY,
    },
})

const mapStateToProps = state => ({
    savedAddresses: state.app.savedAddresses,
    recentAddresses: state.app.recentAddresses,
})

export default connect(mapStateToProps)(HomePackageLocationSearchScreen);

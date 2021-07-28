import React, {useState, useMemo, useEffect} from 'react'
import {
    TouchableOpacity,
    FlatList,
    StyleSheet,
    View,
    Text,
} from 'react-native'
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'
import HeaderPage from '../../../components/HeaderPage';
import PageContainerDark from '../../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_HYPERLINK, WINDOW_WIDTH,
} from '../../../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../../utils/globalStyles';
import CustomTextInput from '../../../components/CustomTextInput';
import {connect} from 'react-redux';
import {loadContactsList as loadContactsListAction} from '../../../redux/actions';
import Avatar from '../../../components/Avatar';
import { useTranslation } from 'react-i18next';

const HomeContactsScreen = ({navigation, route, contacts, contactsLoaded, loadContactsList}) => {
    let { t } = useTranslation();

    let [searchText, setSearchText] = useState('')
    const { setContact } = route.params;


    useEffect(() => {
        if(!contactsLoaded)
            loadContactsList();
    }, [loadContactsList])

    let filteredContacts = useMemo(() => {
        let result
        if(!searchText)
            result = contacts;
        else
            result = contacts.filter(c => c.search.includes(searchText.toLowerCase()))
        return result; //.slice(0, 5);
    }, [searchText, contacts])

    const selectContact = contact => {
        setContact && setContact(contact)
        navigation.goBack();
    }

    const ContactItem = ({item, onPress}) => {
        return <TouchableOpacity onPress={onPress}>
            <View style={styles.itemContainer}>
                <Avatar
                    borderColor={COLOR_PRIMARY_500}
                    style={styles.avatar}
                    size={48}
                    source={{uri: item.thumbnailPath}}
                />
                <View style={{flexGrow: 1}}>
                    <Text style={styles.itemTitle}>{`${item.givenName} ${item.familyName}`.trim()}</Text>
                    <Text style={styles.itemAddress}>{item.phoneNumbers.map(p => p.number).join(' - ')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    let wrappedContacts = useMemo(() => {
        return new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filteredContacts); //.slice(0, 5);
    }, [searchText, filteredContacts])

    let layoutProvider = useMemo(() => {
        return new LayoutProvider(i => {
            // if(!searchText)
                return 'VISIBLE'
            // if(wrappedContacts.getDataForIndex(i).search.includes(searchText.toLowerCase()))
            //     return 'VISIBLE'
            // return 'HIDDEN'
        }, (type, dim) => {
            switch (type) {
                case 'VISIBLE':
                    dim.width = WINDOW_WIDTH
                    dim.height = 48 + 2*16
                    break
                case 'HIDDEN':
                    dim.width = 0
                    dim.height = 0
                    break;
                default:
                    dim.width = 0
                    dim.height = 0
                    break;
            }
        })
    }, [])

    const rowRenderer = (type, data) => {
        return <ContactItem onPress={() => selectContact(data)} item={data} />
    }

    return <KeyboardAvoidingScreen>
        <PageContainerDark
            Header={<HeaderPage title={t('contact.title')} />}
            noScroll
        >
            <View style={{flexGrow: 0}}>
                <View style={globalStyles.inputWrapper}>
                    <CustomTextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        leftIcon="search"
                        clearable
                        placeholder={t('contact.contact_info')}
                    />
                </View>
                <Text>Contacts: {contacts?.length}</Text>
            </View>
            <View style={{flexGrow: 1}}>
                <RecyclerListView
                    style={{height: '100%', marginHorizontal: -16}}
                    layoutProvider={layoutProvider}
                    dataProvider={wrappedContacts}
                    rowRenderer={rowRenderer}
                />
            </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0efef',
        // marginHorizontal: -16,
    },
    avatar: {
        marginRight: 16,
    },
    itemIcon: {
        fontWeight: '300',
        fontSize: 16,
        lineHeight: 40,
        color: COLOR_PRIMARY_500,
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
        color: COLOR_NEUTRAL_GRAY,
    },
})

const mapStateToProps = state => ({
    contactsLoaded: state.app.contactsLoaded,
    contacts: state.app.contacts,
})

const mapDispatchToProps = dispatch => ({
    loadContactsList: address => dispatch(loadContactsListAction(address))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContactsScreen)

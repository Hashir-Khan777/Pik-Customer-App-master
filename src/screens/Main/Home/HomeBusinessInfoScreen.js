import React, {useState, useEffect, useMemo} from 'react';
const {PhoneNumberUtil, PhoneNumberFormat} = require('google-libphonenumber');
const phoneUtils = PhoneNumberUtil.getInstance();
import {
    TouchableOpacity,
    StyleSheet,
    Linking,
    Image,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import BoxShadow from '../../../components/BoxShadow';
import AvailableOrderItem from '../../../components/AvailableOrderItem';
import {loadOrdersList as loadOrdersListAction} from '../../../redux/actions';
import {getAvailables as getAvailablesSelector} from '../../../redux/selectors';
import {connect} from 'react-redux';
import globalStyles from '../../../utils/globalStyles';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900} from '../../../utils/constants';
import Avatar from '../../../components/Avatar';
import {callPhoneNumber} from '../../../utils/helpers';

const HomeMainScreen = ({navigation, route, ...props}) => {
    let {business} = route.params;
    const dayTitles = ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const formatTime = time => {
        let [h, m] = time.split(':')
        return `${(h<13?h:h-12).toString().padStart(2, '0')}:${(m<13?m:m-12).toString().padStart(2, '0')} ${h<13 ? 'a.m.' : 'p.m.'}`
    }

    const timeFrames = useMemo(() => {
        if(!business?.timeFrames)
            return []
        return [1,2,3,4,5,6,0].map(i => business.timeFrames[i])
    }, [business?.timeFrames])

    const openBusinessWebsite = () => {
        let url = business?.website
        if (!url.match(/^[a-zA-Z]+:\/\//))
        {
            url = 'http://' + url;
        }
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + this.props.url);
            }
        });
    }

    const formatTel = number => {
        try {
            let parsedNumber = phoneUtils.parse(number);
            return phoneUtils.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL)
        }
        catch (e) {
            console.log(number, e.message)
            return number
        }
    }

    return (

        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage title="Information" />}
            >
                <View>
                    <View style={[globalStyles.flexRowCenter, {justifyContent: 'center'}]}>
                        <Avatar
                            size={108}
                            source={{uri: business.logo}}
                        />
                    </View>
                    <View style={[globalStyles.flexRowCenter, {justifyContent: 'center'}]}>
                        <Text style={styles.businessName}>{business?.name}</Text>
                    </View>
                </View>

                <Text style={styles.h1}>About</Text>
                <Text style={styles.description}>{business.about}</Text>

                <Text style={styles.h1}>Address</Text>
                <Text style={styles.description}>{business?.address?.formatted_address}</Text>

                {!!business?.phone && <>
                    <Text style={styles.h1}>Phone</Text>
                    <Text style={[styles.description, globalStyles.link]} onPress={() => callPhoneNumber(business?.phone)}>
                        {formatTel(business?.phone)}
                    </Text>
                </>}

                {!!business?.mobile && <>
                    <Text style={styles.h1}>Mobile</Text>
                    <Text style={[styles.description, globalStyles.link]} onPress={() => callPhoneNumber(business?.mobile)}>
                        {formatTel(business?.mobile)}
                    </Text>
                </>}

                {!!business?.website && <>
                    <Text style={styles.h1}>Website</Text>
                    <Text
                        style={[styles.description, globalStyles.link]}
                        onPress={() => openBusinessWebsite()}
                    >{business?.website}</Text>
                </>}

                <Text style={styles.h1}>Open Hours</Text>
                {timeFrames.map((timeFrame, index) => (
                    <View key={index} style={[globalStyles.flexRowCenter, {justifyContent: 'space-between', marginBottom: 4,}]}>
                        <Text>{dayTitles[index]}</Text>
                        {timeFrame.totallyClosed ? (
                            <Text>Closed</Text>
                        ) : (
                            <Text>{formatTime(timeFrame.open)} - {formatTime(timeFrame.close)}</Text>
                        )}
                    </View>
                ))}

            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    businessName: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
        marginVertical: 16,
    },
    h1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        marginTop: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
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
    }
}

const mapDispatchToProps = dispatch => ({
    loadOrdersList: () => dispatch(loadOrdersListAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeMainScreen);

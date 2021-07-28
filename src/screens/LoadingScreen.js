import React, {useEffect} from 'react';
import {
    StatusBar,
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native';
import {ORANGE, WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/constants';
import withAuth from '../redux/connectors/withAuth';

const LoadingScreen = ({authInit}) => {
    useEffect(() => {
        authInit();
    }, [])

    return <View style={styles.container}>
        <Image
            style={styles.logo}
            source={require('../assets/images/PIK-Delivery-logo.png')}
        />
    </View>;
};

const logoSize = Math.min(1345, Math.min(WINDOW_HEIGHT, WINDOW_WIDTH)* 0.6);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    logo: {
        width: logoSize,
        height: logoSize,
        resizeMode: "contain"
    }
});

export default withAuth(LoadingScreen);

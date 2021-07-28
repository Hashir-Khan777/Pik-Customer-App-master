import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    View,
    Text,
} from 'react-native';
import PrimaryButton from './ButtonPrimary';
import CustomButton from './CustomButton';
import {WINDOW_HEIGHT} from '../utils/constants';

const BottomDrawer = ({offset, children, onPress}) => {
    return (
        <View style={[styles.container, styles.shadow]}>
            <TouchableOpacity onPress={() => (onPress && onPress())}>
                <View style={styles.iconWrapper}>
                    <View style={styles.icon}/>
                </View>
            </TouchableOpacity>
            <ScrollView style={{maxHeight: WINDOW_HEIGHT * 0.6, paddingHorizontal: 16}}>
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 0,
        paddingBottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    iconWrapper: {
        padding: 8,
    },
    icon: {
        // position: 'absolute',
        alignSelf: 'center',
        width: 80,
        height: 6,
        backgroundColor: '#F0EFEF',
        borderRadius: 8,
    },
    shadow: {
        shadowColor: '#CECDCD',
        shadowRadius: 2,
        shadowOpacity: 5,
        elevation: 15,
    },
});

export default BottomDrawer;

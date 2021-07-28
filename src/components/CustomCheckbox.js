import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {INPUT_HEIGHT} from '../utils/constants';

const CustomCheckbox = ({children, ...props}) => {
    return <View style={styles.wrapper}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox style={styles.checkbox} {...props}/>
            <View style={{flexGrow: 1}}>{children}</View>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    wrapper: {
        minHeight: INPUT_HEIGHT,
    },
    checkbox: {
        flexGrow: 0,
        marginLeft: -8,
    },
});

export default CustomCheckbox;

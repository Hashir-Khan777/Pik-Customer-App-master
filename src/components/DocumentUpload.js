import React from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Alert,
    View,
    Text,
} from 'react-native';
import {GRAY_LIGHT, GRAY_LIGHT_EXTRA} from '../utils/constants';
import DropShadow from 'react-native-drop-shadow';
import svgs from '../utils/svgs';
import {SvgXml} from 'react-native-svg';

const DocumentUpload = ({icon, title, onPress, approved, disabled}) => {
    const _onPress = e => {
        if(disabled){
            Alert.alert("Attention", "This item approved and no need to update. You can change it later from your profile page.")
            return;
        }
        onPress && onPress(e);
    };

    return (
        <TouchableWithoutFeedback onPress={_onPress}>
            <DropShadow
                // style={styles.shadow}
                style={{
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                }}
            >
                <View style={styles.container}>
                    {icon}
                    <Text style={styles.title}>{title}</Text>
                    {approved && <SvgXml width={20} xml={svgs['icon-checkbox-checked']}/>}
                    <View style={styles.rightIcon}/>
                </View>
            </DropShadow>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: GRAY_LIGHT,
        backgroundColor: '#fafafa',
        borderRadius: 5,
        // elevation: 1,
    },
    title: {
        // fontWeight: 'bold',
        marginLeft: 10,
        flexGrow: 1,
    },

    rightIcon: {
        backgroundColor: 'transparent',
        borderTopWidth: 5,
        borderTopColor: 'transparent',
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftColor: '#00000099',
        width: 0,
        height: 0,
        marginLeft: 10,
    },
});

export default DocumentUpload;

import React from 'react'
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    View,
    Text
} from 'react-native'
import {COLOR_PRIMARY_500, INPUT_HEIGHT} from '../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';

const ButtonSocial = ({type, title, inProgress, disabled, onPress}) => {
    let Wrapper = disabled ? TouchableWithoutFeedback : TouchableOpacity;
    return (
        <Wrapper style={{height: 48}} onPress={disabled ? null : onPress}>
            <View style={[styles.container, styles[type]]}>
                <SvgXml style={styles.icon} xml={svgs['icon-social-' + type]}/>
                {inProgress ? (
                    <ActivityIndicator style={styles.text} color="white"/>
                ) : (
                    <Text style={styles.text}>{title}</Text>
                )}
            </View>
        </Wrapper>
    )
}

ButtonSocial.propTypes = {
    type: PropTypes.oneOf(['facebook', 'google']),
    title: PropTypes.string,
    onPress: PropTypes.func
}

ButtonSocial.defaultProps = {
    title: "Social Button",
    onPress: () => {}
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 16,
    },
    icon: {
        width: 26,
        height: 26,
        flexGrow: 0,
    },
    text:{
        color: "white",
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        flexGrow: 1
    },
    facebook: {
        backgroundColor: "#3B4F86"
    },
    google: {
        backgroundColor: "#E92F48"
    }
})

export default ButtonSocial;

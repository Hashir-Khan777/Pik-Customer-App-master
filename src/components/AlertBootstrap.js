import React from 'react'
import PropTypes from 'prop-types'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from 'react-native'
import {
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ICON_COLORS = {
    warning: COLOR_PRIMARY_500,
    danger: COLOR_TERTIARY_ERROR,
    success: COLOR_TERTIARY_SUCCESS,
    info: COLOR_TERTIARY_HYPERLINK
}
const ICON_TYPE = {
    warning: 'exclamation-circle',
    danger: 'exclamation-circle',
    success: 'check-circle',
    info: 'exclamation-circle'
}

const AlertBootstrap = ({message, type, onClose}) => {
    let icon = <FontAwesome5 color={ICON_COLORS[type]} name={ICON_TYPE[type]}/>
    return <View style={[styles.container, styles['bg-' + type]]}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.messageContent}>
            <Text style={styles.text}>
                <Text>{message}</Text>
            </Text>
        </View>
        {onClose && (
            <TouchableOpacity style={styles.close} onPress={onClose}>
                <FontAwesome5 name="times"/>
            </TouchableOpacity>
        )}
    </View>
}

AlertBootstrap.propTypes = {
    type: PropTypes.oneOf(['danger','success', 'warning', 'info'])
}

AlertBootstrap.defaultProps = {
    type: 'info'
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 8,
        // flex: 1,
        flexDirection: 'row'
    },
    iconContainer: {
        padding: 12,
        paddingRight: 0
    },
    messageContent: {
        flex: 1,
        padding: 12,
        flexGrow: 1,
    },
    'bg-danger':{backgroundColor: '#FFF0EE'},
    'bg-success':{backgroundColor: '#e4fbf0'},
    'bg-warning':{backgroundColor: '#FFFAE2'},
    'bg-info':{backgroundColor: '#E2F6FF'},
    text:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    icon: {
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_TERTIARY_HYPERLINK
    },
    close:{
        padding: 16,
    }
})

export default AlertBootstrap;

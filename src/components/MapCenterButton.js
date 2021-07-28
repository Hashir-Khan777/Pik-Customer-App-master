import React from 'react'
import PropTypes from 'prop-types'
import {
    TouchableOpacity,
    StyleSheet,
    View
} from 'react-native'
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, GRADIENT_2} from '../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';
import GradientView from './GradientView';

const MapCenterButton = ({onPress, status, style}) => {
    const Wrapper = status === 'on' ? GradientView : View
    return <TouchableOpacity onPress={onPress}>
        <Wrapper gradient={GRADIENT_2} style={[styles.container, styles[status], style]}>
            <SvgXml width={25} height={25} xml={svgs['gps-white']}/>
        </Wrapper>
    </TouchableOpacity>
}

MapCenterButton.propTypes = {
    status: PropTypes.oneOf(['on', 'off'])
}

MapCenterButton.defaultProps = {
    status: 'on'
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOR_PRIMARY_500,
        width: 50, height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    on: {
        backgroundColor: COLOR_PRIMARY_500,
    },
    off: {
        backgroundColor: COLOR_NEUTRAL_GRAY,
    }
})

export default MapCenterButton;

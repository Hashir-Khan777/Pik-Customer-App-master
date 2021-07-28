import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import {COLOR_PRIMARY_200, COLOR_PRIMARY_900} from '../utils/constants';
import {SvgXml, SvgUri} from 'react-native-svg';
import svgs from '../utils/svgs';

const Avatar = ({source, size, border, borderColor, style}) => {
    let isSvg = source?.uri ? (source.uri).substr(-4).toLowerCase() === '.svg' : false;
    return (
        <View style={[style, styles.container, {width: size, height: size, borderRadius: size / 2}]}>
            {!!source?.uri ? (
                isSvg ?
                    <SvgUri style={styles.image} uri={source.uri} />
                    :
                    <Image style={styles.image} source={source}/>
            ) : (
                (!!source && !('uri' in source)) ?
                    <Image style={styles.image} source={source}/>
                    :
                    <SvgXml style={styles.image} xml={svgs['default-avatar-square']}/>
            )}
            <View style={[styles.border, {borderWidth: border, borderRadius: size / 2, borderColor}]}/>
        </View>
    );
};

Avatar.propTypes = {
    // source: PropTypes.oneOf([
    //     PropTypes.string,
    //     PropTypes.object,
    // ]),
    border: PropTypes.number,
    borderColor: PropTypes.string,
    size: PropTypes.number,
};

Avatar.defaultProps = {
    border: 2,
    borderColor: COLOR_PRIMARY_900,
    size: 108,
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: COLOR_PRIMARY_200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    border: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
});

export default Avatar;

import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

const FullWidthImage = ({source, aspectRatio, svg}) => {
    return (
        <View style={styles.imageContainer}>
            {!!svg ? (
                <SvgXml
                    style={[styles.image, aspectRatio ? {aspectRatio} : {}]}
                    xml={svg}
                />
            ) : (
                <Image
                    style={[styles.image, aspectRatio ? {aspectRatio} : {}]}
                    resizeMode={'contain'}
                    source={source}
                />
            )}
        </View>
    );
};

FullWidthImage.propTypes = {
    aspectRatio: PropTypes.number,
};

const styles = StyleSheet.create({
    imageContainer: {
        flexGrow: 0,
        padding: 20,
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // backgroundColor: "gray",
    },
    image: {
        width: '100%',
        // backgroundColor: 'blue',
        flex: 1,
        aspectRatio: 1,
    },
});

export default FullWidthImage;

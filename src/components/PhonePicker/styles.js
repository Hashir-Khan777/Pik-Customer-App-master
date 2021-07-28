import {StyleSheet, Dimensions} from 'react-native';
import {COLOR_TERTIARY_ERROR} from '../../utils/constants';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

function hp(percentage) {
    const value = (percentage * viewportHeight) / 100;
    return Math.round(value);
}

const styles = StyleSheet.create({
    container: {
        // width: wp(80),
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
    },
    flagButtonView: {
        // width: wp(20),
        height: '100%',
        flexGrow: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    shadow: {
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: {
            width: 1,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    dropDownImage: {
        height: 14,
        width: 12,
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        flexGrow: 1,
        backgroundColor: '#F8F9F9',
        paddingHorizontal: wp(4),
        textAlign: 'left',
    },
    codeText: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: '500',
        color: '#000000',
        flexGrow: 0,
    },
    numberText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        flexGrow: 1,
        padding: 0,
    },
    errorText:{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default styles;

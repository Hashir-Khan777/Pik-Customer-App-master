import {StyleSheet} from 'react-native';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
    COLOR_TERTIARY_WARNING,
    INPUT_HEIGHT,
    SIZE_CAPTION_1,
    SIZE_HEADLINE_1,
    SIZE_HEADLINE_2,
    SIZE_HEADLINE_3,
    SIZE_PARAGRAPH_1,
} from './constants';

const globalStyles = StyleSheet.create({
    textHeadline1: {
        fontWeight: '800',
        color: COLOR_PRIMARY_900,
        fontSize: 40,
        lineHeight: 48,
    },
    textHeadline2: {
        fontWeight: 'bold',
        color: COLOR_PRIMARY_900,
        fontSize: 32,
        lineHeight: 48,
    },
    textHeadline3: {
        fontWeight: 'bold',
        color: COLOR_PRIMARY_900,
        fontSize: 24,
        lineHeight: 24,
    },
    textHeadline4: {
        fontWeight: '600',
        color: COLOR_PRIMARY_900,
        fontSize: 22,
        lineHeight: 24,
    },
    textHeadline5: {
        fontWeight: 'bold',
        color: COLOR_PRIMARY_900,
        fontSize: 20,
        lineHeight: 24,
    },

    textParagraph1: {
        fontWeight: '400',
        fontSize: SIZE_PARAGRAPH_1,
        color: COLOR_NEUTRAL_GRAY,
        lineHeight: 24,
    },

    textCaption1: {
        fontWeight: '400',
        fontSize: SIZE_CAPTION_1,
        color: COLOR_NEUTRAL_GRAY,
        lineHeight: 16,
    },
    alert: {
        backgroundColor: COLOR_NEUTRAL_GRAY,
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        padding: 4,
        color: COLOR_PRIMARY_900,
    },
    alertSuccess: {
        backgroundColor: COLOR_TERTIARY_SUCCESS,
        color: 'white',
    },
    alertWarning: {
        backgroundColor: COLOR_TERTIARY_WARNING,
        // color: 'white'
    },
    alertDanger: {
        backgroundColor: COLOR_TERTIARY_ERROR,
        color: 'white',
    },
    alertInfo: {
        backgroundColor: COLOR_TERTIARY_HYPERLINK,
        color: 'white',
    },
    inputWrapper: {
        marginBottom: 15,
    },
    link:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        color: COLOR_TERTIARY_HYPERLINK
    },
    arrowRight:{
        width: 0,
        height: 0,
        borderWidth: 5,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: COLOR_PRIMARY_900,
    },
    arrowDown:{
        width: 0,
        height: 0,
        borderWidth: 5,
        borderBottomWidth: 0,
        borderTopColor: COLOR_PRIMARY_900,
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
    },
    flexRowCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default globalStyles;

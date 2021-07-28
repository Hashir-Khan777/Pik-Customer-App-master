import {StyleSheet} from 'react-native';
import {COLOR_PRIMARY_500, INPUT_HEIGHT} from '../../utils/constants';

export default StyleSheet.create({
    content: {
        justifyContent: 'flex-end',
        paddingVertical: 4,
        // marginVertical: 1,
        height: INPUT_HEIGHT,
    },
    bodyContent: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        height: INPUT_HEIGHT - 8,
    },
    toucheableLineContent: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    label: {
        fontSize: 10,
        // paddingBottom: 7,
        color: COLOR_PRIMARY_500,
        fontWeight: '600',
        height: 16,
        lineHeight: 16,
    },
    input: {
        fontSize: 14,
        flex: 1,
        // marginBottom: 30,
        borderWidth: 0,
        padding: 0,
        paddingBottom: 2,
        // borderBottomWidth: 0,
        height: 24,
        lineHeight: 24,
    },
    error: {
        marginBottom: 5,
        color: '#d32f2f',
        fontSize: 13,
        marginTop: 2,
    },
    sufix: {
        flexDirection: 'column-reverse',
    },
});

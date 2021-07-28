import React from 'react';
import PropTypes from 'prop-types';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';

const RadioInput = ({items, value, onChange}) => {

    const _onChange = val => {
        onChange && onChange(val);
    };
    return (
        <View style={styles.wrapper}>
            {items.map((item, index) => (
                <TouchableWithoutFeedback key={index} onPress={e => _onChange(item)}>
                    <View>
                        <View style={styles.item}>
                            <SvgXml
                                style={styles.icon}
                                xml={svgs['icon-radio-' + (value == item ? 'on' : 'off')]}
                            />
                            <Text style={styles.title}>{item}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            ))}
        </View>
    );
};

RadioInput.propTypes = {
    items: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const styles = StyleSheet.create({
    wrapper: {
        // height: INPUT_HEIGHT,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 2,
    },
    title: {
        marginRight: 25,
    },
});

export default RadioInput;

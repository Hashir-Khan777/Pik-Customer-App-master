import React, {useState, useMemo} from 'react';
import moment from 'moment';
import {
    TouchableOpacity,
    StyleSheet,
    FlatList,
    View,
    Text,
} from 'react-native';
import GradientView from './GradientView';
import {COLOR_TERTIARY_ERROR, GRADIENT_2, GRAY_LIGHT_EXTRA} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getDateScheduleTimes} from '../utils/helpers';

const DateItem = ({item, selected, disabled, onPress}) => {
    if (disabled) {
        return <View style={[styles.dateItem, {backgroundColor: GRAY_LIGHT_EXTRA}]}>
            <Text style={styles.dateTitle}>{item.weekday}</Text>
            {item.weekday !== 'Hoy' && <Text style={styles.dateNumber}>{item.monthday}</Text>}
        </View>;
    }

    return (
        <TouchableOpacity onPress={onPress}>
            {selected ? (
                <GradientView gradient={GRADIENT_2} style={styles.dateItem}>
                    <Text style={[styles.dateTitle, {color: 'white'}]}>{item.weekday}</Text>
                    {item.weekday !== 'Hoy' &&
                    <Text style={[styles.dateNumber, {color: 'white'}]}>{item.monthday}</Text>}
                </GradientView>
            ) : (
                <View style={[styles.dateItem, {borderWidth: 1}]}>
                    <Text style={styles.dateTitle}>{item.weekday}</Text>
                    {item.weekday !== 'Hoy' && <Text style={styles.dateNumber}>{item.monthday}</Text>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const TimeItem = ({time, selected, disabled, onPress}) => {
    if(disabled){
        return (
            <View style={[styles.timeItem, {backgroundColor: GRAY_LIGHT_EXTRA}]}>
                <Text style={styles.timeTitle}>{time.label}</Text>
            </View>
        )
    }
    return <TouchableOpacity onPress={onPress}>
        {selected ? (
            <GradientView gradient={GRADIENT_2} style={styles.timeItem}>
                <Text style={[styles.timeTitle, {color: 'white'}]}>{time.label}</Text>
            </GradientView>
        ) : (
            <View style={[styles.timeItem, {borderWidth: 1, marginHorizontal: 7}]}>
                <Text style={styles.timeTitle}>{time.label}</Text>
            </View>
        )}
    </TouchableOpacity>;
};

const OrderSchedulePicker = ({schedule, timeFrames, customTimeFrames, onChange, errorText}) => {
    const dateItems = useMemo(() => {
        let result = [0, 1, 2, 3, 4, 5, 6].map(n => {
            let m = moment().add(n, 'days');
            let key = m.format('YYYY-MM-DD');
            return {
                value: key,
                weekday: n === 0 ? 'Hoy' : m.format('ddd'),
                weeknum: m.format('d'),
                monthday: m.format('DD'),
            };
        });
        while(getDateScheduleTimes(result[0].value, timeFrames, customTimeFrames).length === 0) {
            result.splice(0, 1);
        }
        return result;
    }, [JSON.stringify(timeFrames), JSON.stringify(customTimeFrames)]);

    const weekNumber = useMemo(() => {
        if(!schedule?.date)
            return -1;
        return moment(schedule?.date || undefined).format('d')
    }, [schedule?.date])

    const timeItems = useMemo(() => {
        if(!schedule?.date && !dateItems[0])
            return []
        let date = schedule?.date ? moment(schedule.date) : moment(dateItems[0].value)
        return getDateScheduleTimes(date.format('YYYY-MM-DD'), timeFrames, customTimeFrames);
    }, [schedule, JSON.stringify(dateItems), JSON.stringify(timeFrames), JSON.stringify(customTimeFrames)]);

    const onDateChanged = date => {
        onChange && onChange({
            date,
            // time: schedule?.time,
        });
    };

    const onTimeChanged = time => {
        console.log("schedule?.date = ", schedule?.date);
        if(schedule?.date == 'undefined' || !schedule?.date) {
            let m = moment().add(0, 'days');
            let key = m.format('YYYY-MM-DD');
            onChange && onChange({
                date: key,
                time,
            });
        } else {
            onChange && onChange({
                date: schedule?.date,
                time,
            });
        }
        
    };

    const renderDateItem = ({item}) => {
        // return <Text>{`[${item.value}-${schedule?.date}] `}</Text>
        let ct = customTimeFrames[item.value]
        let disabled = timeFrames[item.weeknum || 0].totallyClosed === true
        if(!!ct){
            disabled = ct.totallyClosed
        }
        return <DateItem
            selected={item.value === schedule?.date}
            item={item}
            disabled={disabled}
            onPress={() => onDateChanged(item.value)}
        />;
    };

    const renderTimeItem = ({item: time, index}) => {
        return <TimeItem
            selected={time.value === schedule?.time}
            time={time}
            onPress={() => onTimeChanged(time.value)}
        />
    }

    return <View>
        {/*<Text>{JSON.stringify(schedule)}</Text>*/}
        <View style={{marginHorizontal: -7, marginBottom: 20}}>
            <FlatList
                data={dateItems}
                renderItem={renderDateItem}
                keyExtractor={item => item.value}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
        <View style={{marginHorizontal: -7}}>
            <FlatList
                data={timeItems}
                renderItem={renderTimeItem}
                keyExtractor={item => item.value}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>

        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </View>;
};

const styles = StyleSheet.create({
    dateItem: {
        width: 48,
        height: 48,
        marginHorizontal: 8,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
    },
    dateTitle: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
    },
    dateNumber: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
    },
    timeItem: {
        height: 24,
        paddingHorizontal: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
    },
    timeTitle: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default OrderSchedulePicker;

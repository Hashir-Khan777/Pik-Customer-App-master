import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Alert, Image, Text, View} from 'react-native';
import ProgressBarGradient from '../ProgressBarGradient';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';

class SubmenuPickup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
        };

        this.onHeaderClick = this.onHeaderClick.bind(this);
        this._onPickup = this._onPickup.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }

    onHeaderClick() {
        this.setState({collapsed: !this.state.collapsed});
    };

    _onPickup() {
        let {onPickup} = this.props;
        if (onPickup) {
            Alert.alert(
                '',
                'Are you sure want to mark the order as picked up?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: onPickup,
                    },
                ],
                {cancelable: false},
            );
        }
    }

    _onCancel() {
        let {onCancel} = this.props;
        if (onCancel) {
            Alert.alert(
                '',
                'Are you sure want to cancel the order?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: onCancel,
                    },
                ],
                {cancelable: false},
            );
        }
    }

    render() {
        let {onAccept, onIgnore} = this.props;
        let {collapsed} = this.state;
        if (collapsed) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>123 Suit, Abraham Mount, NyY</Text>
                </View>
            );
        } else {
            return (
                <>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View>
                                <Text style={styles.title1}>Pickup</Text>
                                <Text style={styles.title2}>Dell Company Inc</Text>
                                <Text style={styles.title3}>123 suit, Abraham Mount, NyY</Text>
                            </View>
                            <View>
                                <SvgXml width={30} xml={svgs['icon-phone']}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View>
                                <Text style={styles.title1}>Pickup Contact</Text>
                                <Text style={styles.title2}>John Doe</Text>
                                <Text style={styles.title3}>352-4512/ 6451-4541</Text>
                            </View>
                            <View>
                                <SvgXml width={30} xml={svgs['icon-comment-unread']}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View>
                                <Text style={styles.title1}>Message</Text>
                                <Text style={styles.title3}>Doorbell is broken, please knock loudly.</Text>
                                <Text style={styles.title3}>Call upon arrival</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View>
                                <Text style={styles.title1}>Photos</Text>
                                <View style={styles.thumbContainer}>
                                    <View style={styles.thumb}>
                                        <Image style={styles.thumbImage}
                                               source={require('../../assets/images/thumb-food-01.jpeg')}/>
                                    </View>
                                    <View style={styles.thumb}>
                                        <Image style={styles.thumbImage}
                                               source={require('../../assets/images/thumb-food-02.jpeg')}/>
                                    </View>
                                    <View style={styles.thumb}>
                                        <Image style={styles.thumbImage}
                                               source={require('../../assets/images/thumb-food-03.jpeg')}/>
                                    </View>
                                    <View style={styles.thumb}>
                                        <Image style={styles.thumbImage}
                                               source={require('../../assets/images/thumb-food-04.jpeg')}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <FormControl>
                        <ButtonPrimary
                            title="Mark as Picked up"
                            onPress={this._onPickup}
                        />
                    </FormControl>
                    <FormControl>
                        <ButtonSecondary
                            title="Cancel Job"
                            onPress={this._onCancel}
                        />
                    </FormControl>
                </>
            );
        }
    }
}

SubmenuPickup.propTypes = {
    onPickup: PropTypes.func,
    onCancel: PropTypes.func,
};

const styles = StyleSheet.create({
    dataWrapper: {
        marginBottom: 40,
    },
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_PRIMARY_900,
        marginVertical: 15,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    title2: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    title3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_PRIMARY_900,
    },
    value: {
        fontWeight: '800',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
        textAlign: 'right',
    },
    thumbContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    thumb: {
        width: 48,
        height: 48,
        borderRadius: 5,
        marginRight: 12,
        marginTop: 4,
        overflow: 'hidden',
    },
    thumbImage: {
        width: 48,
        height: 48,
    },
});

export default SubmenuPickup;

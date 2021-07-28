import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    loadPaymentMethods as loadPaymentMethodsAction,
    selectPaymentMethod as selectPaymentMethodAction,
} from '../../../redux/actions/appActions'
import {
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text, Image
} from 'react-native';
import {
    GRAY_LIGHT_EXTRA,
    COLOR_NEUTRAL_GRAY, REGEX_CREDIT_CARD_EXPIRE_DATE, COLOR_TERTIARY_ERROR, COLOR_PRIMARY_500,
} from '../../../utils/constants';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/globalStyles';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import PrimaryButton from '../../../components/ButtonPrimary';
import BottomDrawerOverlay from '../../../components/BottomDrawerOverlay';
import creditCardDetector from '../../../utils/creditCardDetector'
import CustomPicker from '../../../components/CustomPicker';
import Api from '../../../utils/api';

import { useTranslation } from 'react-i18next';

const NewCard = ({ onSuccess }) => {
    let { t } = useTranslation();

    let [saveInProgress, setSaveInProgress] = useState(false);
    let [number, setNumber] = useState('')
    let [validationEnabled, setValidationEnabled] = useState(false)
    let [year, setYear] = useState('')
    let [month, setMonth] = useState('')
    let [cvv, setCvv] = useState('')
    let [error, setError] = useState('')

    const validateCardNumber = text => {
        if (! !!text)
            return t('payment_detail.credit_card_not_empty')
        let cleanText = text.replaceAll('-', "").replaceAll(' ', '')
        if (!['4', '5'].includes(cleanText[0]))
            return t('payment_detail.only_visa_master')
        let v = creditCardDetector.validate(cleanText);
        if (!v.isValid)
            return v.message
    }

    const validateExpiration = text => {
        if (!(!!text))
            return t('payment_detail.empty')
        // if(!!text && !REGEX_CREDIT_CARD_EXPIRE_DATE.test(text))
        //     return "Incorrect date format EX: 08/23"
    }

    const validateCvv = text => {
        if (! !!text)
            return t('payment_detail.enter_cvv')
        let len = text.length;
        if (!!text && len !== 3 && len !== 4)
            return t('payment_detail.3_4_digit')
    }

    const saveCreditCard = () => {
        if (!!validateCardNumber(number) || !!validateCvv(cvv) || !!validateExpiration(year) || !!validateExpiration(month)) {
            setValidationEnabled(true);
            setNumber(number);
            setYear(year);
            setMonth(month);
            setCvv(cvv)
            return
        }

        setSaveInProgress(true)
        setError('');
        Api.Customer.postNewCreditCard({ number, year, month, cvv })
            .then((data) => {
                console.log('new card response', data)
                let { success, message, errorCode } = data;
                if (success) {
                    onSuccess && onSuccess();
                }
                else
                    setError(message);
            })
            .catch(error => {
                setError(error.message || "Somethings went wrong")
                console.error(error);
            })
            .then(() => {
                setSaveInProgress(false);
            })
    }

    const onChangeCardNumber = num => {
        let cleanText = num.replaceAll('-', "").replaceAll(' ', '')
        let cardInfo = creditCardDetector.getInfo(cleanText);
        if (cardInfo.blocks) {
            let result = "", sum = 0;
            cardInfo.blocks.map(n => {
                result += "  " + cleanText.substr(sum, n)
                sum += n;
            })
            setNumber(result.trim())
        } else
            setNumber(cleanText)
    }

    return <React.Fragment>
        <View style={globalStyles.inputWrapper}>
            <CustomAnimatedInput
                placeholder={t('payment_detail.card_number')}
                value={number}
                onChangeText={onChangeCardNumber}
                type="number"
                errorText={validationEnabled ? validateCardNumber(number) : null}
            />
        </View>
        <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[globalStyles.inputWrapper, { flexGrow: 1 }]}>
                    <CustomPicker
                        placeholder={t('general.month')}
                        items={_.range(1, 13, 1).map(n => n < 10 ? `0${n}` : `${n}`)}
                        selectedValue={month}
                        onValueChange={setMonth}
                        errorText={validationEnabled ? validateExpiration(month) : null}
                    />
                </View>
                <View style={{ width: 16 }} />
                <View style={[globalStyles.inputWrapper, { flexGrow: 1 }]}>
                    <CustomPicker
                        placeholder={t('general.year')}
                        items={_.range(20, 30, 1).map(n => `${n}`)}
                        selectedValue={year}
                        onValueChange={setYear}
                        errorText={validationEnabled ? validateExpiration(year) : null}
                    />
                </View>
                <View style={{ width: 16 }} />
                <View style={[globalStyles.inputWrapper, { flexGrow: 1 }]}>
                    <CustomAnimatedInput
                        placeholder={t('payment_detail.cvv')}
                        value={cvv}
                        type="number"
                        onChangeText={setCvv}
                        errorText={validationEnabled ? validateCvv(cvv) : null}
                    />
                </View>
            </View>
            <View style={{ marginTop: 42 }}>
                {!!error && <Text style={{ color: COLOR_TERTIARY_ERROR }}>{error}</Text>}
                <PrimaryButton
                    title={t('general.save')}
                    inProgress={saveInProgress}
                    onPress={saveCreditCard}
                />
            </View>
        </View>
    </React.Fragment>
}

const HomePaymentMethodsScreen = ({ navigation, route, ...props }) => {
    let { t } = useTranslation();

    const [refreshing, setRefreshing] = React.useState(false);

    const [open, setOpen] = useState(false)
    const { paymentMethods, paymentMethodLoaded, paymentMethodLoading, loadPaymentMethods } = props;
    const { setCreditCard = null, selected = null } = route.params || {};

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadPaymentMethods()
        setRefreshing(false);
    }, []);

    if (!paymentMethodLoaded && !paymentMethodLoading)
        loadPaymentMethods();


    const select = (id) => {
        if (setCreditCard) {
            setCreditCard(id)
            navigation.goBack();
        }
    }

    const cardXml = type => {
        type = !!type ? type.toLowerCase() : type;
        if (svgs['icon-payment-' + type])
            return svgs['icon-payment-' + type]
        else
            return svgs['icon-payment-default']
    }

    const addSlashToExp = exp => `${exp.slice(0, 2)}/${exp.slice(2, 4)}`

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                refreshing={refreshing} onRefresh={onRefresh}
                Header={
                    <HeaderPage
                        title={t('payment_detail.payment_method')}
                        color={HeaderPage.Colors.BLACK}
                    />
                }
                footer={(
                    <>
                        <View style={{ position: 'absolute', bottom: 0, left: '5%', justifyContent: 'center', width: '100%' }}>
                            <Image style={{ width: '90%', height: 100, resizeMode: 'contain', justifyContent: 'center' }} source={svgs['credicorp']} />
                        </View>
                        <BottomDrawerOverlay open={open} onOverlayPress={() => setOpen(false)}>
                            <NewCard onSuccess={() => {
                                console.log('on new card success')
                                setOpen(false);
                                loadPaymentMethods()
                            }} />
                        </BottomDrawerOverlay>
                    </>
                )}
            >
                <View style={{ flexGrow: 1 }}>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                        {paymentMethodLoading && !refreshing && <ActivityIndicator size={"large"} color={COLOR_PRIMARY_500} />}
                    </View>
                    <Text style={styles.title}>{t('payment_detail.payment_methods')}</Text>
                    {paymentMethods.map((m, index) => (
                        <TouchableOpacity key={index} onPress={() => select(m.id)}>
                            <View style={styles.flexRow}>
                                <Text style={styles.radioIcon}>
                                    <SvgXml
                                        width={16} height={16}
                                        xml={svgs['icon-radio-' + (selected === m.id ? 'on' : 'off')]}
                                    />
                                </Text>
                                {/* <SvgXml height={24} width={32} xml={cardXml(m.cc_type)} /> */}
                                <Image
                                    style={{ marginHorizontal: 12, height: 24, width: 32, resizeMode: 'contain' }}
                                    source={cardXml(m.cc_type)}
                                />
                                <Text style={styles.cardNumber}>{m.cc_number}</Text>
                                <Text style={styles.expire}>{addSlashToExp(m.cc_exp)}</Text>
                                <View style={globalStyles.arrowRight} />
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <View style={styles.flexRow}>
                            <Text style={globalStyles.link}>{t('payment_detail.add_payment_method')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>


            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const mapStateToProps = state => {
    let { loaded, loading, list, selected } = state.app.paymentMethods;
    return {
        paymentMethodLoading: loading,
        paymentMethodLoaded: loaded,
        selectedPaymentMethod: selected,
        paymentMethods: list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadPaymentMethods: () => dispatch(loadPaymentMethodsAction()),
    }
}

const styles = StyleSheet.create({
    title: {
        color: COLOR_NEUTRAL_GRAY,
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        paddingVertical: 16,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginTop: -1,
        marginHorizontal: -16,
        borderTopWidth: 1,
        borderTopColor: GRAY_LIGHT_EXTRA,
        borderBottomWidth: 1,
        borderBottomColor: GRAY_LIGHT_EXTRA,
    },
    radioIcon: {
    },
    cardIcon: {
        marginHorizontal: 12,
    },
    cardNumber: {
        flexGrow: 1,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    expire: {
        color: COLOR_NEUTRAL_GRAY,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        marginRight: 18,
    },
    fullFill: {
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    panel: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        padding: 16,
        paddingTop: 32,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePaymentMethodsScreen);

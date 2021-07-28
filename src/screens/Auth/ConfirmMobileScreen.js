import React, {useState, useEffect} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import PhoneInput from '../../components/PhoneInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import {
    BLACK,
    BLUE,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    GRAY_LIGHT,
    GRAY_LIGHT_EXTRA,
    PAGE_PADDING,
} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Api from '../../utils/api';
import withAuth from '../../redux/connectors/withAuth';
import AlertBootstrap from '../../components/AlertBootstrap';
import globalStyles from '../../utils/globalStyles';

const CELL_COUNT = 5;

const ConfirmMobileScreen = ({navigation, route, authLoginWith, authReloadUser}) => {
    const {user, mobile, onConfirm} = route.params || {};
    const [inProgress, setInProgress] = useState(false);
    const [timer, setTimer] = useState(60);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    let timerHandler = null;

    useEffect(() => {
        timerHandler = setInterval(() => {
            setTimer(timer > 0 ? timer - 1 : timer);
        }, 1000);

        return () => {
            clearInterval(timerHandler);
        };
    });

    const confirm = () => {
        setInProgress(true)
        Api.Auth.confirmMobile(user._id, value)
            .then(async ({success, token, message}) => {
                console.log({success, token, message})
                if (success) {
                    await authLoginWith(token, user);
                    await authReloadUser();
                } else {
                    setError(message || 'Server side error');
                }
            })
            .catch(error => {
                console.log(error);
                setError('Somethings went wrong');
            })
            .then(() => {
                setInProgress(false)
                onConfirm && onConfirm()
            })
    };

    const resendCode = () => {
        setTimer(60);

        Api.Auth.resendConfirmCode(user.email, mobile)
            .then(async ({success, message}) => {
                console.log({success, message})
                if (success) {
                    
                } else {
                    setError(message || 'Server side error');
                }
            })
            .catch(error => {
                console.log(error);
                setError('Somethings went wrong');
            })
            .then(() => {
                setInProgress(false)
            })
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    title={'Valide su teléfono'}
                    color={HeaderPage.Colors.BLACK}
                />}
                footer={<View style={{padding: 16}}>
                    {!!error && <View style={globalStyles.inputWrapper}>
                        <AlertBootstrap
                            type="danger"
                            message={error}
                            onClose={() => setError('')}
                        />
                    </View>}
                    <Button
                        title="Siguiente"
                        onPress={confirm}
                        inProgress={inProgress}
                        disabled={inProgress}
                    />
                </View>}
            >
                <View style={{flexGrow: 1}}>
                    <Text style={styles.message}>Ingrese el código que ha sido enviado al </Text>
                    {/*<Text>{JSON.stringify(user, null, 2)}</Text>*/}
                    <Text style={styles.message1}>{mobile}</Text>
                    <View style={styles.inputWrapper}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            cellCount={CELL_COUNT}
                            renderCell={({index, symbol, isFocused}) => (
                                <Text
                                    key={index}
                                    style={[styles.cell, isFocused && styles.focusCell]}
                                    onLayout={getCellOnLayoutHandler(index)}>
                                    {symbol || (isFocused ? <Cursor/> : null)}
                                </Text>
                            )}
                        />
                        {/*<Text style={{textAlign: 'center', color: COLOR_TERTIARY_HYPERLINK}}>For demo app enter any*/}
                        {/*    number you want.</Text>*/}
                    </View>

                    {timer>0 ? (
                        <Text style={styles.resendTitle}>Reenviar el código | {timer} segundos</Text>
                    ) : (
                        <TouchableOpacity onPress={() => resendCode()}>
                            <Text style={styles.resendLink}>Reenviar código</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {/*<View style={{flexGrow: 0}}>*/}
                {/*    {!!error && <Text style={{textAlign: 'center', color: COLOR_TERTIARY_ERROR}}>{error}</Text>}*/}
                {/*    <Button*/}
                {/*        title="Next"*/}
                {/*        onPress={confirm}*/}
                {/*    />*/}
                {/*</View>*/}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    message: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
    },
    message1: {
        textAlign: 'center',
        marginTop: 5,
    },
    inputWrapper: {
        marginVertical: 60,
    },
    link: {
        color: BLUE,
    },
    resendTitle: {
        textAlign: 'center',
    },
    resendLink: {
        textAlign: 'center',
        fontSize: 18,
        color: BLUE,
    },


    codeFieldRoot: {
        justifyContent: 'center',
    },
    cell: {
        width: 50,
        height: 50,
        lineHeight: 48,
        fontSize: 35,
        backgroundColor: GRAY_LIGHT_EXTRA,
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    focusCell: {
        borderColor: '#000',
        borderWidth: 2,
    },
});

export default withAuth(ConfirmMobileScreen)

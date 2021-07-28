import React, {useState} from 'react';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    View,
    Text, StatusBar,
} from 'react-native';
import {
    ORANGE,
    GRAY_LIGHT,
    PAGE_PADDING,
    COLOR_TERTIARY_HYPERLINK,
} from '../../utils/constants';
import ButtonPrimary from '../../components/ButtonPrimary';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import ButtonSocial from '../../components/ButtonSocial';
import withAuth from '../../redux/connectors/withAuth';
import {isEmail, isMobile} from '../../utils/validator';
import Api from '../../utils/api';
import _ from 'lodash';
import PageContainerLight from '../../components/PageContainerLight';
import AlertBootstrap from '../../components/AlertBootstrap';
import globalStyles from '../../utils/globalStyles';
import messaging from '@react-native-firebase/messaging';
import {getDeviceInfo} from '../../utils/helpers';
import AsyncStorage from '@react-native-community/async-storage'

async function requestUserNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        const fcmToken = await messaging().getToken();
        console.log("fcmToken - ", fcmToken);
        let deviceInfo = getDeviceInfo()
        Api.Customer.registerDevice({fcmToken, ...deviceInfo})
            .then(async data => {
                if(data.success){
                    console.log('device registered successfully')
                    await AsyncStorage.setItem('device-info', JSON.stringify({fcmToken, ...deviceInfo}))
                }
                else{
                    console.log(data)
                }
            })
            .catch(console.error)

        // let storedInfo = await AsyncStorage.getItem('device-info')
        // try {
        //     storedInfo = JSON.parse(storedInfo);
        // }catch (e) {}
        // if(!storedInfo || !storedInfo.fcmToken || storedInfo.fcmToken !== fcmToken){
        // }
    }
}

const LoginScreen = ({navigation, authLogin, authLoginWith}) => {
    let [validationEnabled, setValidationEnabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginBusy, setLoginBusy] = useState(false)
    const [loginInProgress, setLoginInProgress] = useState(false)
    const [facebookInProgress, setFacebookInProgress] = useState(false)
    const [googleInProgress, setGoogleInProgress] = useState(false)

    // ================ Validations ====================
    const validateEmail = () => {
        if (!email.trim()) {
            return 'Ingrese su email';
        }
        if (!isEmail(email.trim())) {
            return 'Incorrect email address';
        }
    };
    const validatePassword = () => {
        if (!password) {
            return 'Ingrese su contraseña';
        }
    };
    // =================================================
    const _signIn = () => {
        setError('');
        let error = [
            validateEmail(),
            validatePassword(),
        ].filter(_.identity);

        if (error.length > 0) {
            setError('Por favor verifique los campos');
            setValidationEnabled(true);
            return;
        }

        setLoginInProgress(true)
        setLoginBusy(true)
        authLogin(email, password)
            .then(({success, message, token}) => {
                console.log({success, message, token});
                if (!success) {
                    setError(message || 'Something went wrong');
                }
            })
            .catch(() => {
            })
            .then(() => {
                setLoginInProgress(false)
                setLoginBusy(false)
                requestUserNotificationPermission()
            })
    };

    const onFacebookButtonClick = async () => {
        setFacebookInProgress(true)
        setLoginBusy(true)
        Api.Auth.signinWithFacebook()
            .then(onSocialLoginSuccess)
            .catch(error => {
                setError(error.message || 'Somethings went wrong')
            })
            .then(() => {
                setFacebookInProgress(false)
                setLoginBusy(false)
                requestUserNotificationPermission()
            })
    }

    const onGoogleButtonClick = async () => {
        setGoogleInProgress(true)
        setLoginBusy(true)
        Api.Auth.signinWithGoogle()
            .then(onSocialLoginSuccess)
            .catch(() => {})
            .then(() => {
                setGoogleInProgress(false)
                setLoginBusy(false)
                requestUserNotificationPermission()
            })
    };

    const onSocialLoginSuccess = ({success, user, token, message, registered}) => {
        if(success) {
            if (registered) {
                authLoginWith(token, user);
            } else {
                navigation.replace('AuthRegister', {socialUser: user});
            }
        }
        else {
            setError(message || "Server side error")
        }

    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight
                footer={(
                    <View style={{padding: 16}}>
                        {!!error && (
                            <View style={globalStyles.inputWrapper}>
                                <AlertBootstrap
                                    message={error}
                                    type="danger"
                                    onClose={() => setError('')}
                                />
                            </View>
                        )}
                        <ButtonPrimary
                            title="Iniciar sesión"
                            onPress={_signIn}
                            inProgress={loginInProgress}
                            disabled={loginBusy}
                        />
                        <Text style={styles.textSignup}>
                        ¿No tienes cuenta?
                            <Text onPress={() => navigation.replace('AuthRegister')} style={styles.link}> Regístrate</Text>
                        </Text>
                    </View>
                )}
            >
                    <Text style={styles.title}>Bienvenido, utilice su email y contraseña para iniciar sesión.</Text>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={email}
                            onChangeText={text => setEmail(text)}
                            placeholder={'Email'}
                            errorText={validationEnabled && validateEmail()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={password}
                            onChangeText={text => setPassword(text)}
                            type='password'
                            placeholder={'Contraseña'}
                            errorText={validationEnabled && validatePassword()}
                        />
                        <Text onPress={() => navigation.navigate('AuthPasswordRecovery')}
                              style={styles.forgetPassTitle}>¿olvidé mi contraseña?</Text>
                    </View>
                    <View style={styles.inputWrapper}>
                        <ButtonSocial
                            type='facebook'
                            title="Continuar con Facebook"
                            onPress={onFacebookButtonClick}
                            inProgress={facebookInProgress}
                            disabled={loginBusy}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <ButtonSocial
                            type='google'
                            title="Continuar con Google"
                            onPress={onGoogleButtonClick}
                            inProgress={googleInProgress}
                            disabled={loginBusy}
                        />
                    </View>
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: PAGE_PADDING,
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        paddingHorizontal: 50,
        paddingTop: 50,
        color: GRAY_LIGHT,
        marginBottom: 32,
    },
    description: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        paddingHorizontal: 50,
        paddingVertical: 16,
        color: GRAY_LIGHT,
    },
    inputWrapper: {
        marginBottom: 15,
        flex: 1,
    },
    forgetPassTitle: {
        marginTop: 10,
        color: ORANGE,
        textAlign: 'right',
    },
    textSignup: {
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    link: {
        color: COLOR_TERTIARY_HYPERLINK,
    },
    errorMessage: {
        color: 'red',
        padding: 10,
        backgroundColor: '#fdd',
        borderWidth: 1,
        borderColor: '#fbb',
        borderRadius: 5,
        marginBottom: 5,
    }
});

export default withAuth(LoginScreen);

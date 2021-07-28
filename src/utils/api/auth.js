import axios from '../axios';
import {GoogleSignin} from '@react-native-community/google-signin';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from "react-native-fbsdk";

// userId needed when registering social user
export function register(name, mobile, email, password, userId) {
    return axios.post('/customer/register', {firstName: name, lastName: "", email, mobile, password, userId})
        .then(({data}) => {
            return data;
        });
}

export function confirmMobile(userId, confirmCode) {
    return axios.post('/customer/confirm', {userId, confirmCode})
        .then(({data}) => {
            console.log('confirm response', data);
            return data;
        });
}

export function resendConfirmCode(email, mobile) {
    return axios.post('/customer/resendConfirmCode', {email, mobile})
        .then(({data}) => {
            console.log('resendConfirmCode', data);
            return data;
        });
}

export function signin(email, password) {
    return axios.post('/customer/signin', {email, password})
        .then(({data}) => {
            return data;
        });
}

export function signinWithFacebook() {
    return new Promise(function (resolve, reject) {
        AccessToken.getCurrentAccessToken()
            .then(data => {
                if(data) {
                    console.log('facebook already logged in. removing data')
                    return LoginManager.logOut()
                }
            })
            .then(() => {
                LoginManager.logInWithPermissions(["public_profile", 'email']).then(
                    function(result) {
                        if (result.isCancelled) {
                            reject({message: "Login cancelled"});
                        } else {
                            resolve(true);
                        }
                    },
                    function(error) {
                        reject(error)
                    }
                );
            })
    })
        .then(() => AccessToken.getCurrentAccessToken())
        .then(data => {
            console.log('facebook token: ' + data.accessToken.toString())
            return callSocialSignin('facebook', data.accessToken.toString())
        })
}

export function signinWithGoogle() {
    GoogleSignin.configure({
        offlineAccess: true,
        webClientId: '745881435955-t3rfj4acclp6vsj7l9hljjb3u1nq8s03.apps.googleusercontent.com',
        androidClientId: '745881435955-81sm47u7i9ikqfsd0omntcmnii89cjqt.apps.googleusercontent.com',
        scopes: ['profile', 'email']
    });
    return GoogleSignin.hasPlayServices()
        .then(() => GoogleSignin.signIn())
        .then(userInfo => {
            console.log(JSON.stringify(userInfo, null, 2));
            return callSocialSignin('google', userInfo.idToken)
        })
        .catch(error => {
            console.log(error);
        })
}

function callSocialSignin(type, token) {
    return axios.post('/customer/signin-social', {type, token})
        .then(({data}) => {
            return data;
        });
}

export function signout() {
    return axios.post('/customer/signout')
        .then(({data}) => {
            return data;
        });
}

export function getInfo() {
    return axios.get(`/customer/info?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function recoverPassword(params) {
    return axios.post('/customer/recover-password', params)
        .then(({data}) => {
            return data;
        });
}

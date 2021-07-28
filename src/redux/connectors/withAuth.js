import {connect} from 'react-redux';
import {
    init,
    login,
    loginWith,
    setInitialized,
    logout,
    reloadUserInfo,
} from '../actions/authActions'

const mapStateToProps = state => {
    let {token, user, initialized, error, loggedIn} = state.auth;
    return {
        authToken: token,
        authUser: user,
        authInitialized: initialized,
        authError: error,
        authLoggedIn: loggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authInit: () => dispatch(init()),
        authSetInitialized: isInitialized => dispatch(setInitialized(isInitialized)),
        authLogin: (email, password) => dispatch(login(email, password)),
        authLoginWith: (token, user) => dispatch(loginWith(token, user)),
        authLogout: () => dispatch(logout()),
        authReloadUser: () => dispatch(reloadUserInfo()),
    }
}

const connectToAuth = connect(mapStateToProps, mapDispatchToProps);

const withAuth = (component) => connectToAuth(component);

export default withAuth;

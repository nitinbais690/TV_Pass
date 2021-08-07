import React from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export interface GoogleSigninInfo {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    error?: string;
    isSignedIn: boolean;
    isAuthorizing: boolean;
}

const initialState: GoogleSigninInfo = {
    isSignedIn: false,
    isAuthorizing: false,
};

const useGoogleSignin = () => {
    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case 'signin_init':
                return {
                    ...prevState,
                    isAuthorizing: true,
                };
            case 'signin_success':
                return {
                    ...prevState,
                    id: action.userInfo.user.id,
                    email: action.userInfo.user.email,
                    firstName: action.userInfo.user.familyName,
                    lastName: action.userInfo.user.givenName,
                    token: action.userInfo.idToken,
                    isSignedIn: true,
                    isAuthorizing: false,
                    error: '',
                };
            case 'signin_error':
                return {
                    ...prevState,
                    isSignedIn: false,
                    isAuthorizing: false,
                    error: action.message,
                };
        }
    }, initialState);

    const initSignin = () => {
        dispatch({ type: 'signin_init' });
    };

    React.useEffect(() => {
        GoogleSignin.configure({
            webClientId: '347719164292-1nedhkt35286tfu9m7o6ug8c3rl267b1.apps.googleusercontent.com',
        });
    }, []);

    React.useEffect(() => {
        const signin = async () => {
            try {
                await GoogleSignin.hasPlayServices();
                const userInfo = await GoogleSignin.signIn();
                dispatch({ type: 'signin_success', userInfo: userInfo });
            } catch (error) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // user cancelled the login flow
                    dispatch({ type: 'signin_error', message: 'Unable to signin, try again' });
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // operation (e.g. sign in) is in progress already
                    dispatch({ type: 'signin_error', message: 'Signin in progess' });
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // play services not available or outdated
                    dispatch({ type: 'signin_error', message: 'Google services outdated or unavailable' });
                } else {
                    // some other error happened
                    dispatch({ type: 'signin_error', message: 'Unexpected error' });
                }
            }
        };

        state.isAuthorizing && signin();
    }, [state.isAuthorizing]);

    return [state, initSignin] as const;
};

export default useGoogleSignin;

import React from 'react';
import { LoginManager, Profile, Settings } from 'react-native-fbsdk-next';

export interface FacebookSigninInfo {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    error?: string;
    isSignedIn: boolean;
    isAuthorizing: boolean;
}

const initialState: FacebookSigninInfo = {
    isSignedIn: false,
    isAuthorizing: false,
};

const useFacebookSignin = () => {
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
                    id: action.userInfo.userID,
                    email: action.userInfo.email,
                    firstName: action.userInfo.familyName,
                    lastName: action.userInfo.lastName,
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
        // Ask for consent first if necessary
        // Possibly only do this for iOS if no need to handle a GDPR-type flow
        Settings.initializeSDK();
    }, []);

    React.useEffect(() => {
        const getCurrentProfile = () => {
            Profile.getCurrentProfile().then(profile => {
                if (profile) {
                    dispatch({ type: 'signin_success', userInfo: profile });
                }
            });
        };

        const signin = () => {
            LoginManager.logInWithPermissions(['public_profile']).then(
                result => {
                    if (result.isCancelled) {
                        dispatch({ type: 'signin_error', message: 'Unable to signin, try again' });
                        return;
                    }

                    getCurrentProfile();
                },
                error => {
                    console.log(error);
                    dispatch({ type: 'signin_error', message: 'Unexpected error' });
                },
            );
        };

        state.isAuthorizing && signin();
    }, [state.isAuthorizing]);

    return [state, initSignin] as const;
};

export default useFacebookSignin;

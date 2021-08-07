import { AUTH_TYPES } from 'features/authentication/utils/auth-constants';
import React from 'react';
import MobileNumberAuthScreen from 'features/authentication/presentation/screens/MobileNumberAuthScreen';
import EmailAuthTemplate from '../email-auth/components/template/EmailAuthTemplate';

const SignInScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { signInType, screenType, email } = route.params;
    return getSignScreenview(signInType, screenType, email, navigation);
};

function getSignScreenview(signInType: string, screenType: string, email: string, navigation: any) {
    switch (signInType) {
        case AUTH_TYPES.EMAIL_SIGN_IN:
            return <EmailAuthTemplate navigation={navigation} screenType={screenType} email={email} />;

        case AUTH_TYPES.MOBILE_SIGN_IN:
            return <MobileNumberAuthScreen navigation={navigation} />;

        default:
            return <MobileNumberAuthScreen navigation={navigation} />;
    }
}

export default SignInScreen;

import React from 'react';
import { View, Text, Image } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import SocialLoginButton from 'core/presentation/components/atoms/SocialLoginButton';
import EmailIcon from 'assets/images/social-login-icons/email.svg';
import GoogleIcon from 'assets/images/social-login-icons/google.svg';
import { socialLoginFooter } from './style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { EMAIL_AUTH_CONSTANTS, AUTH_TYPES } from 'features/authentication/utils/auth-constants';
import useGoogleSignin from 'core/presentation/hooks/useGoogleSignin';
import useFacebookSignin from 'core/presentation/hooks/useFacebookSignin';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

export default function SocialLoginFooter(props: SocialLoginFooterProps) {
    const [googleUser, initGoogleSignin] = useGoogleSignin();
    const [facebookUser, initFacebookSignin] = useFacebookSignin();
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const navigation = useNavigation();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    let socialLoginFooterStyle = socialLoginFooter(appColors);

    const providerGoogle = 'google';
    const providerFacebook = 'facebook';

    const onGoogleSignin = () => {
        props.onSignProgress();
        initGoogleSignin();
    };

    React.useEffect(() => {
        if (!googleUser.isSignedIn && googleUser.error) {
            props.onSigninError(googleUser.error, providerGoogle);
        }

        if (googleUser.isSignedIn && googleUser.id) {
            props.onSigninSuccess(googleUser.id, providerGoogle);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [googleUser]);

    const onFacebookSignin = () => {
        props.onSignProgress();
        initFacebookSignin();
    };

    React.useEffect(() => {
        if (!facebookUser.isSignedIn && facebookUser.error) {
            props.onSigninError(facebookUser.error, providerFacebook);
        }

        if (facebookUser.isSignedIn && facebookUser.id) {
            props.onSigninSuccess(facebookUser.id, providerFacebook);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facebookUser]);

    return (
        <View style={socialLoginFooterStyle.container}>
            <Text style={socialLoginFooterStyle.footerText}>{strings['signin.footer.text']}</Text>
            <View style={socialLoginFooterStyle.socialLoginButtons}>
                <View
                    style={socialLoginFooterStyle.socialButtonStyle}
                    testID={AUTOMATION_TEST_ID.SOCIAL_BUTTON_EMAIL}
                    accessibilityLabel={AUTOMATION_TEST_ID.SOCIAL_BUTTON_EMAIL}>
                    <SocialLoginButton
                        title={strings['label.email']}
                        icon={<EmailIcon />}
                        onPress={() => {
                            navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
                                signInType: AUTH_TYPES.EMAIL_SIGN_IN,
                                screenType: EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN,
                            });
                        }}
                    />
                </View>
                <View
                    style={socialLoginFooterStyle.socialButtonStyle}
                    testID={AUTOMATION_TEST_ID.SOCIAL_BUTTON_FACEBOOK}
                    accessibilityLabel={AUTOMATION_TEST_ID.SOCIAL_BUTTON_FACEBOOK}>
                    <SocialLoginButton
                        title={strings['signin.social.facebook']}
                        icon={<Image source={require('assets/images/social-login-icons/facebook_logo.png')} />}
                        onPress={onFacebookSignin}
                    />
                </View>
                <View
                    style={socialLoginFooterStyle.socialButtonStyle}
                    testID={AUTOMATION_TEST_ID.SOCIAL_BUTTON_GOOGLE}
                    accessibilityLabel={AUTOMATION_TEST_ID.SOCIAL_BUTTON_GOOGLE}>
                    <SocialLoginButton
                        title={strings['signin.social.google']}
                        icon={<GoogleIcon />}
                        onPress={onGoogleSignin}
                    />
                </View>
            </View>
        </View>
    );
}

export interface SocialLoginFooterProps {
    onSignProgress: () => void;
    onSigninSuccess: (id: string, provider: string) => void;
    onSigninError: (error: string, provider: string) => void;
}

import React, { useState } from 'react';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View } from 'react-native';
import { defaultSigninTVStyle } from 'styles/Signin.style';
import { formStyle } from 'styles/Common.style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from 'screens/components/FocusButton';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import Iphone from '../../assets/images/iphone.svg';
import { BrandLogoTV } from '../screens/components/BrandLogo';
import { TouchableHighlight } from 'react-native-gesture-handler';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { useAlert } from 'contexts/AlertContext';
import ErrorMessageBox, { ErrorMessage } from 'screens/components/ErrorMessageBox';
import { useAuth } from 'contexts/AuthContextProvider';
import { tvPixelSizeForLayout } from '../../AppStyles';

const LoginScreenTV = ({ navigation }: { navigation: any }): JSX.Element => {
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);

    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const styles = defaultSigninTVStyle({ appColors, appPadding, isPortrait });
    const formStyles = formStyle({ appColors, appPadding, isPortrait });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const { Alert } = useAlert();
    const [submitError, setSubmitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });
    const userAction = useAuth();
    const { login } = userAction;

    /** HARDCODED FOR THE PURPOSE OF REDIRECTION TO BROWSE - TESTING PURPOSE */
    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        login({
            email: 'vv.demo22@gmail.com',
            password: 'FirstLight@123', //'Sandbox@123', //
            signedUpInSession: false,
            silentLogin: false,
        })
            .then(() => {
                navigation.navigate(NAVIGATION_TYPE.BROWSE);
            })
            .catch(err => {
                // Check if there is no account exist with given email, display alert for signup
                if (err === 'eV2327') {
                    Alert.alert(strings['signin.email_error_title'], strings['signin.email_error_msg'], [
                        {
                            text: strings['signup.title'],
                            onPress: () => navigation.push(NAVIGATION_TYPE.AUTH_SIGN_UP),
                        },
                        {
                            text: strings['signin.try_again'],
                            onPress: () => {},
                        },
                    ]);
                }
                setSubmitError({
                    displayError: true,
                    message: strings['signin.error.' + err] || strings['global.error.message'],
                });
                setIsSubmitLoading(false);
            });
    }

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                {/* Loading State */}
                {isSubmitLoading && <AppLoadingIndicator />}
                <View style={[formStyles.formContainer, styles.columnLeft]}>
                    <BrandLogoTV height={tvPixelSizeForLayout(80)} width={tvPixelSizeForLayout(425)} />
                    <View style={styles.formGroupTv}>
                        <View style={styles.titleContainerTV}>
                            <Text style={styles.titleLabelTVLogin}>{strings['signin.tv_title']}</Text>
                        </View>
                        <View style={styles.subscribeLabelTV}>
                            <Text style={styles.subscribeLabelText}>
                                {strings['signin.tv_description_1']}
                                <Text style={styles.subscribeSignupLabelText}>{strings['signin.tv_link']}</Text>
                                <Text style={styles.subscribeLabelText}>{strings['signin.tv_description_2']}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <FocusButton
                            hasTVPreferredFocus={true}
                            title={strings['main.refreshCode']}
                            onPress={() => handleSubmitCB()}
                            blockFocusDown={true}
                            blockFocusUp={true}
                            blockFocusRight={true}
                        />
                    </View>
                    {submitError && submitError.displayError && (
                        <View style={styles.errorMessageContainer}>
                            <ErrorMessageBox value={submitError && submitError.message} />
                        </View>
                    )}
                </View>
                <View style={styles.iphoneContainer}>
                    <Iphone height={tvPixelSizeForLayout(1250)} width={tvPixelSizeForLayout(621)} />
                    <TouchableHighlight
                        underlayColor={'green'}
                        activeOpacity={1.0}
                        style={styles.absoluteText}
                        onPress={() => {
                            console.log('FOCUSSED');
                        }}>
                        {/* <TextInput
                                value={"1 2 3 4 5"}
                                style={styles.activationText}
                            /> */}
                    </TouchableHighlight>
                </View>
            </View>
        </BackgroundGradient>
    );
};
export default LoginScreenTV;

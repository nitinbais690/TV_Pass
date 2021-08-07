import React from 'react';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AuthHomeScreen from '../Auth/AuthHomeScreen';
import SignInScreenTv from '../Auth/SignInScreenTv';
import SignUpScreen from '../Auth/SignUpScreen';
import ForgotPasswordScreen from '../Auth/forgotPassword/ForgotPasswordScreen';
import ForgotPasswordOtpScreen from '../Auth/forgotPassword/ForgotPasswordOtpScreen';
import { authHomeStyle, authStackScreenOptions } from '../../styles/AuthHome.style';
import { headerStyle } from '../../styles/Common.style';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import CloseIcon from 'assets/images/close.svg';
import { userProfileScreen } from '../settings/userProfileScreen';
import BrandLogo from 'core/presentation/components/atoms/BrandLogo';
import ProfileSelectionScreen from 'features/profile/presentation/profile-selection/screens';
import BackArrow from 'assets/images/back_arrow.svg';
import { appPadding, appPaddingValues } from 'core/styles/AppStyles';
import VerifyOTPScreen from 'features/authentication/presentation/screens/VerifyOTPScreen';
import ForgotPasswordResetScreen from 'features/forgot-password/presentation/screens/ForgotPasswordResetScreen';
import { AUTH_TYPES } from 'features/authentication/utils/auth-constants';
import SignInScreen from 'features/authentication/presentation/screens/SignInScreen';

const AuthStack = createStackNavigator();

export const LogInButton = (): JSX.Element => {
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const formStyles = authHomeStyle({ appColors });

    return (
        <View style={formStyles.help}>
            <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN)}>
                <Text style={formStyles.mainText}>{strings['main.login']}</Text>
            </TouchableOpacity>
        </View>
    );
};

const AuthStackScreen = () => {
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const { appNavigationState } = useAppState();

    return (
        <AuthStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerTitleAlign: 'center',
                headerBackTitle: '',
                headerBackTitleVisible: false,
                headerStyle: { shadowColor: 'transparent' },
            }}>
            <AuthStack.Screen
                name={NAVIGATION_TYPE.AUTH_SIGN_IN}
                options={
                    Platform.isTV
                        ? authStackScreenOptions()
                        : {
                              headerTransparent: true,
                              title: '',
                              headerLeft: () => (
                                  <BorderlessButton
                                      style={{ padding: appPaddingValues.sm }}
                                      onPress={() => {
                                          navigation.goBack();
                                      }}>
                                      <BackArrow />
                                  </BorderlessButton>
                              ),
                          }
                }
                component={Platform.isTV ? SignInScreenTv : SignInScreen}
                initialParams={{ signInType: AUTH_TYPES.MOBILE_SIGN_IN }}
            />
            <AuthStack.Screen
                name="VerifyOTP"
                options={
                    Platform.isTV
                        ? authStackScreenOptions()
                        : {
                              headerTransparent: true,
                              title: '',
                              headerLeft: () => (
                                  <BorderlessButton
                                      style={{ padding: appPaddingValues.sm }}
                                      onPress={() => {
                                          navigation.goBack();
                                      }}>
                                      <BackArrow />
                                  </BorderlessButton>
                              ),
                          }
                }
                component={Platform.isTV ? SignInScreenTv : VerifyOTPScreen}
            />
            <AuthStack.Screen name="Profile" component={userProfileScreen} options={authStackScreenOptions()} />
            <AuthStack.Screen
                name="AuthHome"
                options={{
                    title: '',
                    headerTitle: () => <BrandLogo />,
                    headerTransparent: false,
                    headerLeft: () => <LogInButton />,
                    headerRightContainerStyle: {
                        marginHorizontal: appPadding.sm(true),
                        marginBottom: 8,
                    },
                    headerRight: () => {
                        return appNavigationState === 'PREVIEW_APP' ? (
                            <BorderlessButton onPress={() => navigation.goBack()}>
                                <CloseIcon />
                            </BorderlessButton>
                        ) : null;
                    },
                }}
                component={AuthHomeScreen}
            />
            <AuthStack.Screen name="SignUp" options={authStackScreenOptions()} component={SignUpScreen} />
            <AuthStack.Screen
                name="ForgotPassword"
                options={{ title: strings['header.reset_pwd'] }}
                component={ForgotPasswordScreen}
            />
            <AuthStack.Screen
                name="ForgotPasswordOtp"
                options={{ title: strings['header.enter_code'] }}
                component={ForgotPasswordOtpScreen}
            />
            <AuthStack.Screen
                name={NAVIGATION_TYPE.PROFILE_SELECTION}
                component={ProfileSelectionScreen}
                options={{ headerShown: false }}
            />
            <AuthStack.Screen name={NAVIGATION_TYPE.AUTH_FORGOT_PASSWORD_RESET} component={ForgotPasswordResetScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthStackScreen;

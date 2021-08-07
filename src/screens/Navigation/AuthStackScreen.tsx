import React from 'react';
import { Platform, TouchableOpacity, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AuthHomeScreen from '../Auth/AuthHomeScreen';
import SignInScreen from '../Auth/SignInScreen';
import SignUpScreen from '../Auth/SignUpScreen';
import LoginScreenTV from '../../TV/LoginTV';
import ForgotPasswordScreen from '../Auth/forgotPassword/ForgotPasswordScreen';
import ForgotPasswordOtpScreen from '../Auth/forgotPassword/ForgotPasswordOtpScreen';
import ForgotPasswordResetScreen from '../Auth/forgotPassword/ForgotPasswordResetScreen';
import BrowseWebView from 'screens/components/BrowseWebView';
import HelpScreen from 'screens/HelpScreen';
import { authHomeStyle, authStackScreenOptions } from '../../styles/AuthHome.style';
import { headerStyle } from '../../styles/Common.style';
import { BrandLogo } from 'screens/components/BrandLogo';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import CloseIcon from '../../../assets/images/close.svg';
import { appPadding } from '../../../AppStyles';

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
                name="AuthHome"
                options={{
                    headerShown: !Platform.isTV,
                    title: '',
                    headerTitle: () => <BrandLogo />,
                    headerTransparent: false,
                    headerLeft: () => <LogInButton />,
                    headerRightContainerStyle: {
                        marginHorizontal: appPadding.sm(true),
                        marginBottom: 8,
                    },
                    headerRight: () => {
                        return (
                            appNavigationState === 'PREVIEW_APP' && (
                                <BorderlessButton onPress={() => navigation.goBack()}>
                                    <CloseIcon />
                                </BorderlessButton>
                            )
                        );
                        // : (
                        //     <LogInButton />
                        // );
                    },
                }}
                component={AuthHomeScreen}
            />
            <AuthStack.Screen name="SignIn" options={authStackScreenOptions()} component={SignInScreen} />
            <AuthStack.Screen name="LoginTV" options={{ headerShown: !Platform.isTV }} component={LoginScreenTV} />
            <AuthStack.Screen
                name="SignUp"
                options={{
                    headerShown: !Platform.isTV,
                    headerTransparent: true,
                    headerTitle: () => <BrandLogo />,
                    headerStyle: {
                        shadowColor: 'transparent',
                        shadowOffset: { height: 0, width: 0 },
                        borderBottomWidth: 0,
                        shadowOpacity: 0,
                        borderBottomColor: 'transparent',
                    },
                }}
                component={SignUpScreen}
            />
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
                name="ForgotPasswordReset"
                options={{ title: strings['header.reset_pwd'] }}
                component={ForgotPasswordResetScreen}
            />
            <AuthStack.Screen
                name={NAVIGATION_TYPE.HELP}
                component={HelpScreen}
                options={{
                    title: strings['settingsScreenKey.Help'],
                    headerTransparent: true,
                }}
            />
            <AuthStack.Screen
                name={NAVIGATION_TYPE.BROWSE_WEBVIEW}
                component={BrowseWebView}
                options={({ route }) => ({
                    title: route.params && route.params.type ? strings['title.' + route.params.type] : '',
                })}
            />
        </AuthStack.Navigator>
    );
};

export default AuthStackScreen;

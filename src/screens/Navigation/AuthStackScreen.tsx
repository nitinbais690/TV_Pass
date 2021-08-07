import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import AuthHomeScreen from '../Auth/AuthHomeScreen';
import SignInScreen from '../Auth/SignInScreen';
import SignUpScreen from '../Auth/SignUpScreen';
import PlanInfoScreen from '../Auth/PlanInfoScreen';
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
import { selectDeviceType } from 'components/qp-common-ui';
import CreditsIcon from '../../../assets/images/brand_symbol.svg';
import { ActionEvents, Attributes } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';

const AuthStack = createStackNavigator();

export const LogInButton = (): JSX.Element => {
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const formStyles = authHomeStyle({ appColors });
    const { recordEvent } = useAnalytics();

    return (
        <View style={formStyles.help}>
            <TouchableOpacity
                onPress={() => {
                    let data: Attributes = {};
                    data.event = ActionEvents.ACTION_LOGIN;
                    recordEvent(ActionEvents.ACTION_LOGIN, data);
                    navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN);
                }}>
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
                    title: '',
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <CreditsIcon width={20} height={selectDeviceType({ Handset: 18 }, 28)} />
                            <View style={{ marginRight: 7 }} />
                            <BrandLogo />
                        </View>
                    ),
                    headerTransparent: false,
                    // headerLeft: () => <LogInButton />,
                    headerRightContainerStyle: {
                        marginHorizontal: appPadding.sm(true),
                        marginBottom: 8,
                    },
                    headerRight: () => {
                        return appNavigationState === 'PREVIEW_APP' ? (
                            <BorderlessButton onPress={() => navigation.goBack()}>
                                <CloseIcon accessible accessibilityLabel={'Close'} />
                            </BorderlessButton>
                        ) : (
                            <LogInButton />
                        );
                    },
                }}
                component={AuthHomeScreen}
            />
            <AuthStack.Screen name="SignIn" options={authStackScreenOptions()} component={SignInScreen} />
            <AuthStack.Screen name="SignUp" options={authStackScreenOptions()} component={SignUpScreen} />
            <AuthStack.Screen name="PlanInfo" options={authStackScreenOptions()} component={PlanInfoScreen} />
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

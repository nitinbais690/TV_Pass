import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import ContinueSubscriptionScreen from '../Errors/ContinueSubscriptionScreen';
import PurchaseSubscribtionScreen from 'screens/PurchaseSubscribtionScreen';
import PurchaseConfirmationScreen from 'screens/PurchaseConfirmationScreen';
import { UserProfile } from 'screens/settings/UserProfile';
import { NAVIGATION_TYPE } from './NavigationConstants';
import { appPadding, appFonts } from '../../../AppStyles';
import BrandLogo from 'core/presentation/components/atoms/BrandLogo';

export const LogOutButton = (): JSX.Element => {
    const { logout } = useAuth();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = StyleSheet.create({
        container: {
            marginHorizontal: appPadding.sm(true),
        },
        text: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => logout()}>
                <Text style={styles.text}>{strings.continue_logout_btn_label}</Text>
            </TouchableOpacity>
        </View>
    );
};

const SubscriptionStack = createStackNavigator();
const SubscriptionStackScreen = () => {
    const { signedUpInSession } = useAppState();
    const initialRouteName = signedUpInSession ? NAVIGATION_TYPE.PURCHASE_SUBSCRIPTION : undefined;

    return (
        <SubscriptionStack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerBackTitleVisible: false,
                headerTransparent: true,
                headerStyle: { shadowColor: 'transparent' },
            }}>
            <SubscriptionStack.Screen
                name={NAVIGATION_TYPE.CONTINUE_SUBSCRIPTION}
                options={{
                    title: '',
                    headerTitle: () => <BrandLogo />,
                    headerLeft: () => <LogOutButton />,
                }}
                component={ContinueSubscriptionScreen}
            />
            <SubscriptionStack.Screen
                name={NAVIGATION_TYPE.PURCHASE_SUBSCRIPTION}
                options={{ title: '' }}
                component={PurchaseSubscribtionScreen}
            />
            <SubscriptionStack.Screen
                name={NAVIGATION_TYPE.PURCHASE_CONFIRMATION}
                options={{
                    title: '',
                    headerTitle: () => <BrandLogo />,
                    gestureEnabled: false,
                    headerLeft: () => {
                        // We should not allow users to go back to purchase screen
                        // after a successful transaction, hence disabling back navigation here
                        return null;
                    },
                }}
                component={PurchaseConfirmationScreen}
            />
            <SubscriptionStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ title: '', headerTitle: () => <BrandLogo />, headerTransparent: false }}
            />
        </SubscriptionStack.Navigator>
    );
};

export default SubscriptionStackScreen;

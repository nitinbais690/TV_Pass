import React from 'react';
import { useLocalization } from 'contexts/LocalizationContext';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import SecondaryButton from 'core/presentation/components/atoms/SecondaryButton';
import { View, Text } from 'react-native';
import { useAuth } from 'contexts/AuthContextProvider';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import MenuFooterViewStyle from './style';
import DeviceInfo from 'react-native-device-info';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useNavigation } from '@react-navigation/native';
import { EMAIL_AUTH_CONSTANTS, AUTH_TYPES } from 'features/authentication/utils/auth-constants';
import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';

/*
   Renders Menu Footer view - buttons with app version
 */
export function MenuFooterView() {
    const { strings }: any = useLocalization();
    const styles = MenuFooterViewStyle(useAppColors());
    const navigation = useNavigation();

    const readableVersion = DeviceInfo.getReadableVersion();
    const { userType } = useAuth();
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';
    return (
        <View style={styles.container}>
            {!isLoggedIn && (
                <SecondaryButton
                    containerStyle={[styles.buttonStyle, styles.marginBottom13]}
                    title={strings.menu_sign_in_btn_label}
                    onPress={() => {
                        navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
                            signInType: AUTH_TYPES.EMAIL_SIGN_IN,
                            screenType: EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN,
                        });
                    }}
                    secondaryTestID={AUTOMATION_TEST_ID.SIGN_IN_BUTTON}
                    secondaryAccessibilityLabel={AUTOMATION_TEST_ID.SIGN_IN_BUTTON}
                />
            )}
            <PrimaryButton
                containerStyle={styles.buttonStyle}
                title={strings.menu_subscribe_now_btn_label}
                onPress={() => {}}
                primaryTestID={AUTOMATION_TEST_ID.SUBSCRIBE_NOW_BUTTON}
                primaryAccessibilityLabel={AUTOMATION_TEST_ID.SUBSCRIBE_NOW_BUTTON}
            />

            <Text style={styles.versionTextStyle}>
                {strings['settings.version']} {readableVersion}
            </Text>
        </View>
    );
}

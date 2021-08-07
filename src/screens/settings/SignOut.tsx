import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';
import SignoutIcon from '../../../assets/images/signout_tv.svg';
import FocusButton from 'screens/components/FocusButton';
import { useAlert } from 'contexts/AlertContext';

/**
 * A component to display the settings/SignOut screen.
 */
const SignOut = (): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const { strings } = useLocalization();
    let { appColors } = appTheme && appTheme(prefs);
    const userAction = useAuth();
    const { Alert, dismiss } = useAlert();
    const { accountProfile, logout } = userAction;
    const { recordEvent } = useAnalytics();

    const defaultStyles = StyleSheet.create({
        iconContainer: {
            borderRadius: 4,
            height: tvPixelSizeForLayout(100),
            width: tvPixelSizeForLayout(100),
            backgroundColor: appColors.iconBackgroundTv,
            padding: tvPixelSizeForLayout(10),
        },
        signedOutHeading: {
            paddingVertical: tvPixelSizeForLayout(50),
            color: appColors.secondary,
            fontSize: tvPixelSizeForLayout(75),
            fontFamily: appFonts.semibold,
            fontWeight: '600',
        },
        signInEmail: {
            color: appColors.secondary,
            fontSize: tvPixelSizeForLayout(45),
            fontFamily: appFonts.semibold,
            fontWeight: '600',
            textTransform: 'lowercase',
        },
        buttonStyle: {
            marginTop: tvPixelSizeForLayout(80),
            width: tvPixelSizeForLayout(296),
            backgroundColor: appColors.brandTint,
        },
    });

    return (
        <>
            <SignoutIcon width={tvPixelSizeForLayout(100)} height={tvPixelSizeForLayout(100)} />
            <Text style={defaultStyles.signedOutHeading}>{strings['SignOut.Signed_into']}</Text>
            <Text style={defaultStyles.signInEmail}>
                {accountProfile && accountProfile.contactMessage.length > 0 && accountProfile.contactMessage[0].email}
            </Text>
            <FocusButton
                title={strings['settingsScreenKey.Logout']}
                unFocuseTitleColor={appColors.secondary}
                containerStyle={defaultStyles.buttonStyle}
                onPress={() => {
                    Alert.alert(
                        strings['global.exit_app'],
                        undefined,
                        [
                            {
                                text: strings['global.yes_sure'],
                                onPress: () => {
                                    logout().then(() => {
                                        recordEvent(AppEvents.LOGOUT);
                                    });
                                },
                            },
                            {
                                text: strings['global.no'],
                                onPress: dismiss,
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false },
                    );
                }}
            />
        </>
    );
};

export default SignOut;

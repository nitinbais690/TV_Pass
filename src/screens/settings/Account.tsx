import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import AccountIcon from '../../../assets/images/account_tv.svg';

/**
 * A component to display the settings/Account screen.
 */
const Account = (): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const { strings } = useLocalization();
    let { appColors } = appTheme && appTheme(prefs);

    const defaultStyles = StyleSheet.create({
        creditIcon: { opacity: 0.5, paddingVertical: tvPixelSizeForLayout(10) },
        subscriptionHeading: {
            paddingTop: tvPixelSizeForLayout(40),
            color: appColors.secondary,
            fontSize: tvPixelSizeForLayout(75),
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
        subscriptionDescription: {
            paddingTop: tvPixelSizeForLayout(40),
            color: appColors.tertiary,
            fontSize: tvPixelSizeForLayout(32),
            fontFamily: appFonts.primary,
        },
    });

    return (
        <>
            <AccountIcon width={tvPixelSizeForLayout(120)} height={tvPixelSizeForLayout(77)} />
            <Text style={defaultStyles.subscriptionHeading}>{strings['Account.SubscriptionHeadingTv']}</Text>
            <Text style={defaultStyles.subscriptionDescription}>{strings['Account.SubscriptionDescriptionTV']}</Text>
        </>
    );
};

export default Account;

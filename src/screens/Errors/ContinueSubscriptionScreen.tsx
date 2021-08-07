import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useIAPState } from 'utils/IAPContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from '../components/Button';
import { routeToPurchaseConfirmation } from 'utils/NavigationUtils';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { appDimensions, appFonts } from '../../../AppStyles';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

const ContinueSubscriptionScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const { product, transactionSuccess } = useIAPState();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    let imageUrl = prefs.appConfig && prefs.appConfig.continueSubscriptionImageUrl;
    const { resetContext } = useIAPState();
    const { accountProfile } = useAuth();
    const isPortrait = height > width;

    const verticalPadding = 25;

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: selectDeviceType(
                { Tablet: isPortrait ? appPadding.md(true) : '25%' },
                appPadding.md(true),
            ),
            marginVertical: 0,
        },
        contentContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonWrapper: {
            alignSelf: selectDeviceType({ Tablet: 'auto' }, 'stretch'),
            marginVertical: verticalPadding,
            marginTop: 40,
        },
        title: {
            color: appColors.secondary,
            fontSize: appFonts.xlg,
            fontFamily: appFonts.light,
            textAlign: 'center',
        },
        subhead: {
            color: appColors.caption,
            marginTop: verticalPadding,
            fontSize: appFonts.sm,
            fontFamily: appFonts.primary,
            textAlign: 'center',
        },
        tagline: {
            color: appColors.tertiary,
            fontSize: appFonts.sm,
            fontFamily: appFonts.primary,
            textAlign: 'center',
        },
        serviceImageWrapper: {
            width: '100%',
            aspectRatio: 16 / 9,
            flexShrink: 1,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: appDimensions.cardRadius,
            overflow: 'hidden',
            marginVertical: verticalPadding,
        },
        serviceImage: { width: '100%', height: '100%' },
        logout: { alignSelf: 'flex-end', margin: appPadding.sm(true) },
        logoutText: {
            color: appColors.tertiary,
            fontSize: appFonts.sm,
            fontFamily: appFonts.primary,
        },
    });

    let message = strings['continue_sub.complete_sub_text'];
    // Note: If the user already had a subscription and if the subscrption has expired,
    // we want to message them to re-subscribe, this is needed until we go live,
    // since IAP is limited to 5 renewals in Sandbox/Prod Sandbox env
    if (accountProfile && accountProfile.neverSubscribed === false) {
        message = strings['continue_sub.existing_sub.err_msg'];
    }

    useEffect(() => {
        if (product !== undefined && transactionSuccess === true) {
            routeToPurchaseConfirmation({ subscription: product, navigation });
        }
    }, [navigation, product, transactionSuccess]);

    return (
        <BackgroundGradient>
            <SafeAreaView style={style.container}>
                <View style={style.contentContainer}>
                    <View style={style.serviceImageWrapper}>
                        <Image style={style.serviceImage} source={{ uri: imageUrl }} />
                    </View>
                    <Text style={style.title}>{strings['continue_sub.err_msg']}</Text>
                    <Text style={style.subhead}>{message}</Text>
                    {/*  */}
                    <View style={style.buttonWrapper}>
                        <Button
                            raised
                            title={strings['continue_sub.continue_btn_label']}
                            onPress={() => {
                                resetContext();
                                navigation.navigate(NAVIGATION_TYPE.PURCHASE_SUBSCRIPTION);
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </BackgroundGradient>
    );
};

export default ContinueSubscriptionScreen;

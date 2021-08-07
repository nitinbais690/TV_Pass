import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppState } from 'utils/AppContextProvider';
import { AccountProfile } from 'utils/EvergentAPIUtil';
import Button from './components/Button';
import BackgroundGradient from './components/BackgroundGradient';
import { appFonts } from '../../AppStyles';
import CreditsIcon from '../../assets/images/credits_large.svg';
import Ticker from 'react-native-ticker';
import { useIAPState } from 'utils/IAPContextProvider';

const emailFromAccount = (accountProfile?: AccountProfile) => {
    if (accountProfile && accountProfile.contactMessage && accountProfile.contactMessage.length) {
        return accountProfile.contactMessage[0].email;
    }
    return '';
};

const CreditPill = ({ creditPoints }: { creditPoints: number }) => {
    const prefs = useAppPreferencesState();
    const shadowRadius = useRef(new Animated.Value(0)).current;
    let { appColors } = prefs.appTheme!(prefs);

    useEffect(() => {
        Animated.timing(shadowRadius, {
            delay: 200,
            toValue: 60,
            duration: 500,
            useNativeDriver: true,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const style = StyleSheet.create({
        pillContainer: {
            backgroundColor: appColors.brandTint,
            borderRadius: 80,
            padding: 5,
            marginRight: 20,
            shadowOpacity: 1.0,
            shadowColor: appColors.brandTint,
        },
        pillWrapper: {
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 15,
            alignItems: 'center',
        },
        pillText: {
            color: appColors.secondary,
            fontFamily: appFonts.semibold,
            fontSize: 65,
            fontWeight: '500',
            marginLeft: 5,
        },
        symbolText: {
            color: appColors.brandTint,
            fontFamily: appFonts.semibold,
            fontSize: 65,
            fontWeight: '500',
            marginRight: 20,
        },
        credits: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={style.credits}>
            <Text style={style.symbolText}>+</Text>
            <Animated.View style={[style.pillContainer, { shadowRadius }]}>
                <View style={style.pillWrapper}>
                    <CreditsIcon />
                    <Ticker textStyle={style.pillText}>{creditPoints}</Ticker>
                </View>
            </Animated.View>
        </View>
    );
};

const PurchaseConfirmationScreen = ({ navigation, route }: { navigation: any; route: any }): JSX.Element => {
    const insets = useSafeArea();
    const { width, height } = useDimensions().window;
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { accountProfile } = useAuth();
    const { triggerSubscribedFlow } = useAppState();
    const email = emailFromAccount(accountProfile);
    const { price, currencyCode, creditPoints } = route.params;

    const isPortrait = height > width;

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: selectDeviceType(
                { Tablet: isPortrait ? appPadding.lg(true) : '25%' },
                appPadding.md(true),
            ),
            paddingVertical: isPortrait ? 10 : 0,
        },
        emailText: {
            color: appColors.brandTint,
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
            textTransform: 'lowercase',
        },
        title: {
            color: appColors.secondary,
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
            marginVertical: 25,
        },
        confirmMessage: {
            color: appColors.secondary,
            marginVertical: 25,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
        },
        mailHeaderText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
        },
        buttonWrapper: {
            alignSelf: selectDeviceType({ Tablet: 'auto' }, 'stretch'),
            marginBottom: insets.bottom + selectDeviceType({ Tablet: 60 }, 25),
        },
    });

    const existingSubscriber = accountProfile && accountProfile.neverSubscribed === false;

    const { resetTransaction } = useIAPState();
    useEffect(() => {
        resetTransaction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BackgroundGradient style={style.container}>
            <Text style={style.title}>{strings['header.subs_confirm']}</Text>
            <Text style={style.mailHeaderText}>{strings['purchase_confirmation.email_label']}</Text>
            <Text style={style.emailText}>{email}</Text>
            <CreditPill creditPoints={creditPoints} />
            <Text style={style.confirmMessage}>
                {strings.formatString(
                    strings['purchase_confirmation.confirmation_message'],
                    creditPoints,
                    currencyCode,
                    price,
                )}
            </Text>
            <View style={style.buttonWrapper}>
                <Button
                    raised
                    title={
                        existingSubscriber ? strings['global.continue_btn'] : strings['create_profile.profile_button']
                    }
                    onPress={() => {
                        // If an existing subscriber, directly launch the browse experience
                        if (existingSubscriber) {
                            triggerSubscribedFlow();
                        } else {
                            navigation.navigate('UserProfile');
                        }
                    }}
                />
            </View>
        </BackgroundGradient>
    );
};

export default PurchaseConfirmationScreen;

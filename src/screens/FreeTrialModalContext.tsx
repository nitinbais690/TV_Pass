import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../AppStyles';
import Button from './components/Button';

//trialEnd is true sends the message for free trial has ended and Paid subscription has started
//trialEnd is false sends the message for the freee trial is about to end
const FreeTrialModalContext = ({ trialEnd, onPress }: { trialEnd: boolean; onPress(): void }) => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    let { appColors } = prefs.appTheme!(prefs);
    const isPortrait = height > width;
    const message = trialEnd ? strings['notifier.subscriptionStarted'] : strings['notifier.trialEnd'];

    const styles = StyleSheet.create({
        content: {
            backgroundColor: appColors.primaryVariant1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '20%' : '25%' }, '0%'),
            padding: selectDeviceType({ Tablet: 40 }, 30),
        },
        logo: {
            height: 40,
            resizeMode: 'contain',
        },
        tagline: {
            color: appColors.secondary,
            marginVertical: 20,
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
        },
        ctaContainer: {
            width: '100%',
        },
        button: {
            marginTop: 20,
        },
    });

    return (
        <View style={styles.content}>
            <Image source={require('../../assets/images/brand_logo.png')} style={styles.logo} />
            <Text style={styles.tagline}>{message}</Text>
            <View style={styles.ctaContainer}>
                <Button
                    title={strings['notifier.acknowledgement']}
                    raised={false}
                    containerStyle={styles.button}
                    onPress={onPress}
                />
            </View>
        </View>
    );
};

export default FreeTrialModalContext;

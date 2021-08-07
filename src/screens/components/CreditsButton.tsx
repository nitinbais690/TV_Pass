import React from 'react';
import { AccessibilityProps, View, ActivityIndicator, StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Ticker from 'react-native-ticker';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useAppPreview } from 'contexts/AppPreviewContextProvider';
import { useOnboarding } from 'contexts/OnboardingContext';
import { appFonts } from '../../../AppStyles';
import CreditsIcon from '../../../assets/images/credits.svg';

export interface CreditsButtonProps extends AccessibilityProps {
    onPress?: (pointerInside: boolean) => void;
}

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.credits === nextProps.credits && prevProps.loading === nextProps.loading;
};

export const CreditsUIButton = React.memo(
    ({
        loading,
        credits,
        onPress,
    }: {
        loading: boolean;
        credits: number | null;
        onPress?: (pointerInside: boolean) => void;
    }) => {
        const prefs = useAppPreferencesState();
        const { appTheme } = prefs;
        let { appColors } = appTheme && appTheme(prefs);

        const styles = StyleSheet.create({
            container: {},
            textWrapper: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: appColors.brandTint,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 12,
                height: 40,
            },
            pillWrapper: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
            tickerWrapper: { marginHorizontal: 5 },
            tickerText: {
                textAlign: 'center',
                fontSize: appFonts.xs,
                color: appColors.secondary,
                fontWeight: '500',
            },
            loading: { margin: 8 },
        });

        return (
            <BorderlessButton onPress={onPress} style={styles.container} activeOpacity={0.8}>
                <View style={styles.textWrapper}>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} />
                    ) : (
                        <View style={styles.pillWrapper}>
                            <CreditsIcon />
                            <View style={styles.tickerWrapper}>
                                <Ticker textStyle={styles.tickerText}>{credits}</Ticker>
                            </View>
                        </View>
                    )}
                </View>
            </BorderlessButton>
        );
    },
    propsAreEqual,
);

export const CreditsButton = React.memo((props: CreditsButtonProps) => {
    const { loading, credits } = useCredits();
    const { isModalVisible: inOnboardingFlow } = useOnboarding();
    const previewMode = useAppPreview();

    return (
        <View style={{ opacity: inOnboardingFlow ? 0 : undefined }}>
            <CreditsUIButton loading={previewMode ? false : loading} credits={credits} onPress={props.onPress} />
        </View>
    );
});

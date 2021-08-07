import React, { useEffect, useRef } from 'react';
import { AccessibilityProps, View, ActivityIndicator, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import Ticker from 'react-native-ticker';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useOnboarding } from 'contexts/OnboardingContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import CreditsIcon from '../../../assets/images/credits.svg';
import { useAppState } from 'utils/AppContextProvider';

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
            textWrapperTv: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                backgroundColor: appColors.brandTint,
                borderTopRightRadius: tvPixelSizeForLayout(110),
                borderBottomRightRadius: tvPixelSizeForLayout(110),
                paddingHorizontal: tvPixelSizeForLayout(23),
                height: tvPixelSizeForLayout(80),
            },
            pillWrapper: {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            },
            tickerWrapper: { marginHorizontal: Platform.isTV ? tvPixelSizeForLayout(3) : 5 },
            tickerText: {
                textAlign: 'center',
                fontSize: Platform.isTV ? tvPixelSizeForLayout(28) : appFonts.xs,
                color: appColors.secondary,
                fontWeight: '500',
            },
            loading: { margin: 8 },
        });

        return (
            <BorderlessButton onPress={onPress} style={styles.container} activeOpacity={0.8}>
                <View style={[Platform.isTV ? styles.textWrapperTv : styles.textWrapper]}>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} />
                    ) : (
                        <View style={styles.pillWrapper}>
                            {Platform.isTV ? (
                                <CreditsIcon width={tvPixelSizeForLayout(24)} height={tvPixelSizeForLayout(24)} />
                            ) : (
                                <CreditsIcon />
                            )}
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
    let { loading, credits } = useCredits();
    const { isModalVisible: inOnboardingFlow } = useOnboarding();
    const enterAnimValue = useRef(new Animated.Value(0)).current;
    const route = useRoute();
    const { appNavigationState } = useAppState();
    if (appNavigationState === 'PREVIEW_APP') {
        credits = 0;
        loading = false;
    }

    useEffect(() => {
        if (!loading) {
            Animated.timing(enterAnimValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const transformStyle =
        route.name === 'Browse'
            ? enterAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0], // 0 : 150, 0.5 : 75, 1 : 0
              })
            : 0;

    return (
        <Animated.View
            style={{
                opacity: inOnboardingFlow ? 0 : undefined,
                transform: [
                    {
                        translateX: transformStyle,
                    },
                ],
            }}>
            <CreditsUIButton loading={loading} credits={credits} onPress={props.onPress} />
        </Animated.View>
    );
});

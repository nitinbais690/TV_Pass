import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, Easing, UIManager } from 'react-native';
import RNSplashScreen from 'react-native-splash-screen';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';
import { TimerType, useTimer } from 'utils/TimerContext';
import { useAppState } from 'utils/AppContextProvider';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const SplashScreen = (): JSX.Element => {
    const { splashLoaded } = useAppState();
    const { Alert } = useAlert();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { error, retry, appConfig } = prefs;
    const { recordErrorEvent } = useAnalytics();
    const { stopTimer } = useTimer();

    const animatedValue = useRef(new Animated.Value(0)).current;
    const backgroundOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const animatedLogoStyle = {
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
        transform: [
            {
                scaleX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                }),
            },
            {
                scaleY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                }),
            },
        ],
    };

    useEffect(() => {
        if (!(Platform.OS === 'ios' && Platform.isTVOS)) {
            RNSplashScreen.hide();
        }

        Animated.timing(animatedValue, {
            delay: 300,
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
            easing: Easing.elastic(1),
        }).start(() => splashLoaded());

        return () => {
            stopTimer(TimerType.Splash);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoContainer: {
            alignSelf: 'stretch',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: '100%',
            aspectRatio: 1.488,
        },
        loading: { justifyContent: 'center', position: 'absolute', top: '8%' },
    });

    useEffect(() => {
        if (error) {
            recordErrorEvent(ErrorEvents.SPLASH_ERROR, condenseErrorObject(error));
            Alert.alert(
                strings['global.general_error_msg'],
                undefined,
                [{ text: strings['global.retry_btn'], onPress: () => retry() }],
                {
                    cancelable: false,
                },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, retry, strings]);

    const logoSource = require('../../assets/images/aha_logo.png');

    return (
        <View style={style.logoContainer}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: backgroundOpacity }]}>
                <BackgroundGradient style={[style.container]} insetHeader={false} />
            </Animated.View>
            {appConfig && (
                <Animated.Image
                    source={logoSource}
                    style={[{ width: 70, height: 32, resizeMode: 'contain' }, animatedLogoStyle]}
                />
            )}
        </View>
    );
};

export default React.memo(SplashScreen, () => true);

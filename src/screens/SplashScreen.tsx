import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Animated, LayoutAnimation } from 'react-native';
import RNSplashScreen from 'react-native-splash-screen';
import LottieView from 'lottie-react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import {
    Attributes,
    condenseErrorObject,
    ErrorEvents,
    getPageEventFromPageNavigation,
    getPageIdsFromPageEvents,
} from 'utils/ReportingUtils';
import { TimerType, useTimer } from 'utils/TimerContext';
import { useAppState } from 'utils/AppContextProvider';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import Sound from 'react-native-sound';
import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';

const SplashScreen = (): JSX.Element => {
    const { splashLoaded } = useAppState();
    const { Alert } = useAlert();
    const { recordEvent } = useAnalytics();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { error, retry, appConfig } = prefs;
    const { recordErrorEvent } = useAnalytics();
    const { stopTimer } = useTimer();

    const opacity = useRef(new Animated.Value(0)).current;
    const backgroundOpacity = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    useEffect(() => {
        if (!(Platform.OS === 'ios' && Platform.isTVOS)) {
            RNSplashScreen.hide();
        }

        let data: Attributes = {};

        let pageEvents = getPageEventFromPageNavigation(NAVIGATION_TYPE.LOADING);
        data.pageID = getPageIdsFromPageEvents(pageEvents);
        data.event = pageEvents;

        recordEvent(pageEvents, data);

        Animated.timing(opacity, {
            delay: 2000,
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        if (appConfig) {
            handleSound();
        }

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

    const handleSound = () => {
        Sound.setCategory('Playback');
        var whoosh = new Sound('Struum_Intro_Sound_Long.wav', Sound.MAIN_BUNDLE, error => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // Play the sound with an onEnd callback
            whoosh.play(success => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        whoosh.release();
    };

    return (
        <View style={style.logoContainer}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: backgroundOpacity }]}>
                <BackgroundGradient style={[style.container]} insetHeader={false} />
            </Animated.View>
            {appConfig && (
                <LottieView
                    source={require('../../assets/animations/logoAnimations/Struum_LogoBuild.json')}
                    autoPlay
                    loop={false}
                    imageAssetsFolder={'logoAnimations'}
                    onAnimationFinish={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                        splashLoaded();
                    }}
                />
            )}
        </View>
    );
};

export default React.memo(SplashScreen, () => true);

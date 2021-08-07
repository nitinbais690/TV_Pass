import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, LayoutAnimation, Platform } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';
import { TimerType, useTimer } from 'utils/TimerContext';
import { useAppState } from 'utils/AppContextProvider';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import SplashScreenm from 'react-native-splash-screen';
import Video from 'react-native-video';

const SplashScreen = (): JSX.Element => {
    const { splashLoaded } = useAppState();
    const { Alert } = useAlert();
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
        // const RNSplashScreen = require('react-native-splash-screen');
        SplashScreenm.hide();
        //if (Platform.OS === 'ios' && Platform.isTVOS) {
        // splashLoaded();
        //}

        Animated.timing(opacity, {
            delay: 2000,
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
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
        videoStyle: {
            height: 1,
            width: 1,
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

    const renderSplash = () => {
        const LottieView = require('lottie-react-native');
        return (
            <LottieView
                source={require('../../assets/animations/Struum_LogoBuild.json')}
                autoPlay
                loop={false}
                onAnimationFinish={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                    splashLoaded();
                }}
            />
        );
    };

    const renderAudio = () => {
        return (
            <Video
                source={require('../../assets/audio/struum_intro_tv.mp3')} // Can be a URL or a local file.
                audioOnly={true}
                repeat={false}
                shouldPlay={true}
                onError={e => {
                    console.log('splash intro sound error ' + e);
                }} // Callback when video cannot be loaded
                style={style.videoStyle}
            />
        );
    };

    return (
        <View style={style.logoContainer}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: backgroundOpacity }]}>
                <BackgroundGradient style={[style.container]} insetHeader={false} />
            </Animated.View>
            {appConfig && renderSplash()}
            {appConfig && Platform.isTV && renderAudio()}
        </View>
    );
};
export default React.memo(SplashScreen, () => true);

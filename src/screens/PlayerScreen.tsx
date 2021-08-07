import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, InteractionManager, Platform, Modal, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { typography } from 'qp-common-ui';
import { ResourceVm } from 'qp-discovery-ui';
import { PlatformError, PlatformErrorCategory } from 'rn-qp-nxg-player';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAlert } from 'contexts/AlertContext';
import { AppEvents, condenseErrorData, condensePlayerData } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { PlatformPlayer } from 'screens/components/PlatformPlayer';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { PlayerProps, usePlayerConfig } from './hooks/usePlayerConfig';
import { appFonts, appPadding, appDimensions } from '../../AppStyles';
import Button from './components/Button';
import CloseIcon from '../../assets/images/close.svg';
import { Button as RNEButton } from 'react-native-elements';
import { TimerType, useTimer } from 'utils/TimerContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { useDownloadsContext } from 'utils/DownloadsContextProvider';

const useOrientationLocker = () => {
    const { portrait } = useDeviceOrientation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToLandscape();
        }
    }, []);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            if (DeviceInfo.getDeviceType() === 'Handset' && portrait && isFocused) {
                Orientation.lockToLandscape();
            }
        });

        return () => task.cancel();
    }, [isFocused, portrait]);
};

const PlayerScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const [playerProps, setPlayerProps] = useState<PlayerProps>(route.params);
    const { appConfig } = useAppPreferencesState();
    const { Alert } = useAlert();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { playerViewStyle, appColors } = prefs.appTheme!(prefs);
    const [isStartPlay, setIsStartPlay] = useState(false);
    const { startTimer } = useTimer();
    const { streamOverCellular: canStreamOverCellularState } = useDownloadsContext();

    const playerScreenStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            flexDirection: 'column',
        },
        textWrapperStyle: {
            flex: 1,
            alignSelf: 'stretch',
            flexGrow: 1,
            marginTop: appPadding.xs(),
            marginBottom: appPadding.xs(),
            marginLeft: appPadding.xs(),
            marginRight: appPadding.xs(),
        },
        infoContainerStyle: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        titleContainerStyle: {
            flex: 1,
            flexDirection: 'column',
        },
        titleStyle: {
            ...typography.title,
            color: appColors.secondary,
            marginTop: appPadding.xs(),
            marginLeft: appPadding.xs(),
            marginRight: appPadding.xs(),
        },
        infoTextStyle: {
            ...typography.body,
            color: appColors.tertiary,
            flexWrap: 'wrap',
            marginTop: appPadding.xs(),
            marginLeft: appPadding.xs(),
            marginRight: appPadding.xs(),
            marginBottom: appPadding.xs(),
        },
        potraitControlsContainerBackground: {
            width: appDimensions.fullWidth,
            height: (appDimensions.fullWidth * 9) / 16,
            backgroundColor: appColors.primary,
            position: 'absolute',
            opacity: 0.5,
        },
        landscapeControlsContainerBackground: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignSelf: 'flex-end',
            backgroundColor: appColors.primary,
            opacity: 0.5,
        },
        selectionContainerStyle: {
            height: appDimensions.fullHeight - (appDimensions.fullWidth * 9) / 16,
            alignItems: 'flex-start',
            backgroundColor: appColors.primary,
        },
        buttonText: {
            color: appColors.secondary,
            fontFamily: appFonts.bold,
            alignSelf: 'center',
        },
        captionText: {
            color: appColors.secondary,
            fontFamily: appFonts.bold,
            alignSelf: 'center',
            fontSize: appFonts.xs,
        },
        headingText: {
            color: appColors.caption,
            fontFamily: appFonts.bold,
            alignSelf: 'center',
            marginTop: appPadding.sm(),
        },
        selectedButtonStyle: {
            height: 45,
            width: 100,
            backgroundColor: appColors.brandTint,
            marginTop: appPadding.sm(),
            alignSelf: 'center',
            justifyContent: 'center',
        },
        unselectedButtonStyle: {
            height: 45,
            width: 150,
            backgroundColor: appColors.primaryVariant1,
            marginTop: appPadding.sm(),
            alignSelf: 'center',
            justifyContent: 'center',
            opacity: 1,
        },
        // Confirmation overlay
        confirmationContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 1)',
            justifyContent: 'center',
            alignContent: 'center',
        },
        confirmationWrapper: {
            flexDirection: 'row',
            paddingHorizontal: '25%',
            justifyContent: 'center',
        },
        confirmationWrapperTV: {
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
            marginTop: -100,
        },
        confButtonTV: {
            margin: 5,
            alignSelf: 'center',
            width: '30%',
        },
        confButton: {
            margin: 5,
        },
        close: {
            position: 'absolute',
            top: '5%',
            right: '5%',
            alignSelf: 'flex-end',
        },
        closeTV: {
            width: 70,
            height: 70,
            margin: 30,
            alignSelf: 'flex-end',
        },
        buttonViewsTV: {
            height: 80,
            flexDirection: 'row',
            alignSelf: 'center',
            paddingHorizontal: '25%',
        },
        modalViewTV: {
            flex: 1,
            flexDirection: 'column',
        },
    });

    const { recordEvent } = useAnalytics();
    const { type } = useNetworkStatus();

    const onEnterFullScreen = () => {
        //Orientation.lockToLandscape();
    };

    const onExitFullScreen = () => {
        //Orientation.lockToPortrait();
    };

    const onError = (error: PlatformError) => {
        let errorCode;
        if (
            error.doesBelongToCategory(PlatformErrorCategory.ERROR_CATEGORY_MASK_SERVER) &&
            error.internalError &&
            error.internalError.errorCode
        ) {
            errorCode = error.internalError.errorCode;
        } else {
            errorCode = error.hexErrorCode;
        }

        if (resource) {
            recordEvent(
                AppEvents.ERROR,
                condensePlayerData(
                    resource,
                    playerConfig,
                    undefined,
                    undefined,
                    undefined,
                    condenseErrorData(error, AppEvents.PLAYBACK_ERROR),
                ),
            );
        }
        const title = strings['playback.error.' + errorCode];
        const fallbackTitle = strings['playback.error.general_error_msg'];
        let msg;
        if (errorCode) {
            if (errorCode === 40060105) {
                msg = ''; // 40060105 - Concurrent streams msg.since it is a feature, not showing the error code.
            } else {
                msg = strings.formatString(strings['global.error_code'], errorCode) as string;
            }
        }

        if (canStreamOverCellularState === false && type === NetInfoStateType.cellular) {
            Alert.alert(
                strings['playback.error.wifi_only'],
                undefined,
                [
                    {
                        text: strings['global.okay'],
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ],
                {
                    cancelable: false,
                },
            );
        } else {
            Alert.alert(title ? title : fallbackTitle, msg, [
                {
                    text: strings['global.okay'],
                    onPress: () => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        }
                    },
                },
            ]);
        }
    };

    const resource: ResourceVm | null | undefined = playerProps.resource;

    let { config: playerConfig, tvodToken } = usePlayerConfig({
        ...playerProps,
        onError,
        appConfig,
    });

    useEffect(() => {
        if (resource.watchedOffset) {
            if (resource.watchedOffset === 0) {
                setIsStartPlay(true);
            } else {
                setIsStartPlay(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource]);

    useEffect(() => {
        if (resource && isStartPlay) {
            startTimer(TimerType.PlayerLoad);
            recordEvent(AppEvents.PLAYBACK_START, condensePlayerData(resource, playerConfig), true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.id, isStartPlay]);

    useOrientationLocker();

    const handleWatchedOffset = (playType: string) => {
        resource.watchedOffset = playType === 'resume' ? resource.watchedOffset : 0;
        if (Platform.OS === 'android' && playerConfig && playerConfig.playbackProperties) {
            playerConfig.playbackProperties.initialStartTimeMillis = resource.watchedOffset;
        }
        setIsStartPlay(true);
    };

    const ConfirmationOverlay = () => {
        if (Platform.isTV) {
            return <ConfirmationTVOverlay />;
        } else {
            return (
                <View style={playerScreenStyles.confirmationContainer}>
                    <View style={playerScreenStyles.close}>
                        <RNEButton icon={CloseIcon} titleStyle={{}} type="clear" onPress={() => navigation.goBack()} />
                    </View>
                    <View style={playerScreenStyles.confirmationWrapper}>
                        <Button
                            title={strings['playback.resume']}
                            onPress={() => handleWatchedOffset('resume')}
                            containerStyle={playerScreenStyles.confButton}
                        />
                        <Button
                            title={strings['playback.startover']}
                            onPress={() => handleWatchedOffset('startover')}
                            containerStyle={playerScreenStyles.confButton}
                        />
                    </View>
                </View>
            );
        }
    };

    const ConfirmationTVOverlay = () => {
        const modalVisible = resource.watchedOffset && resource.watchedOffset > 0 && !isStartPlay;
        return (
            <Modal
                style={[StyleSheet.absoluteFillObject]}
                hardwareAccelerated
                transparent={true}
                visible={modalVisible}>
                <View style={playerScreenStyles.modalViewTV}>
                    <TouchableOpacity style={playerScreenStyles.closeTV} onPress={() => navigation.goBack()}>
                        <CloseIcon />
                    </TouchableOpacity>
                    <View style={playerScreenStyles.confirmationWrapperTV}>
                        <View style={playerScreenStyles.buttonViewsTV}>
                            <Button
                                title={strings['playback.resume']}
                                onPress={() => handleWatchedOffset('resume')}
                                containerStyle={playerScreenStyles.confButtonTV}
                            />
                            <Button
                                title={strings['playback.startover']}
                                onPress={() => handleWatchedOffset('startover')}
                                containerStyle={playerScreenStyles.confButtonTV}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <>
            {resource.watchedOffset && resource.watchedOffset > 0 && !isStartPlay && !Platform.isTV ? (
                <ConfirmationOverlay />
            ) : (
                <View style={[playerScreenStyles.container]}>
                    {!Platform.isTV && <StatusBar hidden={true} />}
                    {!playerConfig && <AppLoadingIndicator isClearable={true} />}
                    {playerConfig && (
                        <View style={[playerViewStyle.rootContainer, { flex: 1 }]} accessibilityLabel={'Player Screen'}>
                            <PlatformPlayer
                                playerScreenStyles={playerScreenStyles}
                                playerConfig={playerConfig}
                                onPlayerClose={() => navigation.goBack()}
                                onEnterFullScreen={onEnterFullScreen}
                                onExitFullScreen={onExitFullScreen}
                                onError={onError}
                                setshowDescription={() => {}}
                                resource={resource}
                                tvodToken={tvodToken}
                                setPlayerProps={setPlayerProps}
                            />
                        </View>
                    )}
                </View>
            )}
        </>
    );
};

export default PlayerScreen;

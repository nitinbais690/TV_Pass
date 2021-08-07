import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, InteractionManager } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { typography } from 'qp-common-ui';
import { ResourceVm } from 'qp-discovery-ui';
import { deviceInformation, PlatformError, PlatformErrorCategory } from 'rn-qp-nxg-player';
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
import { useDownloadsContext } from 'utils/DownloadsContextProvider';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { NetInfoStateType } from '@react-native-community/netinfo';

const useOrientationLocker = () => {
    const { portrait } = useDeviceOrientation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToLandscape();
        }

        return () => {
            if (DeviceInfo.getDeviceType() === 'Handset') {
                Orientation.lockToPortrait();
            }
        };
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
    const [isStartPlay, setIsStartPlay] = useState(true);
    const [playerState, setPlayerState] = useState(false);
    const [isAirplayDeviceConnected, setIsAirplayDeviceConnected] = useState(false);
    const { startTimer } = useTimer();

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
        confButton: {
            margin: 5,
        },
        close: {
            position: 'absolute',
            top: '5%',
            right: '5%',
            alignSelf: 'flex-end',
        },
    });

    const { recordEvent } = useAnalytics();
    const { streamOverCellular: canStreamOverCellularState } = useDownloadsContext();
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

    var { config: playerConfig, tvodToken } = usePlayerConfig({
        ...playerProps,
        onError,
        appConfig,
        playerState,
    });

    const isDownloadCompleted =
        playerProps.platformDownload && playerProps.platformDownload.state === 'COMPLETED' ? true : false;
    async function checkAirplayConnection() {
        const isAirplayRouteConnected = await deviceInformation.isAirplayRouteConnected();
        isAirplayRouteConnected ? setIsAirplayDeviceConnected(true) : setIsAirplayDeviceConnected(false);
    }

    useEffect(() => {
        checkAirplayConnection();
    }, []);

    useEffect(() => {
        if (isDownloadCompleted && isAirplayDeviceConnected) {
            Alert.alert(strings['download.error.airplay_playback'], undefined, [
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDownloadCompleted && isAirplayDeviceConnected]);

    useEffect(() => {
        if (resource.watchedOffset === undefined) {
            resource.watchedOffset = 0;
        }
        if (resource.watchedOffset) {
            if (resource.watchedOffset === 0) {
                setIsStartPlay(true);
                setPlayerState(true);
            } else {
                setIsStartPlay(false);
            }
        } else {
            setIsStartPlay(true);
            setPlayerState(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource]);

    useEffect(() => {
        if (resource && (isStartPlay || resource.watchedOffset === 0)) {
            startTimer(TimerType.PlayerLoad);
            recordEvent(AppEvents.PLAYBACK_START, condensePlayerData(resource, playerConfig), true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.id, isStartPlay]);

    useOrientationLocker();

    const handleWatchedOffset = (playType: string) => {
        setPlayerState(true);
        resource.watchedOffset = playType === 'resume' ? resource.watchedOffset : 0;
        setIsStartPlay(true);
    };

    const ConfirmationOverlay = () => {
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
    };

    return (
        <>
            {resource.watchedOffset &&
            resource.watchedOffset > 0 &&
            !isStartPlay &&
            !(isDownloadCompleted && isAirplayDeviceConnected) ? (
                <ConfirmationOverlay />
            ) : (
                <View style={[playerScreenStyles.container]}>
                    <StatusBar hidden={true} />
                    {!playerConfig && <AppLoadingIndicator isClearable={true} />}
                    {playerConfig && !(isDownloadCompleted && isAirplayDeviceConnected) && (
                        <View style={[playerViewStyle.rootContainer, { flex: 1 }]} accessibilityLabel={'Player Screen'}>
                            <PlatformPlayer
                                playerScreenStyles={playerScreenStyles}
                                playerConfig={playerConfig}
                                onPlayerClose={() => navigation.goBack()}
                                onEnterFullScreen={onEnterFullScreen}
                                onExitFullScreen={onExitFullScreen}
                                onError={onError}
                                isAirplayRouteConnected={isAirplayDeviceConnected}
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

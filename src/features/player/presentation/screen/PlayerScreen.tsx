import React, { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { ResourceVm } from 'qp-discovery-ui';
import { PlatformError } from 'rn-qp-nxg-player';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAlert } from 'contexts/AlertContext';
import { AppEvents, condenseErrorData, condensePlayerData } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { PlatformPlayer } from 'features/player/presentation/components/template/PlatformPlayer';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { playerScreenStyles } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useOrientationLocker } from '../hooks/useOrientationLocker';
import { PlayerProps, usePlayerConfig } from '../hooks/usePlayerConfig';

const PlayerScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const [playerProps, setPlayerProps] = useState<PlayerProps>(route.params);
    const { appConfig } = useAppPreferencesState();
    const { Alert } = useAlert();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { playerViewStyle } = prefs.appTheme!(prefs);
    const [isStartPlay, setIsStartPlay] = useState(false);
    const styles = playerScreenStyles(useAppColors());
    const { recordEvent } = useAnalytics();

    const onError = (error: PlatformError) => {
        let errorCode;
        if (error) {
            if (error.internalError && error.internalError.errorCode) {
                errorCode = error.internalError.errorCode;
            } else {
                errorCode = error.hexErrorCode;
            }
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
            msg = strings.formatString(strings['global.error_code'], errorCode) as string;
        }
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
    };

    const resource: ResourceVm | null | undefined = playerProps.resource;

    let { config: playerConfig, tvodToken } = usePlayerConfig({
        ...playerProps,
        onError,
        appConfig,
    });

    useEffect(() => {
        if (resource.watchedOffset && resource.watchedOffset === 0) {
            setIsStartPlay(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (resource && isStartPlay) {
            recordEvent(AppEvents.PLAYBACK_START, condensePlayerData(resource, playerConfig), true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.id, isStartPlay]);

    useOrientationLocker();

    return (
        <View style={[styles.container]}>
            <StatusBar hidden={true} />
            {!playerConfig && <AppLoadingIndicator />}
            {playerConfig && (
                <View style={[playerViewStyle.rootContainer, { flex: 1 }]} accessibilityLabel={'Player Screen'}>
                    <PlatformPlayer
                        playerScreenStyles={styles}
                        playerConfig={playerConfig}
                        onPlayerClose={() => navigation.goBack()}
                        onError={onError}
                        setshowDescription={() => {}}
                        resource={resource}
                        tvodToken={tvodToken}
                        setPlayerProps={setPlayerProps}
                    />
                </View>
            )}
        </View>
    );
};

export default PlayerScreen;

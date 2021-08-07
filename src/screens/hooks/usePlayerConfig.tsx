import { useState, useEffect, useContext } from 'react';
import { ClientContext } from 'react-fetching-library';
import { PlayerConfig, PlatformAsset, Download, PlatformError } from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import { useAuth } from 'contexts/AuthContextProvider';
import {
    resourceToPlatformAsset,
    platformAssetToPlayerConfig,
    platformDownloadToPlayerConfig,
} from 'utils/AssetConversionUtils';
import { fetchTVODToken } from 'utils/EntitlementUtils';
import { AppConfig } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';

export declare type PlayerProps = {
    resource: ResourceVm;
    tvodToken: string;
    platformDownload?: Download;
    playerConfig?: PlayerConfig;
    onError?: (error: PlatformError) => void;
    appConfig?: AppConfig;
    playerState?: boolean;
};

interface PlayerConfigState {
    config: PlayerConfig | undefined;
    tvodToken: string;
}

export const usePlayerConfig = (props: PlayerProps): PlayerConfigState => {
    const [playerConfig, setPlayerConfig] = useState<PlayerConfig>();
    const { isInternetReachable } = useNetworkStatus();
    const [tvodToken, setTVODToken] = useState<string>('');
    const { query } = useContext(ClientContext);
    const { accessToken, accountProfile } = useAuth();

    useEffect(() => {
        async function prepareContent() {
            do {
                if (props.playerConfig) {
                    console.log('obtained playerConfig directly.');
                    setPlayerConfig(props.playerConfig);
                    break;
                }

                if (props.platformDownload) {
                    const config = platformDownloadToPlayerConfig(props.platformDownload);
                    if (isInternetReachable) {
                        let _tvodToken = await fetchTVODToken(props.resource.id, accessToken, props.appConfig, query);
                        setTVODToken(_tvodToken || '');
                    }
                    setPlayerConfig(config);
                    break;
                }

                if (props && props.playerState) {
                    const platformAsset: PlatformAsset = resourceToPlatformAsset(props.resource, 'STREAMING');
                    let _tvodToken: string | undefined = props.tvodToken;
                    if (_tvodToken && _tvodToken.length > 0) {
                        setTVODToken(_tvodToken);
                    } else {
                        try {
                            _tvodToken = await fetchTVODToken(props.resource.id, accessToken, props.appConfig, query);
                            setTVODToken(_tvodToken || '');
                        } catch (e) {
                            console.error(`error fetching tvod token: ${JSON.stringify(e)}`);
                            props.onError && props.onError(e);
                            break;
                        }
                    }

                    try {
                        const config = await platformAssetToPlayerConfig(
                            platformAsset,
                            props.resource,
                            _tvodToken || '',
                            '',
                            props.appConfig,
                            accountProfile,
                        );
                        setPlayerConfig(config);
                    } catch (platformError) {
                        console.log(`playback_auth_failure: ${JSON.stringify(platformError)}`);
                        props.onError && props.onError(platformError);
                    }
                    break;
                }
            } while (false);
        }

        prepareContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.resource.id, props.playerState]);

    return {
        config: playerConfig,
        tvodToken: tvodToken,
    };
};

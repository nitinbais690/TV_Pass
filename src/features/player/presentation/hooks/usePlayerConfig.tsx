import { useState, useEffect } from 'react';
import { PlayerConfig, PlatformAsset, Download, PlatformError } from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import {
    resourceToPlatformAsset,
    platformAssetToPlayerConfig,
    platformDownloadToPlayerConfig,
} from 'utils/AssetConversionUtils';
import { AppConfig } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';

export declare type PlayerProps = {
    resource: ResourceVm;
    tvodToken: string;
    platformDownload?: Download;
    playerConfig?: PlayerConfig;
    onError?: (error: PlatformError) => void;
    appConfig?: AppConfig;
};

interface PlayerConfigState {
    config: PlayerConfig | undefined;
    tvodToken: string;
}

export const usePlayerConfig = (props: PlayerProps): PlayerConfigState => {
    const [playerConfig, setPlayerConfig] = useState<PlayerConfig>();
    //   const [tvodToken, setTVODToken] = useState<string>('');
    // const { query } = useContext(ClientContext);
    const userState = useAuth();
    const { userType } = userState;

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
                    setPlayerConfig(config);
                    break;
                }

                if (props) {
                    const platformAsset: PlatformAsset = resourceToPlatformAsset(props.resource, 'STREAMING');
                    let _tvodToken: string | undefined = props.tvodToken;

                    // if (_tvodToken && _tvodToken.length > 0) {
                    //     setTVODToken(_tvodToken);
                    // } else {
                    //     try {
                    //         _tvodToken = await fetchTVODToken(props.resource.id, accessToken, props.appConfig, query);
                    //         setTVODToken(_tvodToken || '');
                    //     } catch (e) {
                    //         console.error(`error fetching tvod token: ${JSON.stringify(e)}`);
                    //         props.onError && props.onError(e);
                    //         break;
                    //     }
                    // }

                    const initialPlaybackTime =
                        props.resource && props.resource.watchedOffset
                            ? props.resource.credits === 'free' && userType != 'SUBSCRIBED'
                                ? -1
                                : props.resource.watchedOffset
                            : -1;

                    try {
                        const config = await platformAssetToPlayerConfig(
                            platformAsset,
                            props.resource,
                            _tvodToken || '',
                            props.appConfig,
                            initialPlaybackTime,
                        );
                        // if (props.resource && props.resource.credits === 'free' && userType != 'SUBSCRIBED') {
                        //     config.adURL = props.appConfig && props.appConfig.imaAdURL;
                        // }
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
    }, [props.resource.id]);

    return {
        config: playerConfig,
        tvodToken: '',
    };
};

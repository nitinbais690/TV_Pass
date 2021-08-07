import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityProps, FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { Download, downloadManager, DownloadRequest, PlatformError } from 'rn-qp-nxg-player';
import { ICON_SIZE, DownloadButtonStyles, menuOptionsStyles } from './styles';
import { Category, ResourceVm, useConfig } from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { canDownloadOverCellular, DownloadQuality, getDownloadQuality } from 'utils/UserPreferenceUtils';
import { AssetMetadata, platformAssetToDownloadRequest, resourceToPlatformAsset } from 'utils/AssetConversionUtils';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import DownloadIcon from 'assets/images/ic_download.svg';
import DownloadingIcon from 'assets/images/downloading.svg';
import DownloadedIcon from 'assets/images/downloaded_tick.svg';
import DownloadIconBorderless from 'assets/images/download_outline_white.svg';
import { useLocalization } from 'contexts/LocalizationContext';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useDownloads } from 'platform/hooks/useDownloads';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useAlert } from 'contexts/AlertContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { AUTH_TYPES, EMAIL_AUTH_CONSTANTS } from 'features/authentication/utils/auth-constants';
import { useDownloadSettings } from 'features/downloads/presentation/contexts/DownloadSettingsContext';

const DownloadButton = (props: DownloadButtonProps) => {
    const { strings } = useLocalization();
    const navigation = useNavigation();
    const appColors = useAppColors();
    const { appConfig } = useAppPreferencesState();
    const { userType } = useAuth();
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';
    const { Alert } = useAlert();
    const { Settings } = useDownloadSettings();
    const { type, isInternetReachable } = useNetworkStatus();

    const styles = DownloadButtonStyles(props, appColors);
    const { Popover } = renderers;

    const menuRef = useRef<Menu>(null);
    const isMounted = useRef(true);

    const [downloadAuthLoading, setDownloadAuthLoading] = useState(false);
    const { downloads } = useDownloads(downloadManager);
    const download = downloads.find(download => download.id === props.resource.id);

    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = 'image' || undefined;
    const downloadImageStyles = StyleSheet.create({
        imageStyle: { width: 200 },
    });

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (isMounted.current && downloadAuthLoading && download) {
            setDownloadAuthLoading(false);
        }
    }, [downloadAuthLoading, download]);

    const enqueueDownloadableResource = async (res: ResourceVm, quality?: DownloadQuality) => {
        setDownloadAuthLoading(true);
        const platformAsset = resourceToPlatformAsset(res, 'DOWNLOAD');

        try {
            const downloadRequest = await platformAssetToDownloadRequest(platformAsset, '', appConfig, quality);

            console.log('downloadRequest: ', downloadRequest);

            // RNFetchBlob.
            const assetMetadata: AssetMetadata = {
                ...res,
                mediaURL: downloadRequest.mediaURL, //Safer to get it from
                mediaType: downloadRequest.mediaType,
                skd: downloadRequest.skd,
                drmLicenseURL: downloadRequest.drmLicenseURL ? downloadRequest.drmLicenseURL : '',
                drmType: downloadRequest.drmScheme,
                deliveryType: 'DOWNLOAD',
            };

            await enqueueDownload(downloadRequest, assetMetadata);
        } catch (err) {
            console.log(`enqueue_error = ${JSON.stringify(err as PlatformError)}`);
            if (isMounted.current) {
                setDownloadAuthLoading(false);
            }
            onError(err);
        }
    };

    const enqueueDownload = async (asset: DownloadRequest, metadata: AssetMetadata) => {
        console.log(`asset= ${asset} metadata = ${metadata}`);
        const imageURI = imageResizerUri(
            resizerEndpoint || '',
            resizerPath,
            asset ? asset.id : '',
            AspectRatio._16by9,
            ImageType.Poster,
            downloadImageStyles.imageStyle.width,
        );
        const isDownloadableOverCellular = await canDownloadOverCellular();
        if (
            (isDownloadableOverCellular === false && type === NetInfoStateType.cellular) ||
            isInternetReachable === false
        ) {
            showDownloadError();
        } else {
            await downloadManager.enqueueDownload({
                ...asset,
                title: metadata.title,
                imageUrl: imageURI,
                metadata: JSON.stringify(metadata),
                expiration: asset.expiration,
            });
        }
    };

    const onError = (platformError: PlatformError) => {
        let errorCode;
        if (platformError) {
            if (platformError.internalError && platformError.internalError.errorCode) {
                errorCode = platformError.internalError.errorCode;
            } else {
                errorCode = platformError.hexErrorCode;
            }
        }

        const title = strings['download.error.' + errorCode];
        const fallbackTitle = strings['download.error.general_error_msg'];
        let msg;
        if (errorCode) {
            msg = strings.formatString(strings['global.error_code'], errorCode) as string;
        }
        Alert.alert(title ? title : fallbackTitle, msg, [{ text: 'OK' }]);
    };

    const showAuthError = () => {
        Alert.alert(
            strings['download.error.account_only'],
            undefined,
            [
                {
                    text: strings.sign_in,
                    onPress: () => {
                        if (props.onNavigate) {
                            props.onNavigate();
                        }
                        navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN, {
                            signInType: AUTH_TYPES.EMAIL_SIGN_IN,
                            screenType: EMAIL_AUTH_CONSTANTS.ENTER_EMAIL_SCREEN,
                        });
                    },
                },
            ],
            {
                cancelable: false,
            },
        );
    };

    const showDownloadError = () => {
        Alert.alert(
            strings['download.error.wifi_only'],
            undefined,
            [
                {
                    text: strings['global.okay'],
                },
            ],
            {
                cancelable: false,
            },
        );
    };

    const hideMenu = () => {
        menuRef.current!.close();
    };

    const showMenu = () => {
        menuRef.current!.open();
    };

    const handlePress = async () => {
        if (downloadAuthLoading) {
            return;
        }

        if (!isLoggedIn) {
            showAuthError();
            return;
        }

        if (!download && props.resource) {
            const quality = await getDownloadQuality();
            if (!quality) {
                Settings.show((quality, _) => {
                    enqueueDownloadableResource(props.resource, quality);
                });
                return;
            }

            enqueueDownloadableResource(props.resource, quality);
            return;
        }

        showMenu();
    };

    const handleAction = async (action: DownloadAction) => {
        if (!download) {
            return true;
        }

        switch (action) {
            case 'PAUSE':
                await downloadManager.pauseDownload(download.id);
                break;
            case 'RESUME':
                await downloadManager.resumeDownload(download.id);
                break;
            case 'DELETE':
                await downloadManager.purgeDownload(download.id);
                break;
            case 'VIEW':
                if (props.onNavigate) {
                    props.onNavigate();
                }
                navigation.navigate(NAVIGATION_TYPE.DOWNLOADS);
                break;
        }
        return true;
    };

    const pausedDownloadActions: Action[] = [
        { label: strings['my_content.download_resume_cta'], value: 'RESUME' },
        { label: strings['my_content.download_cancel_cta'], value: 'DELETE' },
        { label: strings['my_content.download_view_cta'], value: 'VIEW' },
    ];

    const inprogressDownloadActions: Action[] = [
        { label: strings['my_content.download_pause_cta'], value: 'PAUSE' },
        { label: strings['my_content.download_cancel_cta'], value: 'DELETE' },
        { label: strings['my_content.download_view_cta'], value: 'VIEW' },
    ];

    const downloadedActions: Action[] = [
        { label: strings['my_content.download_delete_cta'], value: 'DELETE' },
        { label: strings['my_content.download_view_cta'], value: 'VIEW' },
    ];

    const getTitle = (): string => {
        if (download) {
            switch (download.state) {
                case 'COMPLETED':
                    return strings['download.completed'];
                case 'PAUSED':
                    return strings['download.resume'];
                case 'DOWNLOADING':
                    return `${download.progressPercent.toFixed(0)}${strings['download.progress']}`;
            }
        }

        let episodeInfo;
        if (props.resource && props.resource.type === Category.TVEpisode) {
            episodeInfo = `S${props.resource.seasonNumber} E${props.resource.episodeNumber}`;
        }

        if (episodeInfo) {
            return [strings.download, episodeInfo].join(' ');
        }

        return strings.download;
    };

    const menuList = () => {
        if (!download) {
            return;
        }

        const downloadState = download.state;
        let data: Action[];
        if (downloadState === 'DOWNLOADING') {
            data = inprogressDownloadActions;
        } else if (downloadState === 'COMPLETED') {
            data = downloadedActions;
        } else if (downloadState === 'QUEUED' || downloadState === 'PAUSED' || downloadState === 'FAILED') {
            data = pausedDownloadActions;
        }

        return (
            <View style={styles.popupListContainer}>
                <FlatList keyExtractor={item => item.value} data={data} renderItem={renderItem} />
            </View>
        );
    };

    const renderItem = ({ item }: { item: Action }) => (
        <MenuOption value={item.value}>
            <Text style={styles.popupText}>{item.label}</Text>
        </MenuOption>
    );

    const normalIcon = () => {
        const iconSize = (props.iconSize && props.iconSize) || ICON_SIZE;

        if (props.borderless) {
            return <DownloadIconBorderless width={iconSize} height={iconSize} />;
        }

        return <DownloadIcon width={iconSize} height={iconSize} />;
    };

    const buttonContent = (loading: boolean, download: Download | undefined) => {
        const iconSize = (props.iconSize && props.iconSize) || ICON_SIZE;

        if (loading) {
            return <MaterialIndicator size={props.width + 1} color={appColors.brandTint} trackWidth={2} />;
        }

        if (!download) {
            return normalIcon();
        }

        switch (download.state) {
            case 'COMPLETED':
                return <DownloadedIcon width={iconSize} height={iconSize} />;
            case 'FAILED':
                return normalIcon();
            case 'PAUSED':
                return normalIcon();
            case 'QUEUED':
                return normalIcon();
            case 'DOWNLOADING':
                return (
                    <AnimatedCircularProgress
                        size={props.width + 1}
                        padding={1}
                        width={2}
                        fill={!download ? 0 : download.progressPercent >= 99 ? 0 : download.progressPercent}
                        tintColor={appColors.brandTint}
                        backgroundColor={'transparent'}>
                        {() => <DownloadingIcon width={iconSize} height={iconSize} />}
                    </AnimatedCircularProgress>
                );
            default:
                return normalIcon();
        }
    };

    return (
        <Menu
            ref={menuRef}
            renderer={Popover}
            rendererProps={{ placement: 'top', anchorStyle: styles.popupAnchor }}
            onBackdropPress={hideMenu}
            onSelect={handleAction}>
            <MenuTrigger />
            <TouchableOpacity style={[props.style]} onPress={handlePress} testID={props.testID}>
                <View style={styles.containerStyle}>
                    {!props.borderless && (
                        <>
                            <LinearGradient
                                style={styles.circle}
                                colors={[appColors.primaryVariant3, appColors.primaryVariant1]}
                                useAngle={true}
                                angle={180}
                                locations={[0.094, 1]}>
                                {buttonContent(downloadAuthLoading, download)}
                            </LinearGradient>
                            <Text style={styles.actionTextStyle}>{getTitle()}</Text>
                        </>
                    )}
                    {props.borderless && (
                        <>
                            <View style={styles.circleBorderless}>{buttonContent(downloadAuthLoading, download)}</View>
                            {download && (download.state === 'DOWNLOADING' || download.state === 'PAUSED') && (
                                <Text style={styles.actionTextStyle}>{getTitle()}</Text>
                            )}
                        </>
                    )}
                </View>
            </TouchableOpacity>
            <MenuOptions customStyles={menuOptionsStyles}>
                <LinearGradient colors={['#161718', '#3B4046']} style={styles.gradient} />
                <>{menuList()}</>
            </MenuOptions>
        </Menu>
    );
};

type DownloadAction = 'PAUSE' | 'RESUME' | 'VIEW' | 'DELETE';

interface Action {
    label: string;
    value: DownloadAction;
}

export interface DownloadButtonProps extends AccessibilityProps {
    width: number;
    height: number;
    iconSize?: number;
    style?: {};
    testID?: string;
    resource: ResourceVm;
    onNavigate?: () => void;
    borderless?: boolean;
}

export default DownloadButton;

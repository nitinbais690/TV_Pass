import React, { useEffect, useState, useRef, Fragment, useCallback } from 'react';
import {
    View,
    Text,
    Platform,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
    Animated,
    Easing,
    useTVEventHandler,
    TVMenuControl,
    TouchableOpacity,
    findNodeHandle,
    TouchableHighlight,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actionsheet';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions, useLayout } from '@react-native-community/hooks';
import {
    ResourceVm,
    ResourceCardViewBaseProps,
    Category,
    useFetchResourceQuery,
    ResizableImage,
    useConfig,
    ResourceHookResponse,
} from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';

import { downloadManager, PlatformError, DownloadRequest, DownloadStateValue } from 'rn-qp-nxg-player';
import { useDownloads } from 'platform/hooks/useDownloads';
import { useAppState } from 'utils/AppContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreview } from 'contexts/AppPreviewContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useFLPlatform } from 'platform/PlatformContextProvider';
import { useAlert /* dismiss */ } from 'contexts/AlertContext';
import { resourceToPlatformAsset, platformAssetToDownloadRequest, AssetMetadata } from 'utils/AssetConversionUtils';

// import { PlayerProps } from './hooks/usePlayerConfig';
import { useTVODEntitlement, EntitlementResponse } from './hooks/useTVODEntitlement';

import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';
import { RedeemButton, RedeemState } from './components/RedeemButton';
import Button from './components/Button';
import DownloadButton from './components/DownloadButton';
import RelatedResourcesView, { RelatedType } from './components/RelatedResourcesView';
import AppErrorComponent from 'utils/AppErrorComponent';
import SkeletonVList from 'screens/components/loading/SkeletonVList';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import ModalOverlay from 'screens/components/ModalOverlay';
import ProviderLogo from 'screens/components/ProviderLogo';
import { appPadding } from '../../AppStyles';
import DarkGradientBackground from '../../assets/images/gradient_background.svg';
import FallBackGradientBackground from '../../assets/images/backgroundRadianGradient.svg';
import { defaultContentDetailsStyle, imageAspectRatio } from 'styles/ContentDetails.style';
import SeasonsView from './SeasonsView';
import { PlayerProps } from './hooks/usePlayerConfig';
import { useBookmarkOffset } from 'screens/hooks/useBookmarkOffset';
import { useContinueWatchingProgress } from 'screens/hooks/useContinueWatchingProgress';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import {
    AppEvents,
    condenseErrorObject,
    condenseDownloadData,
    getContentDetailsAttributes,
} from 'utils/ReportingUtils';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { canDownloadOverCellular } from 'utils/UserPreferenceUtils';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import AppContant from 'utils/AppContant';
import { PlayButton } from './components/PlayButton';

export const resourceMetadata = (appLanguage: string, resource?: ResourceVm) => {
    const metaInfo = [];
    if (resource && Platform.isTV) {
        if (resource.seriesTitle) {
            metaInfo.push(resource.seriesTitle);
        }
        if (resource.seasonNumber) {
            metaInfo.push('Season #' + resource.seasonNumber);
        }
        if (resource.episodeNumber) {
            metaInfo.push('Episode #' + resource.seasonNumber);
        }
        const ratings = resource.allRatings && Object.values(resource.allRatings);
        if (resource.releaseYear) {
            metaInfo.push(resource.releaseYear);
        }
        if (ratings && ratings.length > 0 && ratings[0] && ratings[0].toUpperCase() !== 'UNRATED') {
            metaInfo.push(ratings[0]);
        }
        if (resource.formattedRunningTime) {
            metaInfo.push(resource.formattedRunningTime);
        }
        if (resource.contentGenre && resource.contentGenre[appLanguage]) {
            let contentGenre =
                resource.contentGenre[appLanguage].length > 2
                    ? resource.contentGenre[appLanguage].slice(0, 2)
                    : resource.contentGenre[appLanguage];
            metaInfo.push(contentGenre.join(','));
        }
    } else if (resource) {
        const ratings = resource.allRatings && Object.values(resource.allRatings);
        if (resource.releaseYear) {
            metaInfo.push(resource.releaseYear);
        }
        if (resource.contentGenre && resource.contentGenre[appLanguage]) {
            metaInfo.push(resource.contentGenre[appLanguage].join(', '));
        }
        if (ratings && ratings.length > 0 && ratings[0] && ratings[0].toUpperCase() !== 'UNRATED') {
            metaInfo.push(ratings[0]);
        }
        if (resource.formattedRunningTime) {
            metaInfo.push(resource.formattedRunningTime);
        }
    }

    return metaInfo.join(' - ');
};

export const DetailScreenUI = ({
    route,
    dataResponse,
    entitlementResponse,
    bookmarkOffset,
    isOnboarding,
}: {
    route: any;
    dataResponse: ResourceHookResponse;
    entitlementResponse: EntitlementResponse;
    bookmarkOffset?: number;
    isOnboarding?: boolean;
}): JSX.Element => {
    const navigation = useNavigation();
    const insets = useSafeArea();
    const isMounted = useRef(true);
    const { onLayout, y: contentY } = useLayout();
    const { width, height } = useDimensions().window;
    const { appConfig } = useAppPreferencesState();
    const downloadPausedActionSheetRef = useRef<ActionSheet>(null);
    const downloadingActionSheetRef = useRef<ActionSheet>(null);
    const downloadedActionSheetRef = useRef<ActionSheet>(null);
    const [downloadAuthLoading, setDownloadAuthLoading] = useState(false);
    const [downloadOverCellular, setDownloadOverCellular] = useState(false);
    const [isFocusSeason, setFocusToSeason] = useState(false);
    const [isFocusEpisode, setFocusToEpisode] = useState(false);
    const [isFocusTopButton, setFocusTopButton] = useState(true);
    const [lastEventType, setLastEventType] = React.useState('');
    const [briefMode, setBriefMode] = useState(true);
    const [isLengthier, setIsLengthier] = useState(false);
    const [showOpaqueHeader, setShowOpaqueHeader] = useState(false);
    const enterAnimValue = useRef(new Animated.Value(0)).current;
    const opacityAnimValue = useRef(new Animated.Value(0)).current;
    const {
        resource,
        resourceId,
        searchPosition,
        recommendedSearchWord: searchTerm,
        contentTabName,
        usageTabName,
    } = route.params;
    const { loading, error, mainResource } = dataResponse;
    const { state: platformState } = useFLPlatform();
    const { isConfigured: isPlatformConfigured, error: platformError } = platformState;
    const { appNavigationState } = useAppState();
    const { Alert } = useAlert();
    const { toggleModal } = useAppPreview();
    const { strings, appLanguage } = useLocalization();
    const isPortrait = height > width;
    const { recordEvent } = useAnalytics();
    const [scrollRef, setScrollRef] = useState(Object);
    const [seasonPosition, setSeasonPosition] = useState(null);
    const [isFallbackImageShow, setIsFallbackImageShow] = useState(false);
    const { type, isInternetReachable } = useNetworkStatus();
    const DESC_MIN_LENGTH = 120;

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            setFocusTopButton(false);
        };
    }, []);
    useEffect(() => {
        const setup = async () => {
            setDownloadOverCellular(await canDownloadOverCellular());
        };
        setup();
    }, []);

    useEffect(() => {
        TVMenuControl.enableTVMenuKey();
        return () => {
            TVMenuControl.disableTVMenuKey();
        };
    }, []);

    //recod rent content: issue, would record already rented content also
    const {
        loading: entitlementLoading,
        entitlement,
        redeem,
        redeemError,
        error: tvodError,
        tvodToken,
    } = entitlementResponse;
    const [showProgress, percentCompleted] = useContinueWatchingProgress(
        bookmarkOffset,
        mainResource && mainResource.runningTime,
    );
    const [showConfirm, setShowConfirm] = useState(showProgress);
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const { downloads } = useDownloads(downloadManager);
    const downloadResourceId = mainResource && mainResource.id;
    const resourceDownload = downloads.find(downlaod => downlaod.id === downloadResourceId);
    const styles = defaultContentDetailsStyle({ appColors, appPadding, isPortrait, insets, entitlement, isOnboarding });
    const caption1String = resourceMetadata(appLanguage, mainResource);
    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = 'image' || undefined;
    const downloadImageStyles = StyleSheet.create({
        imageStyle: { width: 200 },
    });
    const episodeCardProps: ResourceCardViewBaseProps<ResourceVm> = {
        onResourcePress: (tappedResource: ResourceVm) => {
            // reset state
            // setBriefMode(!Platform.isTV);
            setBriefMode(true);
            setShowOpaqueHeader(false);

            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
            });
        },
    };

    let seriesId: string | undefined;
    if (mainResource) {
        if (mainResource.type === Category.TVSeries) {
            seriesId = mainResource.id;
        } else if (mainResource.seriesId) {
            seriesId = mainResource.seriesId;
        }
    }

    let name = mainResource && mainResource.name;
    // if (mainResource && mainResource.type === Category.TVEpisode) {
    //     name = `S${mainResource.seasonNumber} E${mainResource.episodeNumber}: ${mainResource.name}`;
    // }

    const onError = (error: PlatformError) => {
        let errorCode;
        if (error) {
            if (error.internalError && error.internalError.errorCode) {
                errorCode = error.internalError.errorCode;
            } else {
                errorCode = error.hexErrorCode;
            }
        }

        // if (resource) {
        //     recordEvent(
        //         AppEvents.ERROR,
        //         condensePlayerData(resource, playerConfig, undefined, condenseErrorData(error)),
        //     );
        // }
        const title = strings['download.error.' + errorCode];
        const fallbackTitle = strings['download.error.general_error_msg'];
        let msg;
        if (errorCode) {
            msg = strings.formatString(strings['global.error_code'], errorCode) as string;
        }
        Alert.alert(title ? title : fallbackTitle, msg, [{ text: 'OK' }]);
    };

    useEffect(() => {
        if (isMounted.current && downloadAuthLoading && resourceDownload) {
            setDownloadAuthLoading(false);
        }
    }, [downloadAuthLoading, resourceDownload]);

    useEffect(() => {
        if (mainResource) {
            const descLength = mainResource.longDescription
                ? mainResource.longDescription
                : mainResource.shortDescription;
            if (descLength && descLength.length > DESC_MIN_LENGTH) {
                setIsLengthier(true);
            }
        }
    }, [mainResource]);

    useEffect(() => {
        if (!loading && !error && mainResource && !isOnboarding) {
            Animated.parallel([
                Animated.timing(enterAnimValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
                Animated.timing(opacityAnimValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
            ]).start();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, error, mainResource]);

    const enqueueDownloadableResource = async (res: ResourceVm) => {
        if (!tvodToken) {
            return;
        }
        setDownloadAuthLoading(true);
        const platformAsset = resourceToPlatformAsset(res, 'DOWNLOAD');
        try {
            const downloadRequest = await platformAssetToDownloadRequest(platformAsset, tvodToken, appConfig);
            // RNFetchBlob.
            const assetMetadata: AssetMetadata = {
                ...res,
                mediaURL: downloadRequest.mediaURL, //Safer to get it from
                mediaType: downloadRequest.mediaType,
                skd: downloadRequest.skd,
                deliveryType: 'DOWNLOAD',
            };
            recordEvent(AppEvents.DOWNLOAD_PREPARED, condenseDownloadData(resource));
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
        if ((downloadOverCellular === false && type === NetInfoStateType.cellular) || isInternetReachable === false) {
            showDownloadError();
            setDownloadAuthLoading(false);
        } else {
            await downloadManager.enqueueDownload({
                ...asset,
                title: metadata.title,
                imageUrl: imageURI,
                metadata: JSON.stringify(metadata),
                expiration: asset.expiration,
            });
            recordEvent(AppEvents.DOWNLOAD_STARTED, condenseDownloadData(resource));
        }
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

    const handleDownloadPress = async () => {
        console.log(`handleDownloadPress: ${JSON.stringify(resourceDownload)}`);
        if (resourceDownload) {
            showDownloadActionSheet(resourceDownload.state);
        } else if (mainResource && !downloadAuthLoading) {
            recordEvent(AppEvents.DOWNLOAD_START, condenseDownloadData(resource));
            await enqueueDownloadableResource(mainResource);
        }
    };

    const imageUrl =
        mainResource && mainResource.syndicationImages && mainResource.syndicationImages[AspectRatio._16by9];

    const playContent = (res: ResourceVm) => {
        console.log(`play : ${JSON.stringify(res, null, 2)}`);

        const playbackId: string = res.id;
        if (playbackId.length === 0) {
            console.error('Invalid contentId');
            return;
        }
        // add reporting params
        res.origin = resource.origin;
        res.storeFrontId = resource.storeFrontId;
        res.containerId = resource.containerId;
        res.tabId = resource.tabId;
        res.tabName = resource.tabName;
        res.containerName = resource.containerName;
        res.collectionID = resource.collectionID;
        res.collectionName = resource.collectionName;

        let playerProps: PlayerProps = {
            resource: { ...res, watchedOffset: bookmarkOffset },
            tvodToken: tvodToken || '',
        };
        navigation.navigate('Player', playerProps);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Note: We do not want to trigger a state change over and over, hence
        // the additional conditions
        const offset = contentY - 40;
        if (event.nativeEvent.contentOffset.y > offset && !showOpaqueHeader) {
            setShowOpaqueHeader(true);
        } else if (event.nativeEvent.contentOffset.y < offset && showOpaqueHeader) {
            setShowOpaqueHeader(false);
        }
    };

    useEffect(() => {
        if (tvodError && redeemError) {
            recordEvent(AppEvents.ERROR, condenseErrorObject(tvodError, AppEvents.TVOD_ERROR));
            const title = strings['redeem.error.' + tvodError.errorCode];
            const fallbackTitle = strings['global.general_error_msg'];
            let msg;
            if (tvodError.errorCode) {
                msg = strings.formatString(strings['global.error_code'], tvodError.errorCode) as string;
            }
            Alert.alert(title ? title : fallbackTitle, msg, [
                {
                    text: strings['redeem.okay_btn'],
                    onPress: () => {},
                },
                {
                    text: strings['redeem.retry_btn'],
                    onPress: () => {
                        if (mainResource) {
                            redeem(mainResource);
                        }
                    },
                    style: 'cancel',
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redeemError]);

    useEffect(() => {
        if (mainResource !== undefined) {
            recordEvent(
                AppEvents.VIEW_CONTENT_DETAILS,
                getContentDetailsAttributes(mainResource, searchPosition, searchTerm, contentTabName, usageTabName),
                true,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResource]);

    const headerTitleLogo = React.useCallback(
        () => <ProviderLogo provider={mainResource && mainResource.providerName} />,
        [mainResource],
    );

    // Note: We need this additional check to ensure the header logos
    // are reloaded when swirching to a different provider from within the
    // details screen
    let headerTitle;
    if (mainResource && mainResource.id === resourceId) {
        headerTitle = showOpaqueHeader ? mainResource.name : headerTitleLogo;
    }

    // Note: When user opens the app and immediately opens a details page, the platform config
    // might not be configured yet, so in such cases, we wait until either the platform is configured
    // or until the platform configuration fails
    const platformLoading = isPlatformConfigured ? !isPlatformConfigured : !platformError;
    // const playAvailable = bookmarkOffset !== undefined && !platformLoading;
    // const playAvailable = bookmarkOffset !== (undefined || 0) && !platformLoading;
    let playAvailable: boolean = false;
    if (bookmarkOffset !== undefined || bookmarkOffset !== 0) {
        playAvailable = !platformLoading;
    }

    const pausedDownloadActions = [
        { label: strings['global.continue_btn'] },
        { label: strings['my_content.download_resume_cta'] },
        { label: strings['my_content.download_remove_cta'] },
    ];

    const inprogressDownloadActions = [
        { label: strings['global.continue_btn'] },
        { label: strings['my_content.download_pause_cta'] },
        { label: strings['my_content.download_remove_cta'] },
    ];

    const downloadedActions = [
        { label: strings['global.continue_btn'] },
        { label: strings['my_content.download_remove_cta'] },
    ];

    const showDownloadActionSheet = (downloadState: DownloadStateValue) => {
        if (downloadState === 'DOWNLOADING' && downloadingActionSheetRef.current) {
            downloadingActionSheetRef.current.show();
        } else if (downloadState === 'COMPLETED' && downloadedActionSheetRef.current) {
            downloadedActionSheetRef.current.show();
        } else if (
            (downloadState === 'QUEUED' || downloadState === 'PAUSED' || downloadState === 'FAILED') &&
            downloadPausedActionSheetRef.current
        ) {
            downloadPausedActionSheetRef.current.show();
        }
    };

    const noCreditAlert = () => {
        Alert.alert(strings['content_detail.no_credits'], undefined, [
            {
                text: strings['content_detail.add_credits'],
                onPress: () => {
                    navigation.navigate(NAVIGATION_TYPE.CREDITS);
                },
            },
            {
                text: strings['content_detail.add_later'],
                onPress: () => {},
                style: 'cancel',
            },
        ]);
    };

    const onHandleBlur = (contentType?: string, listIndex?: number) => {
        if (
            listIndex === 0 &&
            (AppContant.EPISODE === contentType || AppContant.SEASON === contentType) &&
            lastEventType === AppContant.up
        ) {
            setFocusToEpisode(false);
            setFocusToSeason(false);
            setFocusTopButton(true);
            moveViewToTop(scrollRef);
        }
        if (mainResource && mainResource.seriesId) {
            if (
                (AppContant.SEASON === contentType && lastEventType === AppContant.right) ||
                (lastEventType === AppContant.right && !contentType)
            ) {
                setFocusToEpisode(true);
                setFocusToSeason(false);
                setFocusTopButton(false);
                moveSeasonsAndEpisodesToTop(scrollRef, seasonPosition);
            }
            if (AppContant.EPISODE === contentType && lastEventType === AppContant.left) {
                setFocusToEpisode(false);
                setFocusToSeason(true);
                setFocusTopButton(false);
                moveSeasonsAndEpisodesToTop(scrollRef, seasonPosition);
            }
        }
    };

    const myTVEventHandler = (evt: { eventType: string }) => {
        setLastEventType(evt.eventType);
        if (evt.eventType === AppContant.playPause) {
            playContent(mainResource);
        }
    };

    useTVEventHandler(myTVEventHandler);

    let imageTimer: any = null;
    const setImageTimer = () => {
        imageTimer = setTimeout(() => {
            setIsFallbackImageShow(true);
        }, 5000);
    };

    const removeImageTimer = () => {
        clearTimeout(imageTimer);
    };

    const shakeAnim = useRef(new Animated.Value(0)).current;
    const shakeAnimation = () => {
        const distance = 5;
        const duration = 80;
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: distance, duration: duration, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -distance, duration: duration, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: distance, duration: duration, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: duration, useNativeDriver: true }),
        ]).start(() => {
            noCreditAlert();
        });
    };
    const slideInStyle = enterAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // 0 : 150, 0.5 : 75, 1 : 0
    });

    const onRedmeedPress = useCallback(
        (purchaseState: RedeemState, mainResource: ResourceVm) => {
            switch (purchaseState) {
                case RedeemState.NotEntitled_NoCredit:
                    Platform.isTV ? navigation.navigate(NAVIGATION_TYPE.CREDITS) : shakeAnimation();
                    break;
                case RedeemState.NotEntitled:
                    redeem(mainResource).then(() => {
                        recordEvent(AppEvents.RENT_CONTENT, getContentDetailsAttributes(resource, searchPosition));
                    });
                    break;
                case RedeemState.Entitled:
                    console.log('Play');
                    break;
                default:
                    console.log('Do nothing');
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation, recordEvent, redeem, resource, searchPosition],
    );

    const renderRedeem = (mainResource: ResourceVm) => {
        return (
            <Fragment>
                {mainResource.type !== Category.TVSeries &&
                    (appNavigationState === 'PREVIEW_APP' ? (
                        <Button
                            title={strings['preview.sign_up_btn_label']}
                            onPress={toggleModal}
                            containerStyle={styles.subscribeButton}
                        />
                    ) : (
                        <Animated.View
                            style={[
                                styles.redeemButtonWrapper,
                                {
                                    transform: [{ translateX: shakeAnim }],
                                },
                            ]}>
                            <RedeemButton
                                asset={mainResource}
                                entitlement={entitlement}
                                loading={entitlementLoading}
                                onHandleBlur={Platform.isTV ? onHandleBlur : undefined}
                                hasTVPreferredFocus={Platform.isTV ? isFocusTopButton : undefined}
                                blockFocusUp={!isLengthier}
                                onPress={(purchaseState: RedeemState) => {
                                    if (Platform.isTV) {
                                        // Alert.alert(
                                        //     strings['my_content.confirm_purchase'],
                                        //     name,
                                        //     [
                                        //         {
                                        //             text: strings['global.yes_sure'],
                                        //             onPress: () => {
                                        //                 onRedmeedPress(purchaseState, mainResource);
                                        //             },
                                        //         },
                                        //         {
                                        //             text: strings['my_content.nevermind'],
                                        //             onPress: dismiss,
                                        //         },
                                        //     ],
                                        //     { cancelable: false },
                                        //     mainResource.seriesTitle ? mainResource.seriesTitle : '',
                                        //     'purchase',
                                        // );
                                        onRedmeedPress(purchaseState, mainResource);
                                    } else {
                                        onRedmeedPress(purchaseState, mainResource);
                                    }
                                }}
                            />
                            {!Platform.isTV && entitlement && mainResource && mainResource.canDownload && (
                                <View style={styles.downloadButtonWrapper}>
                                    <DownloadButton
                                        fetchingAuthorization={downloadAuthLoading}
                                        download={resourceDownload}
                                        onPress={handleDownloadPress}
                                    />
                                </View>
                            )}
                        </Animated.View>
                    ))}
            </Fragment>
        );
    };

    const [readMoreFocus, setReadMoreFocus] = useState(false);
    const [readLessFocus, setReadLessFocus] = useState(false);

    const touchableHighlightRef = useRef(null);
    const touchableHighlightRefPlay = useRef(null);
    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    useEffect(() => {
        return () => {
            setReadMoreFocus(false);
            setReadLessFocus(false);
            setBriefMode(true);
        };
    }, [mainResource]);

    const renderMetaData = (mainResource: ResourceVm) => {
        let initailShowLineNumber = Platform.isTV ? 4 : 2;
        return (
            <View style={[styles.titleContainerStyle]}>
                {mainResource.seriesTitle && <Text style={[styles.seriesTitleStyle]}>{mainResource.seriesTitle}</Text>}
                <Text style={[styles.titleStyle]}>{name}</Text>
                <View style={styles.titleContainerStyle}>
                    <Text style={[styles.caption1]}>{caption1String}</Text>
                </View>
                <Text
                    numberOfLines={briefMode && isLengthier ? initailShowLineNumber : 99}
                    ellipsizeMode={'tail'}
                    style={[styles.infoTextStyle]}>
                    {mainResource.longDescription ? mainResource.longDescription : mainResource.shortDescription}
                </Text>
                {briefMode && isLengthier && (
                    <>
                        {Platform.isTV ? (
                            <TouchableHighlight
                                hasTVPreferredFocus={readMoreFocus}
                                ref={onRef}
                                style={[
                                    styles.readMoreBtnStyleTv,
                                    readMoreFocus ? styles.readMoreFocusStyleTv : undefined,
                                ]}
                                underlayColor={appColors.primaryVariant1}
                                nextFocusUp={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusLeft={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusRight={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusDown={findNodeHandle(touchableHighlightRefPlay.current)}
                                onPress={() => {
                                    setBriefMode(false);
                                    setReadLessFocus(true);
                                }}
                                onFocus={() => {
                                    setReadMoreFocus(true);
                                    moveViewToTop(scrollRef);
                                }}
                                onBlur={() => {
                                    setReadMoreFocus(false);
                                    setFocusTopButton(true);
                                }}>
                                <Text style={styles.readMoreStyle}>{strings['content_detail.read_more_lbl']}</Text>
                            </TouchableHighlight>
                        ) : (
                            <TouchableOpacity onPress={() => setBriefMode(false)}>
                                <Text style={styles.readMoreStyle}>{strings['content_detail.read_more_lbl']}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
                {!briefMode && (
                    <>
                        {Platform.isTV ? (
                            <TouchableHighlight
                                hasTVPreferredFocus={readLessFocus}
                                ref={onRef}
                                style={[
                                    styles.readMoreBtnStyleTv,
                                    readLessFocus ? styles.readMoreFocusStyleTv : undefined,
                                ]}
                                nextFocusUp={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusLeft={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusRight={findNodeHandle(touchableHighlightRef.current)}
                                nextFocusDown={findNodeHandle(touchableHighlightRefPlay.current)}
                                underlayColor={appColors.primaryVariant1}
                                onPress={() => setBriefMode(true)}
                                onFocus={() => {
                                    setReadLessFocus(true);
                                    moveViewToTop(scrollRef);
                                }}
                                onBlur={() => {
                                    setReadMoreFocus(true);
                                    setReadLessFocus(false);
                                }}>
                                <Text style={styles.readMoreStyle}>{strings['content_detail.read_less_lbl']}</Text>
                            </TouchableHighlight>
                        ) : (
                            <TouchableOpacity onPress={() => setBriefMode(true)}>
                                <Text style={styles.readMoreStyle}>{strings['content_detail.read_less_lbl']}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        );
    };

    const showConfirmation = () => {
        if (showProgress && seriesId) {
            setShowConfirm(true);
        } else {
            setShowConfirm(false);
        }
    };

    return (
        <ModalOverlay
            animatedStyle={{ transform: [{ translateY: shakeAnim }] }}
            headerTransparent={true}
            isHideCrossIcon={Platform.isTV}
            headerTitle={Platform.isTV ? null : headerTitle}>
            {/* Loading State */}
            {loading && <AppLoadingIndicator />}

            {/* Error State */}
            {error && !loading && <AppErrorComponent />}

            {/* Content State */}
            {!loading && !error && mainResource && (
                <View style={styles.container}>
                    {/*----- Tv -------*/}
                    {Platform.isTV ? (
                        <View style={styles.container}>
                            {!isFallbackImageShow ? (
                                <Fragment>
                                    <ResizableImage
                                        keyId={mainResource.id || ''}
                                        style={[styles.imageStyle]}
                                        imageType={ImageType.Poster}
                                        aspectRatioKey={imageAspectRatio}
                                        skipResize={false}
                                        isPortrait={isPortrait}
                                        source={{ uri: imageUrl }}
                                        onLoad={() => setImageTimer()}
                                        onLoadEnd={() => removeImageTimer()}
                                    />
                                    <View style={styles.gradientBackgroundStyle}>
                                        <DarkGradientBackground height={'100%'} width={'100%'} />
                                    </View>
                                </Fragment>
                            ) : (
                                <View style={styles.gradientBackgroundStyle}>
                                    <FallBackGradientBackground height={'100%'} width={'100%'} />
                                </View>
                            )}

                            <Animated.ScrollView
                                style={[
                                    {
                                        opacity: isOnboarding ? 1 : opacityAnimValue,
                                        transform: [
                                            {
                                                translateY: isOnboarding ? 0 : slideInStyle,
                                            },
                                        ],
                                    },
                                    styles.scrollStyleTv,
                                ]}
                                removeClippedSubviews={false}
                                // isTVScrollable={true}
                                ref={setScrollRef}
                                contentContainerStyle={styles.scrollContainerWrapper}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={true}
                                // removeClippedSubviews={true}
                                accessibilityLabel={'Details Screen'}>
                                <View
                                    style={[
                                        styles.rowContainer,
                                        mainResource.type !== Category.Movie
                                            ? styles.movieContainer
                                            : styles.tvSeriescontainer,
                                    ]}>
                                    <View style={styles.gridBoxStyle}>
                                        <View style={styles.headerLogoStyle}>{headerTitleLogo()}</View>
                                        {renderMetaData(mainResource)}

                                        {entitlement && showProgress && resourceId && (
                                            <View style={styles.progressContainerTv}>
                                                <Animated.View
                                                    style={[styles.progressTv, { width: percentCompleted }]}
                                                />
                                            </View>
                                        )}

                                        <View style={styles.ctaWrapperStyleTV}>
                                            {entitlement && (
                                                <View
                                                    style={
                                                        showProgress && resourceId
                                                            ? styles.resumeButtonContainerTv
                                                            : styles.playButtonTvContainer
                                                    }>
                                                    <PlayButton
                                                        ref={touchableHighlightRefPlay}
                                                        onHandleBlur={() => onHandleBlur()}
                                                        styles={styles}
                                                        isFocusTopButton={isFocusTopButton}
                                                        playAvailable={playAvailable}
                                                        onPress={() => {
                                                            if (!showConfirm) {
                                                                playContent(mainResource);
                                                            } else {
                                                                showConfirmation();
                                                            }
                                                        }}
                                                        blockFocusUp={!isLengthier}
                                                        appColors={appColors}
                                                        title={
                                                            showProgress && resourceId
                                                                ? strings['playback.resume']
                                                                : undefined
                                                        }
                                                    />
                                                </View>
                                            )}

                                            {renderRedeem(mainResource)}
                                        </View>
                                    </View>
                                    <View style={styles.container}>
                                        <View style={styles.fallBackImageStyle} />
                                    </View>
                                </View>

                                <View
                                    onLayout={event => {
                                        if (event && event.nativeEvent && event.nativeEvent.layout) {
                                            const layout = event.nativeEvent.layout;
                                            setSeasonPosition(layout.y);
                                        }
                                    }}>
                                    {mainResource && seriesId ? (
                                        <SeasonsView
                                            resourceId={seriesId}
                                            seasonNumber={mainResource.seasonNumber}
                                            episodeNumber={mainResource.episodeNumber}
                                            isSeasonHasTVPreferredFocus={isFocusSeason}
                                            onHandleBlur={onHandleBlur}
                                            isEpisodeHasTVPreferredFocus={isFocusEpisode}
                                            pageNumber={1}
                                            pageSize={25}
                                            ListLoadingComponent={<SkeletonVList count={8} showTitle={true} />}
                                            ListErrorComponent={AppErrorComponent}
                                            episodeCardProps={episodeCardProps}
                                            screenOrigin={mainResource.origin}
                                        />
                                    ) : (
                                        <>
                                            <RelatedResourcesView
                                                resource={mainResource}
                                                type={RelatedType.RelatedTypeRecommendedFromService}
                                                cardProps={episodeCardProps}
                                                listStyle={styles.relatedListStyle}
                                                blockFocusRight={true}
                                                blockFocusLeft={true}
                                                isDetailsTvLayout={true}
                                                relatedSectionHeader={styles.relatedSectionTvHeaderTop}
                                            />
                                            <RelatedResourcesView
                                                resource={mainResource}
                                                type={RelatedType.RelatedTypeRecommended}
                                                cardProps={episodeCardProps}
                                                listStyle={styles.relatedListStyle}
                                                blockFocusRight={true}
                                                blockFocusLeft={true}
                                                blockFocusDown={true}
                                                isDetailsTvLayout={true}
                                                relatedSectionHeader={styles.relatedSectionTvHeader}
                                            />
                                        </>
                                    )}
                                </View>
                            </Animated.ScrollView>
                        </View>
                    ) : (
                        <Animated.ScrollView
                            style={{
                                opacity: isOnboarding ? 1 : opacityAnimValue,
                                transform: [
                                    {
                                        translateY: isOnboarding ? 0 : slideInStyle,
                                    },
                                ],
                            }}
                            showsVerticalScrollIndicator={false}
                            accessibilityLabel={'Details Screen'}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}>
                            {mainResource && (
                                <>
                                    <View style={[styles.imageWrapperStyle]}>
                                        {mainResource.image && (
                                            <FastImage
                                                key={mainResource.id || ''}
                                                style={[styles.imageStyle]}
                                                resizeMode={FastImage.resizeMode.contain}
                                                source={{ uri: `${mainResource.image}` }}
                                            />
                                        )}
                                        <ResizableImage
                                            keyId={mainResource.id || ''}
                                            style={[styles.imageStyle]}
                                            imageType={ImageType.Poster}
                                            aspectRatioKey={imageAspectRatio}
                                            skipResize={false}
                                            isPortrait={isPortrait}
                                            source={{ uri: imageUrl }}
                                        />
                                        {entitlement && (
                                            <View style={styles.playButton}>
                                                <PlayButton
                                                    onHandleBlur={() => onHandleBlur()}
                                                    styles={styles}
                                                    isFocusTopButton={isFocusTopButton}
                                                    playAvailable={playAvailable}
                                                    onPress={() => playContent(mainResource)}
                                                    appColors={appColors}
                                                />
                                            </View>
                                        )}
                                        {entitlement && showProgress && mainResource && mainResource.canDownload && (
                                            <View style={styles.progressContainer}>
                                                <Animated.View style={[styles.progress, { width: percentCompleted }]} />
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.contentWrapperStyle} onLayout={onLayout}>
                                        <View style={[styles.textWrapperStyle]}>
                                            <View style={styles.ctaWrapperStyle}>{renderRedeem(mainResource)}</View>
                                            <View style={[styles.infoContainerStyle]}>
                                                {renderMetaData(mainResource)}
                                            </View>
                                        </View>
                                        {mainResource && seriesId ? (
                                            <SeasonsView
                                                resourceId={seriesId}
                                                seasonNumber={mainResource.seasonNumber}
                                                episodeNumber={mainResource.episodeNumber}
                                                pageNumber={1}
                                                pageSize={25}
                                                ListLoadingComponent={<SkeletonVList count={8} showTitle={true} />}
                                                ListErrorComponent={AppErrorComponent}
                                                episodeCardProps={episodeCardProps}
                                                screenOrigin={mainResource.origin}
                                            />
                                        ) : (
                                            <>
                                                {/* <RelatedResourcesView
                                            resource={mainResource}
                                            type={RelatedType.RelatedTypeService}
                                            cardProps={episodeCardProps}
                                        /> */}
                                                <RelatedResourcesView
                                                    resource={mainResource}
                                                    type={RelatedType.RelatedTypeRecommendedFromService}
                                                    cardProps={episodeCardProps}
                                                />
                                                {/* <RelatedResourcesView
                                            resource={mainResource}
                                            type={RelatedType.RelatedTypeGenre}
                                            cardProps={episodeCardProps}
                                        /> */}
                                                <RelatedResourcesView
                                                    resource={mainResource}
                                                    type={RelatedType.RelatedTypeRecommended}
                                                    cardProps={episodeCardProps}
                                                />
                                            </>
                                        )}
                                        <ActionSheet
                                            ref={downloadPausedActionSheetRef}
                                            options={pausedDownloadActions.map(q => q.label)}
                                            title={strings['my_content.download_paused_title']}
                                            cancelButtonIndex={0}
                                            destructiveButtonIndex={2}
                                            onPress={async index => {
                                                if (index > 0 && resourceDownload) {
                                                    if (index === 1) {
                                                        if (
                                                            (downloadOverCellular === false &&
                                                                type === NetInfoStateType.cellular) ||
                                                            isInternetReachable === false
                                                        ) {
                                                            showDownloadError();
                                                        } else {
                                                            await downloadManager.resumeDownload(resourceDownload.id);
                                                            recordEvent(
                                                                AppEvents.DOWNLOAD_RESUMED,
                                                                condenseDownloadData(resource),
                                                            );
                                                        }
                                                    } else if (index === 2) {
                                                        await downloadManager.purgeDownload(resourceDownload.id);
                                                        recordEvent(
                                                            AppEvents.DOWNLOAD_DELETED,
                                                            condenseDownloadData(resource),
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                        <ActionSheet
                                            ref={downloadingActionSheetRef}
                                            options={inprogressDownloadActions.map(q => q.label)}
                                            title={strings['my_content.download_in_progress_title']}
                                            cancelButtonIndex={0}
                                            destructiveButtonIndex={2}
                                            onPress={async index => {
                                                if (index > 0 && resourceDownload) {
                                                    if (index === 1) {
                                                        await downloadManager.pauseDownload(resourceDownload.id);
                                                    } else if (index === 2) {
                                                        await downloadManager.purgeDownload(resourceDownload.id);
                                                        recordEvent(
                                                            AppEvents.DOWNLOAD_DELETED,
                                                            condenseDownloadData(resource),
                                                        );
                                                    }
                                                }
                                            }}
                                        />
                                        <ActionSheet
                                            ref={downloadedActionSheetRef}
                                            options={downloadedActions.map(q => q.label)}
                                            title={strings['my_content.download_remove_title']}
                                            cancelButtonIndex={0}
                                            destructiveButtonIndex={1}
                                            onPress={async index => {
                                                if (index > 0 && resourceDownload) {
                                                    await downloadManager.purgeDownload(resourceDownload.id);
                                                    recordEvent(
                                                        AppEvents.DOWNLOAD_DELETED,
                                                        condenseDownloadData(resource),
                                                    );
                                                }
                                            }}
                                        />
                                    </View>
                                </>
                            )}
                        </Animated.ScrollView>
                    )}
                </View>
            )}
        </ModalOverlay>
    );
};

const DetailScreen = ({ route, isOnboarding }: { route: any; isOnboarding?: boolean }): JSX.Element => {
    const { resourceType, resourceId } = route.params;
    const bookmarkOffset = useBookmarkOffset(resourceId);
    const response = useFetchResourceQuery(resourceId, resourceType, 'metadata');
    let entitlementResponse = useTVODEntitlement(
        response && response.mainResource ? response.mainResource.id : resourceId,
    );

    return (
        <DetailScreenUI
            route={route}
            bookmarkOffset={bookmarkOffset}
            dataResponse={response}
            entitlementResponse={entitlementResponse}
            isOnboarding={isOnboarding}
        />
    );
};

export default DetailScreen;

// move view to top of the page
function moveViewToTop(ref: any) {
    ref.scrollTo({
        x: 0,
        y: 0,
        animated: true,
    });
}

// move specific position to top of the page
function moveSeasonsAndEpisodesToTop(ref: any, seasonPosition: number | null) {
    ref.scrollTo({
        x: 0,
        y: seasonPosition,
        animated: true,
    });
}

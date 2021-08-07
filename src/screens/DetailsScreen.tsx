import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Platform,
    NativeSyntheticEvent,
    NativeScrollEvent,
    ActivityIndicator,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actionsheet';
import { useSafeArea } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
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
import { useAlert } from 'contexts/AlertContext';
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
import PlayCTAIcon from '../../assets/images/play_cta.svg';
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
    Attributes,
    getPageEventFromPageNavigation,
    getPageIdsFromPageEvents,
} from 'utils/ReportingUtils';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { canDownloadOverCellular } from 'utils/UserPreferenceUtils';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import StorefrontCardView from 'screens/components/StorefrontCardView';
import { setItem, getItem } from 'utils/UserPreferenceUtils';
import { DOWNLOAD_COMPLETE_LIST } from 'utils/DownloadBookmarkUtils';

const resourceMetadata = (appLanguage: string, resource?: ResourceVm) => {
    const metaInfo = [];
    if (resource) {
        const ratings = resource.allRatings && Object.values(resource.allRatings);
        if (resource.seasonNumber && resource.episodeNumber) {
            metaInfo.push(`S${resource.seasonNumber} E${resource.episodeNumber}`);
        }
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
    cardType = '',
}: {
    route: any;
    dataResponse: ResourceHookResponse;
    entitlementResponse: EntitlementResponse;
    bookmarkOffset?: number;
    isOnboarding?: boolean;
    cardType?: string;
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
    const [briefMode, setBriefMode] = useState(!Platform.isTV);
    const [isLengthier, setIsLengthier] = useState(false);
    const [showOpaqueHeader, setShowOpaqueHeader] = useState(false);
    const enterAnimValue = useRef(new Animated.Value(0)).current;
    const opacityAnimValue = useRef(new Animated.Value(0)).current;
    let [isReported, setIsReported] = useState<boolean>(false);
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
    const { type, isInternetReachable } = useNetworkStatus();
    const DESC_MIN_LENGTH = 120;

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    useEffect(() => {
        const setup = async () => {
            setDownloadOverCellular(await canDownloadOverCellular());
        };
        setup();
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
            setBriefMode(!Platform.isTV);
            setShowOpaqueHeader(false);
            setIsReported(false);

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
    if (mainResource && mainResource.type === Category.TVEpisode) {
        name = `${mainResource.name}`;
    }

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
        let msg, msgContent;
        if (errorCode) {
            msgContent = strings['global.error_code.' + errorCode];
            msg = strings.formatString(strings['global.error_code'], errorCode) as string;
        }
        Alert.alert(title ? title : msgContent ? msgContent : fallbackTitle, msg, [{ text: 'OK' }]);
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
        if (tvodError) {
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
        if (mainResource !== undefined && !isReported) {
            recordEvent(
                AppEvents.VIEW_CONTENT_DETAILS,
                getContentDetailsAttributes(mainResource, searchPosition, searchTerm, contentTabName, usageTabName),
                true,
            );
            setIsReported(true);
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
    const playAvailable = !platformLoading;

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

    const removeDownloadFromAStorage = async (dId: string) => {
        let updatedList = '';
        let downloadedList = await getItem(DOWNLOAD_COMPLETE_LIST, '');
        if (downloadedList) {
            downloadedList = JSON.parse(downloadedList);
            if (downloadedList !== undefined && downloadedList.length > 0) {
                const updatedDownloadedList = downloadedList.filter(
                    (item: { [key: string]: string }) => item.id !== dId,
                );
                if (updatedDownloadedList.length > 0) {
                    updatedList = JSON.stringify(updatedDownloadedList);
                }
                await setItem(DOWNLOAD_COMPLETE_LIST, updatedList);
            }
        }
    };

    return (
        <ModalOverlay
            animatedStyle={{ transform: [{ translateY: shakeAnim }] }}
            headerTransparent={true}
            headerTitle={headerTitle}>
            {/* Loading State */}
            {loading && <AppLoadingIndicator />}

            {/* Error State */}
            {error && !loading && <AppErrorComponent />}

            {/* Content State */}
            {!loading && !error && mainResource && (
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
                                {cardType === 'EmptyCard' ? (
                                    <StorefrontCardView
                                        resource={mainResource}
                                        isPortrait={isPortrait}
                                        cardType={cardType}
                                    />
                                ) : (
                                    <>
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
                                    </>
                                )}
                                {entitlement && (
                                    <View style={styles.playButton}>
                                        {playAvailable ? (
                                            <BorderlessButton
                                                activeOpacity={0.85}
                                                onPress={() => playContent(mainResource)}
                                                enabled={entitlement ? playAvailable : false}
                                                style={styles.playButton}>
                                                <PlayCTAIcon />
                                            </BorderlessButton>
                                        ) : (
                                            <ActivityIndicator style={styles.playButtonLoading} color={'white'} />
                                        )}
                                    </View>
                                )}
                                {entitlement && showProgress && (
                                    <View style={styles.progressContainer}>
                                        <Animated.View style={[styles.progress, { width: percentCompleted }]} />
                                    </View>
                                )}
                            </View>
                            <View style={styles.contentWrapperStyle} onLayout={onLayout}>
                                <View style={[styles.textWrapperStyle]}>
                                    <View style={styles.ctaWrapperStyle}>
                                        {mainResource.type !== Category.TVSeries &&
                                            (appNavigationState === 'PREVIEW_APP' ? (
                                                <Button
                                                    title={strings['preview.sign_up_btn_label']}
                                                    onPress={() => {
                                                        let data: Attributes = {};
                                                        let pageEvents = getPageEventFromPageNavigation(
                                                            NAVIGATION_TYPE.CONTENT_DETAILS,
                                                        );
                                                        data.pageID = getPageIdsFromPageEvents(pageEvents);
                                                        data.event = pageEvents;
                                                        recordEvent(pageEvents, data);
                                                        toggleModal;
                                                    }}
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
                                                        onPress={(purchaseState: RedeemState) => {
                                                            switch (purchaseState) {
                                                                case RedeemState.NotEntitled_NoCredit:
                                                                    shakeAnimation();
                                                                    break;
                                                                case RedeemState.NotEntitled:
                                                                    redeem(mainResource).then(() => {
                                                                        recordEvent(
                                                                            AppEvents.RENT_CONTENT,
                                                                            getContentDetailsAttributes(
                                                                                resource,
                                                                                searchPosition,
                                                                            ),
                                                                        );
                                                                    });
                                                                    break;
                                                                case RedeemState.Entitled:
                                                                    console.log('Play');
                                                                    break;
                                                                default:
                                                                    console.log('Do nothing');
                                                            }
                                                        }}
                                                    />
                                                    {entitlement && mainResource && mainResource.canDownload && (
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
                                    </View>
                                    <View style={[styles.infoContainerStyle]}>
                                        <View style={[styles.titleContainerStyle]}>
                                            {mainResource.seriesTitle && (
                                                <Text style={[styles.seriesTitleStyle]}>
                                                    {mainResource.seriesTitle}
                                                </Text>
                                            )}
                                            <Text style={[styles.titleStyle]}>{name}</Text>
                                            <View style={styles.titleContainerStyle}>
                                                <Text style={[styles.caption1]}>{caption1String}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.descStyle}>
                                    <Text
                                        numberOfLines={briefMode && isLengthier ? 2 : 99}
                                        ellipsizeMode={'tail'}
                                        style={[styles.infoTextStyle]}>
                                        {mainResource.longDescription
                                            ? mainResource.longDescription
                                            : mainResource.shortDescription}
                                    </Text>
                                    {briefMode && isLengthier && (
                                        <BorderlessButton onPress={() => setBriefMode(false)}>
                                            <Text style={styles.readMoreStyle}>
                                                {strings['content_detail.read_more_lbl']}
                                            </Text>
                                        </BorderlessButton>
                                    )}
                                    {!briefMode && (
                                        <BorderlessButton onPress={() => setBriefMode(true)}>
                                            <Text style={styles.readMoreStyle}>
                                                {strings['content_detail.read_less_lbl']}
                                            </Text>
                                        </BorderlessButton>
                                    )}
                                </View>
                                {mainResource && seriesId ? (
                                    <SeasonsView
                                        resourceId={seriesId}
                                        seasonNumber={mainResource.seasonNumber}
                                        episodeNumber={mainResource.episodeNumber}
                                        pageNumber={1}
                                        pageSize={100}
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
                                            cardType={cardType}
                                            setIsReported={setIsReported}
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
                                            cardType={cardType}
                                            setIsReported={setIsReported}
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
                                                recordEvent(AppEvents.DOWNLOAD_DELETED, condenseDownloadData(resource));
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
                                                recordEvent(AppEvents.DOWNLOAD_DELETED, condenseDownloadData(resource));
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
                                            await removeDownloadFromAStorage(resourceDownload.id);
                                            recordEvent(AppEvents.DOWNLOAD_DELETED, condenseDownloadData(resource));
                                        }
                                    }}
                                />
                            </View>
                        </>
                    )}
                </Animated.ScrollView>
            )}
        </ModalOverlay>
    );
};

const DetailScreen = ({ route, isOnboarding }: { route: any; isOnboarding?: boolean }): JSX.Element => {
    const { resourceType, resourceId, resource } = route.params;
    const bookmarkOffset = useBookmarkOffset(resourceId);
    const origin = resource && resource.origin ? resource.origin : 'Notification';
    const response = useFetchResourceQuery(resourceId, resourceType, 'metadata', undefined, origin);
    let entitlementResponse = useTVODEntitlement(
        response && response.mainResource ? response.mainResource.id : resourceId,
    );
    const { recordEvent } = useAnalytics();
    const { appNavigationState } = useAppState();

    useEffect(() => {
        let data: Attributes = {};
        if (appNavigationState === 'PREVIEW_APP') {
            let pageEvents = getPageEventFromPageNavigation(NAVIGATION_TYPE.CONTENT_DETAILS);
            data.pageID = getPageIdsFromPageEvents(pageEvents);
            data.event = pageEvents;
            recordEvent(pageEvents, data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

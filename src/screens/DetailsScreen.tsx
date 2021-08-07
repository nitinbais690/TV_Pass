import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Platform,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
    Animated,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions, useLayout } from '@react-native-community/hooks';
import {
    ResourceVm,
    ResourceCardViewBaseProps,
    Category,
    useFetchResourceQuery,
    ResizableImage,
} from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';

import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAlert } from 'contexts/AlertContext';

import { useTVODEntitlement } from './hooks/useTVODEntitlement';

import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';
import RelatedResourcesView, { RelatedType } from './components/RelatedResourcesView';
import AppErrorComponent from 'utils/AppErrorComponent';
import SkeletonVList from 'screens/components/loading/SkeletonVList';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { appPadding } from '../../AppStyles';
import { defaultContentDetailsStyle, imageAspectRatio } from 'styles/ContentDetails.style';
import SeasonsView from './SeasonsView';
import { PlayerProps } from './hooks/usePlayerConfig';
import { useBookmarkOffset } from 'screens/hooks/useBookmarkOffset';
import { useContinueWatchingProgress } from 'screens/hooks/useContinueWatchingProgress';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, getContentDetailsAttributes } from 'utils/ReportingUtils';
import { useAuth } from 'contexts/AuthContextProvider';
import DetailsServiceActions from '../features/details/presentation/components/organisms/DetailsServiceActions';
import DetailsTextInfo from '../features/details/presentation/components/organisms/DetailsTextInfo';
import DetailsBackground from '../features/details/presentation/components/atoms/DetailsBackground';
import Ratings from '../features/details/presentation/components/molecules/Ratings';
import DetailsPoster from '../features/details/presentation/components/atoms/DetailsPoster';

import BackArrow from 'assets/images/back_arrow.svg';
import TabOptionsView from 'features/details/presentation/components/molecules/TabOptionsView';
import FlexButtons from 'core/presentation/components/atoms/FlexButtons';
import PlayIcon from 'assets/images/small_play_icon.svg';
import { resourceMetadata, ratingMetadata, advisoryMeta } from 'features/details/utils/ContentDetailUtils';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { useFavorite } from 'qp-discovery-ui/src/hooks/useFavorites';

const DetailScreen = ({ route, navigation }: { route: any; navigation: any }): JSX.Element => {
    const insets = useSafeArea();
    const isMounted = useRef(true);
    const { onLayout, y: contentY } = useLayout();
    const { width, height } = useDimensions().window;
    const [showOpaqueHeader, setShowOpaqueHeader] = useState(false);
    const { resource, resourceType, resourceId, searchPosition } = route.params;
    const clientIdentifier = resource.source ? 'content-gateway' : 'metadata';
    const { loading, error, mainResource } = useFetchResourceQuery(resourceId, resourceType, clientIdentifier);
    const { Alert } = useAlert();
    const { strings, appLanguage } = useLocalization();
    const isPortrait = height > width;
    const { recordEvent } = useAnalytics();
    const { flAuthToken, userType } = useAuth();
    const { xAuthToken } = useEntitlements();
    const { liked, like, unlike } = useFavorite(resourceId, xAuthToken as string | undefined, flAuthToken);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    //recod rent content: issue, would record already rented content also
    const { entitlement, redeem, redeemError, error: tvodError, tvodToken } = useTVODEntitlement(resourceId);
    const bookmarkOffset = useBookmarkOffset(resourceId);
    const [showProgress, percentCompleted] = useContinueWatchingProgress(
        bookmarkOffset,
        mainResource && mainResource.runningTime,
    );

    const renderContinueWatchingOverlay = (percentCompleted: any) => {
        if (mainResource) {
            return (
                <TouchableOpacity
                    style={[styles.continueWatchingOverlayContainer]}
                    onPress={() => playContent(mainResource, showProgress ? 'resume' : 'startover')}>
                    <Animated.View style={[{ width: percentCompleted }, styles.continueWatchingOverlayView]}>
                        <LinearGradient
                            useAngle={true}
                            angle={-90}
                            colors={['rgba(255, 240, 238, 0.5)', 'rgba(255, 109, 46, 0.5)']}
                            locations={[-0.65, 1]}
                            style={[styles.continueWatchingOverlayGradient]}
                        />
                    </Animated.View>
                </TouchableOpacity>
            );
        }
        return <View />;
    };

    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = defaultContentDetailsStyle({ appColors, appPadding, isPortrait, insets, entitlement });
    const caption1String = resourceMetadata(appLanguage, mainResource);
    const ratingData = ratingMetadata(strings.premium, mainResource);
    const advisory = advisoryMeta(strings, mainResource);

    const episodeCardProps: ResourceCardViewBaseProps<ResourceVm> = {
        onResourcePress: (currentResource: ResourceVm) => {
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: currentResource,
                title: currentResource.name,
                resourceId: currentResource.id,
                resourceType: currentResource.type,
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
        name = `S${mainResource.seasonNumber} E${mainResource.episodeNumber}: ${mainResource.name}`;
    }

    const imageUrl =
        mainResource && mainResource.syndicationImages && mainResource.syndicationImages[AspectRatio._16by9];

    const playContent = (res: ResourceVm, playType: string) => {
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
            resource: { ...res, watchedOffset: playType === 'resume' ? bookmarkOffset : 0 },
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
                    text: strings['redeem.retry_btn'],
                    onPress: () => {
                        if (mainResource) {
                            redeem(mainResource);
                        }
                    },
                    style: 'cancel',
                },
                {
                    text: strings['redeem.okay_btn'],
                    onPress: () => {},
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redeemError]);

    useEffect(() => {
        recordEvent(AppEvents.VIEW_CONTENT_DETAILS, getContentDetailsAttributes(resource, searchPosition), true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resource.id]);

    // const headerTitleLogo = React.useCallback(
    //     () => <ProviderLogo provider={mainResource && mainResource.providerName} />,
    //     [mainResource],
    // );

    // Note: We need this additional check to ensure the header logos
    // are reloaded when swirching to a different provider from within the
    // details screen
    // let headerTitle;
    // if (mainResource && mainResource.id === resourceId) {
    //     headerTitle = showOpaqueHeader ? mainResource.name : headerTitleLogo;
    // }

    // Note: When user opens the app and immediately opens a details page, the platform config
    // might not be configured yet, so in such cases, we wait until either the platform is configured
    // or until the platform configuration fails
    // const platformLoading = isPlatformConfigured ? !isPlatformConfigured : !platformError;
    // const playAvailable = !platformLoading;

    const bottom = height / 4;
    const left = width - (height - bottom) * imageAspectRatio;

    function getEpisodesView(currentResource: ResourceVm) {
        return (
            <SeasonsView
                resourceId={seriesId}
                seasonNumber={currentResource.seasonNumber}
                episodeNumber={currentResource.episodeNumber}
                pageNumber={1}
                pageSize={25}
                ListLoadingComponent={<SkeletonVList count={8} showTitle={true} />}
                ListErrorComponent={AppErrorComponent}
                episodeCardProps={episodeCardProps}
                screenOrigin={currentResource.origin}
            />
        );
    }

    function getSimilarToAndPopularShowView() {
        return (
            <View style={styles.similarToAndPopularViewStyle}>
                {
                    <RelatedResourcesView
                        resource={mainResource}
                        type={RelatedType.RelatedTypeService}
                        cardProps={episodeCardProps}
                    />
                }
                {
                    <RelatedResourcesView
                        resource={mainResource}
                        type={RelatedType.RelatedTypeGenre}
                        cardProps={episodeCardProps}
                    />
                }
            </View>
        );
    }

    const isPlayable = (): boolean => {
        return resource.isFreeContent || userType === 'SUBSCRIBED';
    };
    const primaryButtonText = (): string => {
        if (isPlayable()) {
            if (showProgress) {
                return strings['global.continue_btn'];
            } else {
                return strings['content_detail.start_watching'];
            }
        } else {
            return strings.subscribe;
        }
    };

    const handlePrimaryButtonPress = (mainResource: ResourceVm): void => {
        if (isPlayable()) {
            playContent(mainResource, showProgress ? 'resume' : 'startover');
        } else {
            // TODO : Need subscribe action
        }
    };

    const handleRenderContinueWatchingOverlay = () => {
        if (isPlayable()) {
            renderContinueWatchingOverlay(percentCompleted);
        } else {
            // TODO : Need subscribe action
        }
    };

    return (
        <View style={styles.container}>
            {/* Loading State */}
            <StatusBar translucent backgroundColor={'transparent'} />
            <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
                <BackArrow />
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                accessibilityLabel={'Details Screen'}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <DetailsBackground>
                    {loading && <AppLoadingIndicator />}

                    {/* Error State */}
                    {error && <AppErrorComponent />}

                    {!loading && !error && mainResource && (
                        <>
                            <View style={styles.metaInfoWrapperStyle}>
                                <View style={[styles.imageWrapperStyle]}>
                                    <LinearGradient
                                        colors={['black', 'transparent']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0.5, y: 0.5 }}
                                        style={styles.gradientWrapper}
                                    />
                                    <DetailsPoster
                                        id={mainResource.id || ''}
                                        mainResourceImage={mainResource.image}
                                        imageUrl={imageUrl}
                                    />
                                </View>
                                <Ratings ratings={ratingData} />
                                <DetailsTextInfo
                                    seriesTitle={mainResource.seriesTitle}
                                    title={name}
                                    caption={caption1String}
                                    shortDescription={mainResource.shortDescription}
                                    longDescription={mainResource.longDescription}
                                    advisory={advisory}
                                />
                                <FlexButtons
                                    onPressPrimary={() => handlePrimaryButtonPress(mainResource)}
                                    primryButtonText={primaryButtonText()}
                                    secondaryButtonText={
                                        showProgress ? 'Play Again' : strings['content_detail.play_traier']
                                    }
                                    onPressSecondary={
                                        showProgress ? () => playContent(mainResource, 'startover') : () => {}
                                    }
                                    primaryButtonIcon={PlayIcon}
                                    primaryButtonOverlay={handleRenderContinueWatchingOverlay()}
                                    containerStyle={styles.playButtonContainer}
                                />
                                <DetailsServiceActions
                                    showTrailer={showProgress ? true : false}
                                    resource={mainResource}
                                    liked={liked}
                                    like={like}
                                    unlike={unlike}
                                />
                                <View style={styles.tabOptionsViewStyle}>
                                    <TabOptionsView
                                        resource={mainResource}
                                        episodesView={mainResource && seriesId && getEpisodesView(mainResource)}
                                    />
                                </View>
                            </View>
                            {Platform.isTV && mainResource && (
                                <>
                                    <View style={[{ ...StyleSheet.absoluteFillObject, bottom: bottom, left: left }]}>
                                        <ResizableImage
                                            keyId={mainResource.id || ''}
                                            style={[styles.imageStyle]}
                                            imageType={ImageType.Poster}
                                            aspectRatioKey={imageAspectRatio}
                                            skipResize={false}
                                            isPortrait={isPortrait}
                                            source={{ uri: imageUrl }}
                                        />
                                    </View>
                                    <LinearGradient
                                        locations={[0.35, 0.75]}
                                        colors={['transparent', appColors.primaryEnd]}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                    <LinearGradient
                                        useAngle
                                        angle={270}
                                        locations={[0.35, 0.65]}
                                        colors={['transparent', appColors.primaryEnd]}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                </>
                            )}
                            <View style={styles.contentWrapperStyle} onLayout={onLayout}>
                                <>{getSimilarToAndPopularShowView()}</>
                            </View>
                        </>
                    )}
                </DetailsBackground>
            </ScrollView>
        </View>
    );
};

export default DetailScreen;

import React, { useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { ResourceVm, Category, useFetchResourceQuery } from 'qp-discovery-ui';
import { AspectRatio } from 'qp-common-ui';

import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAlert } from 'contexts/AlertContext';
import { useTVODEntitlement } from '../../../../../../screens/hooks/useTVODEntitlement';

import AppErrorComponent from 'utils/AppErrorComponent';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { defaultContentDetailsPopupStyle } from 'features/details/presentation/components/template/DetailPopupScreen/styles';
import { PlayerProps } from '../../../../../../screens/hooks/usePlayerConfig';
import { useBookmarkOffset } from 'screens/hooks/useBookmarkOffset';
import { useContinueWatchingProgress } from 'screens/hooks/useContinueWatchingProgress';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, getContentDetailsAttributes } from 'utils/ReportingUtils';
import DetailsServiceActions from '../../organisms/DetailsServiceActions';
import Ratings from '../../molecules/Ratings';

import FlexButtons from 'core/presentation/components/atoms/FlexButtons';
import PlayIcon from 'assets/images/small_play_icon.svg';
import DetailsDescription from 'features/details/presentation/components/atoms/DetailsDescription';
import ViewDetailsButton from 'features/details/presentation/components/atoms/ViewDetailButton';
import DetailsThumbnailAndCaption from 'features/details/presentation/components/molecules/DetailsThumbnailAndCaption';
import { useNavigation } from '@react-navigation/core';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import PopUp from 'core/presentation/components/molecules/PopUp';
import { resourceMetadata, ratingMetadata, advisoryMeta } from 'features/details/utils/ContentDetailUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { useFavorite } from 'qp-discovery-ui/src/hooks/useFavorites';

const DetailPopupScreen = ({ data, onModelClosed }: ContentDetailPopUpProps): JSX.Element => {
    const navigation = useNavigation();
    const { resource, resourceType, resourceId, searchPosition } = data;
    const clientIdentifier = resource.source ? 'content-gateway' : 'metadata';
    const { loading, error, mainResource } = useFetchResourceQuery(resourceId, resourceType, clientIdentifier);
    const { Alert } = useAlert();
    const { strings, appLanguage } = useLocalization();
    const { recordEvent } = useAnalytics();
    const { flAuthToken, userType } = useAuth();
    const { xAuthToken } = useEntitlements();
    const { liked, like, unlike } = useFavorite(resourceId, xAuthToken as string | undefined, flAuthToken);

    //recod rent content: issue, would record already rented content also
    const { redeem, redeemError, error: tvodError, tvodToken } = useTVODEntitlement(resourceId);
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

    const styles = defaultContentDetailsPopupStyle({ appColors });
    const caption1String = resourceMetadata(appLanguage, mainResource);
    const ratingData = ratingMetadata(strings.premium, mainResource);
    const advisory = advisoryMeta(strings, mainResource);

    let name = mainResource && mainResource.name;
    if (mainResource && mainResource.type === Category.TVEpisode) {
        name = `S${mainResource.seasonNumber} E${mainResource.episodeNumber}: ${mainResource.name}`;
    }

    const imageUrl =
        mainResource && mainResource.syndicationImages && mainResource.syndicationImages[AspectRatio._16by9];

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

    const onDetailViewClicked = (currentResource: ResourceVm) => {
        onModelClosed();
        navigation.push(NAVIGATION_TYPE.CONTENT_DETAILS, {
            resource: currentResource,
            title: currentResource.name,
            resourceId: currentResource.id,
            resourceType: currentResource.type,
        });
    };

    const handleNavigation = () => {
        onModelClosed();
    };

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

        onModelClosed();
        navigation.navigate('Player', playerProps);
    };

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
        <View>
            <PopUp onModelClosed={onModelClosed}>
                {/* Loading State */}
                {loading && <AppLoadingIndicator style={styles.height50} />}

                {/* Error State */}
                {error && <AppErrorComponent />}

                {!loading && !error && mainResource && (
                    <View style={styles.metaInfoWrapperStyle}>
                        <Ratings ratings={ratingData} />

                        <DetailsThumbnailAndCaption
                            advisory={advisory}
                            caption1String={caption1String}
                            image={mainResource.image}
                            resourceId={mainResource.id}
                            seriesTitle={mainResource.seriesTitle}
                            imageUrl={imageUrl}
                            name={name}
                        />

                        <DetailsDescription
                            style={styles.contentText}
                            showLongOnly={true}
                            shortDescription={mainResource.shortDescription}
                            longDescription={mainResource.longDescription}
                        />
                        <FlexButtons
                            onPressPrimary={() => handlePrimaryButtonPress(mainResource)}
                            primryButtonText={primaryButtonText()}
                            secondaryButtonText={showProgress ? 'Play Again' : strings['content_detail.play_traier']}
                            onPressSecondary={showProgress ? () => playContent(mainResource, 'startover') : () => {}}
                            primaryButtonIcon={PlayIcon}
                            primaryButtonOverlay={handleRenderContinueWatchingOverlay()}
                            containerStyle={styles.playButtonContainer}
                        />
                        <DetailsServiceActions
                            showTrailer={showProgress ? true : false}
                            resource={mainResource}
                            onNavigate={handleNavigation}
                            liked={liked}
                            like={like}
                            unlike={unlike}
                        />
                        <ViewDetailsButton
                            appColors={appColors}
                            openDetailContent={() => {
                                onDetailViewClicked(mainResource);
                            }}
                        />
                    </View>
                )}
            </PopUp>
        </View>
    );
};

const DetailPopup = ({ data, onModelClosed }: ContentDetailPopUpProps): JSX.Element => {
    let isModalVisible = false;
    if (data && data.resourceId) {
        isModalVisible = true;
    }
    return <>{isModalVisible && <DetailPopupScreen data={data} onModelClosed={onModelClosed} />}</>;
};

export default DetailPopup;

interface ContentDetailPopUpProps {
    data: any;
    onModelClosed: any;
}

import React, { useState, useRef, useCallback } from 'react';
import {
    ActivityIndicator,
    ListRenderItem,
    StyleProp,
    View,
    ViewStyle,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    TouchableOpacity,
    findNodeHandle,
    useTVEventHandler,
} from 'react-native';
import { ResourceCardViewBaseProps, ResourceVm, ResizableImage } from 'qp-discovery-ui';
import { useFetchTVEpisodesQuery } from 'qp-discovery-ui/src/api';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { appDimensions, appFonts, appPadding, tvPixelSizeForLayout } from '../../AppStyles';
// import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Pill } from './components/Pill';
import CreditsIcon from '../../assets/images/credits_small.svg';
import LinearGradient from 'react-native-linear-gradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { ImageProps } from 'react-native-svg';
import AppContant from 'utils/AppContant';

export interface EpisodesListViewProps {
    /**
     * Allows the ability to provide a custom rendering of `ResourceVm`.
     * When none is provided, the default rendering would apply.
     */
    renderItem?: ListRenderItem<ResourceVm>;
    /**
     * Styles for list's card props
     */
    cardProps: ResourceCardViewBaseProps<ResourceVm>;
    /**
     * Series Id
     */
    seriesId: string;
    /**
     * Season Id
     */
    seasonId: string;
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   const styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /**
     * FlatLists' property
     */
    removeClippedSubviews?: boolean;

    /**
     * Allows the ability to provide a custom rendering of `Download icon`.
     * When none is provided, the default rendering would ignore it.
     */
    renderDownloadItem?: (resource: ResourceVm) => React.ReactNode;

    /**
     * Indicates parent screen name to report analytics
     */
    screenName?: string;

    /**
     * Indicates the episode number of the Tv Series that is highlighted.
     */
    episodeNumber?: number | undefined;
    /**
     * Rendered when the list is loading.
     */
    ListLoadingComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Rendered when the list has an error.
     */
    ListErrorComponent?: React.ComponentType<any> | React.ReactElement | null;

    /**
     * provide focus to initial item of list of season in episode.
     */
    isEpisodeHasTVPreferredFocus?: boolean;

    /**
     * active season.
     */
    activeSeasonIndex: number;
    /**
     * change season.
     */
    onChangeSeason?: (seasonIndex: number, isIncrease: boolean) => {};
    /**
     * help to sift focus from list.
     */
    onHandleBlur?: (type: string, index: number) => void;
}

const ResourceListView = ({
    resources,
    onResourcePress,
    onEndReached,
    onEndReachedThreshold,
    hasMore,
    episodeNumber,
    isEpisodeHasTVPreferredFocus,
    onChangeSeason,
    activeSeasonIndex,
    onHandleBlur,
}: {
    resources: ResourceVm[];
    onResourcePress: (resource: ResourceVm) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    hasMore?: boolean;
    episodeNumber: number | undefined;
    isEpisodeHasTVPreferredFocus: boolean;
    activeSeasonIndex?: number;
    onChangeSeason?: () => void;
    onHandleBlur: (type: string, index: number) => void;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    // const { width, height } = useDimensions().window;
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const flatlistRef = useRef(null);
    // const isPortrait = height > width;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                listContainerTV: {
                    marginTop: tvPixelSizeForLayout(36),
                },
                container: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 16, // We want same vertical spacing on tablets, so this shld be hard-coded
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: appColors.border,
                },
                activeContainer: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 16,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: appColors.border,
                    backgroundColor: appColors.primaryVariant1,
                },
                imageWrapper: {
                    width: Platform.isTV ? tvPixelSizeForLayout(296) : '40%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: 5,
                },
                image: {
                    flex: 1,
                    aspectRatio: AspectRatio._16by9,
                    backgroundColor: appColors.primaryVariant2,
                    borderRadius: 10,
                },
                textContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginHorizontal: Platform.isTV ? tvPixelSizeForLayout(35) : appPadding.sm(true),
                    marginVertical: selectDeviceType({ Handset: 0, Tv: 0 }, appPadding.xxs(true)),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: selectDeviceType({ Handset: appFonts.xs, Tv: tvPixelSizeForLayout(32) }, appFonts.md),
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.primary,
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
                    color: appColors.tertiary,
                    textTransform: 'none',
                },

                overviewWrapperStyle: {
                    ...StyleSheet.absoluteFillObject,
                    top: undefined,
                },
                imageWrapperStyle: {
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: appColors.secondary,
                    alignSelf: 'center',
                    flexShrink: 0,
                },
                footer: {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                },
                pillWrapper: {
                    flex: 1,
                    flexDirection: 'row',
                    marginHorizontal: 4,
                    marginVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                pillText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
                    fontWeight: '500',
                    marginLeft: Platform.isTV ? tvPixelSizeForLayout(2) : 2,
                },
                overlayContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    padding: Platform.isTV ? tvPixelSizeForLayout(10) : 6,
                },
                gradient: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 10,
                },

                overviewWrapperStyleTV: {
                    bottom: 0,
                    left: 0,
                    position: 'absolute',
                },
                activeContainerTv: {
                    borderColor: appColors.secondary,
                    borderWidth: tvPixelSizeForLayout(4),
                    backgroundColor: appColors.primaryVariant1,
                    flex: 1,
                    flexDirection: 'row',
                    padding: tvPixelSizeForLayout(36),
                    borderRadius: tvPixelSizeForLayout(30),
                },
                containerTv: {
                    flex: 1,
                    flexDirection: 'row',
                    padding: tvPixelSizeForLayout(36),
                    borderColor: appColors.border,
                    borderRadius: tvPixelSizeForLayout(30),
                },
                captionTypographyRowTv: {
                    flexDirection: 'row',
                },
                episodeContainer: {
                    height: appDimensions.fullHeight,
                },
            }),
        [
            appColors.border,
            appColors.primaryVariant1,
            appColors.primaryVariant2,
            appColors.secondary,
            appColors.tertiary,
        ],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const [isReachedLastEpisode, setReachedLastEpisode] = useState<boolean>(false);

    const myEpisodeTVEventHandler = (evt: { eventType: string }) => {
        if (evt && evt.eventType === AppContant.down && isReachedLastEpisode && onChangeSeason) {
            onChangeSeason(activeSeasonIndex + 1, true);
            setReachedLastEpisode(false);
        }
    };

    useTVEventHandler(myEpisodeTVEventHandler);

    const onReachStartEnd = useCallback(
        index => {
            if (index === resources.length - 1 && onChangeSeason) {
                setReachedLastEpisode(true);
            }
        },
        [onChangeSeason, resources.length],
    );

    const shiftScrollToFocusIndex = (index: number) => {
        if (flatlistRef.current && flatlistRef.current.scrollToIndex && flatlistRef.current.scrollToIndex) {
            flatlistRef.current.scrollToIndex({ animated: true, index });
        }
    };

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            return (
                <EpisodeCard
                    item={item}
                    index={index}
                    onReachStartEnd={() => onReachStartEnd(index)}
                    onHandleBlur={onHandleBlur}
                    hasTVPreferredFocus={isEpisodeHasTVPreferredFocus && index === 0}
                    styles={styles}
                    onSelectItemPress={() => onResourcePress(item)}
                    episodeNumber={episodeNumber}
                    shiftScrollToFocusIndex={() => shiftScrollToFocusIndex && shiftScrollToFocusIndex(index)}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [episodeNumber, isEpisodeHasTVPreferredFocus, onHandleBlur, onReachStartEnd, onResourcePress, styles],
    );

    const getContentContainerPaddingRight = () => {
        const screenHeight = appDimensions.fullHeight;
        let cardPerScreen = screenHeight / tvPixelSizeForLayout(12.5);
        return (cardPerScreen - 1) * tvPixelSizeForLayout(10);
    };

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            horizontal={false}
            numColumns={1}
            ref={flatlistRef}
            removeClippedSubviews={false}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={resources}
            renderItem={defaultRenderResource}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListFooterComponent={hasMore ? LoadingComponent : null}
            style={Platform.isTV ? styles.episodeContainer : undefined}
            contentContainerStyle={
                Platform.isTV
                    ? { ...styles.listContainerTV, paddingBottom: getContentContainerPaddingRight() }
                    : undefined
            }
        />
    );
};

const OverlayView = ({ resource, styles }: { resource: ResourceVm; styles: any }) => {
    return (
        <View style={styles.overlayContainer}>
            {!Platform.isTV && (
                <LinearGradient
                    locations={[0, 1]}
                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                />
            )}
            <View style={styles.footer}>
                {!!resource.credits && (
                    <Pill>
                        <View style={styles.pillWrapper}>
                            <CreditsIcon width={tvPixelSizeForLayout(20)} height={tvPixelSizeForLayout(20)} />
                            <Text style={styles.pillText}>{resource.credits}</Text>
                        </View>
                    </Pill>
                )}
            </View>
        </View>
    );
};

export const ActiveContainer = ({ isActive, children, styles }: { isActive: boolean; children: any; styles: any }) => {
    if (Platform.isTV) {
        return <View style={isActive ? styles.activeContainerTv : styles.containerTv}>{children}</View>;
    } else {
        return <View style={isActive ? styles.activeContainer : styles.container}>{children}</View>;
    }
};

interface cardImageProps {
    id: string;
    imageStyle: ImageProps;
    item: ResourceVm;
}

// function imagePropsAreEqual(prev: cardImageProps, next: cardImageProps) {
//     return prev.id === next.id && Object.is(prev.imageStyle, next.imageStyle);
// }

const EpisodeCardImage = ({ item, imageStyle }: cardImageProps) => {
    return (
        <ResizableImage
            keyId={item.id}
            aspectRatioKey={AspectRatio._16by9}
            imageType={ImageType.Poster}
            style={imageStyle}
        />
    );
};

const EpisodeCard = ({
    item,
    onSelectItemPress,
    styles,
    episodeNumber,
    hasTVPreferredFocus,
    onReachStartEnd,
    onHandleBlur,
    index,
    shiftScrollToFocusIndex,
}: {
    item: ResourceVm;
    episodeNumber?: number | undefined;
    onSelectItemPress: () => void;
    styles: any;
    hasTVPreferredFocus?: boolean;
    onReachStartEnd?: () => void;
    onHandleBlur: (type: string, listIndex: number) => void;
    index: number;
    shiftScrollToFocusIndex: (index: number) => void;
}) => {
    const [isItemFocused, setIsItemFocused] = useState(false);
    const { strings } = useLocalization();
    const releaseYear = (item && item.releaseYear) || '';
    const touchableHighlightRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onSelectItemPress}
            ref={onRef}
            hasTVPreferredFocus={hasTVPreferredFocus}
            nextFocusRight={findNodeHandle(touchableHighlightRef.current)}
            onFocus={
                Platform.isTV
                    ? () => {
                          shiftScrollToFocusIndex(index);
                          onReachStartEnd && onReachStartEnd();
                          setIsItemFocused(true);
                      }
                    : undefined
            }
            onBlur={
                Platform.isTV
                    ? () => {
                          onHandleBlur(AppContant.EPISODE, index);
                          setIsItemFocused(false);
                      }
                    : undefined
            }>
            <ActiveContainer
                styles={styles}
                isActive={
                    Platform.isTV
                        ? isItemFocused
                        : episodeNumber === item.episodeNumber
                        ? styles.activeContainer
                        : styles.container
                }>
                <View style={styles.imageWrapper}>
                    <EpisodeCardImage item={item} imageStyle={styles.image} />
                    <View style={[Platform.isTV ? styles.overviewWrapperStyleTV : styles.overviewWrapperStyle]}>
                        {<OverlayView resource={item} styles={styles} />}
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <View>
                        <Text style={[styles.titleTypography, styles.title]}>
                            {strings.formatString(strings['content_detail.episode_ordinal_lbl'], item.episodeNumber)}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.titleTypography, styles.title]}>
                            {item.name}
                        </Text>
                    </View>
                    {Platform.isTV ? (
                        <View style={styles.captionTypographyRowTv}>
                            <Text style={[styles.captionTypography]}>{item.formattedRunningTime}</Text>
                            <Text style={[styles.captionTypography]}>
                                {' - ' + strings.formatString(strings['content_detail.tvseries_aired_on'], releaseYear)}
                            </Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={[styles.captionTypography]}>
                                {strings.formatString(strings['content_detail.tvseries_aired_on'], releaseYear)}
                            </Text>
                            <Text style={[styles.captionTypography]}>{item.formattedRunningTime}</Text>
                        </View>
                    )}
                </View>
            </ActiveContainer>
        </TouchableOpacity>
    );
};

export const EpisodesListView = (props: EpisodesListViewProps): JSX.Element => {
    const {
        cardProps,
        seriesId,
        seasonId,
        screenName,
        episodeNumber,
        ListLoadingComponent,
        isEpisodeHasTVPreferredFocus,
        onChangeSeason,
        activeSeasonIndex,
        onHandleBlur,
    } = props;
    const { episodes, loading, error } = useFetchTVEpisodesQuery(seriesId, seasonId, screenName, 1, 25);
    return (
        <>
            {loading && ListLoadingComponent && ListLoadingComponent}

            {!loading && !error && episodes.length > 0 && (
                <>
                    <ResourceListView
                        resources={episodes}
                        onResourcePress={cardProps.onResourcePress!}
                        onEndReachedThreshold={0.7}
                        isEpisodeHasTVPreferredFocus={isEpisodeHasTVPreferredFocus}
                        episodeNumber={episodeNumber}
                        onChangeSeason={onChangeSeason}
                        activeSeasonIndex={activeSeasonIndex}
                        onHandleBlur={onHandleBlur}
                    />
                </>
            )}
        </>
    );
};

export default EpisodesListView;

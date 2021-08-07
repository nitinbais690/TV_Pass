import React, { useState } from 'react';
import {
    ActivityIndicator,
    ListRenderItem,
    StyleProp,
    View,
    ViewStyle,
    Text,
    FlatList,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import { ResourceCardViewBaseProps, ResourceVm, ResizableImage } from 'qp-discovery-ui';
import { useFetchTVEpisodesQuery } from 'qp-discovery-ui/src/api';
import { AspectRatio, ImageType, selectDeviceType, scale } from 'qp-common-ui';
import { appFonts, appPadding, isTablet } from 'core/styles/AppStyles';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import LinearGradient from 'react-native-linear-gradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useDimensions } from '@react-native-community/hooks';
import PlayInline from 'assets/images/play_inline.svg';
import DownloadButton from 'features/downloads/presentation/components/atoms/DownloadButton';

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
}

const ResourceListView = ({
    resources,
    onResourcePress,
    onEndReached,
    onEndReachedThreshold,
    hasMore,
}: {
    resources: ResourceVm[];
    onResourcePress: (resource: ResourceVm) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    hasMore?: boolean;
    episodeNumber: number | undefined;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                listContainer: {},
                container: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: scale(8),
                    paddingVertical: scale(4), // We want same vertical spacing on tablets, so this shld be hard-code
                },
                imageWrapper: {
                    ...(isTablet
                        ? {
                              width: scale(137),
                              height: scale(85),
                          }
                        : {
                              width: scale(104),
                              height: scale(64),
                          }),
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: scale(8),
                },
                inlinePlay: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    ...(isTablet
                        ? {
                              marginBottom: scale(9),
                              marginEnd: scale(8),
                              width: scale(21),
                              height: scale(21),
                          }
                        : {
                              marginBottom: scale(6),
                              marginEnd: scale(10),
                              width: scale(16),
                              height: scale(16),
                          }),
                },
                image: {
                    flex: 1,
                    aspectRatio: AspectRatio._16by9,
                    backgroundColor: appColors.primaryVariant2,
                    borderRadius: 10,
                },
                textContainer: {
                    flex: 1,
                    marginHorizontal: appPadding.sm(true),
                    marginVertical: selectDeviceType({ Handset: 0 }, appPadding.xxs(true)),
                },
                downloadSeason: {
                    ...(isTablet
                        ? {
                              width: scale(32),
                              height: scale(32),
                          }
                        : {
                              width: scale(30),
                              height: scale(30),
                          }),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xxs,
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xxs,
                    fontWeight: '600',
                    color: appColors.tertiary,
                    textTransform: 'none',
                    marginTop: scale(6),
                },
                overviewWrapperStyle: {
                    flex: 1,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    height: '50%',
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
                    margin: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                pillText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xxs,
                    fontWeight: '500',
                    marginLeft: 2,
                    textTransform: 'capitalize',
                },
                overlayContainer: {
                    flex: 1,
                },
                gradient: {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderBottomLeftRadius: scale(8),
                    borderBottomRightRadius: scale(8),
                    opacity: 0.5,
                },
                onFocusCardStyle: {
                    borderStyle: 'solid',
                    borderColor: 'red', //appColors.primary,
                    borderWidth: 14,
                    elevation: 14,
                    // transform: [{ scaleX: 1.12 }, { scaleY: 1.12 }],
                },
                tvParallaxProperties: {
                    //  magnification: 1.0,
                },
            }),
        [appColors.primaryVariant2, appColors.secondary, appColors.tertiary],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);
    const { strings } = useLocalization();
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const shouldApplyFocusStyle = true; //Platform.OS === 'android' && Platform.isTV;

    const onCardFocus = (): void => {
        setIsFocussed(true);
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
    };

    const OverlayView = () => {
        return (
            <View style={styles.overlayContainer}>
                <LinearGradient colors={['transparent', 'rgb(0, 0, 0)']} style={styles.gradient} />
            </View>
        );
    };

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            return (
                //   <BorderlessButton onPress={() => onResourcePress(item)}>
                <TouchableHighlight
                    style={[styles.container, isFocussed ? styles.onFocusCardStyle : undefined]}
                    underlayColor={appColors.primaryVariant1}
                    activeOpacity={0.5}
                    onPress={() => onResourcePress(item)}
                    onFocus={shouldApplyFocusStyle ? onCardFocus : undefined}
                    onBlur={shouldApplyFocusStyle ? onCardBlur : undefined}>
                    <View style={styles.container}>
                        <View style={styles.imageWrapper}>
                            <ResizableImage
                                keyId={item.id}
                                aspectRatioKey={AspectRatio._16by9}
                                imageType={ImageType.Poster}
                                style={styles.image}
                            />
                            <View style={[styles.overviewWrapperStyle]}>
                                <OverlayView resource={item} />
                            </View>
                            <PlayInline style={styles.inlinePlay} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.titleTypography, styles.title]}>{index + 1 + '. ' + item.name}</Text>
                            <Text style={[styles.captionTypography]}>
                                {strings.formatString(strings['content_detail.episode_ordinal_lbl'], index + 1) +
                                    ' | ' +
                                    item.formattedRunningTime}
                            </Text>
                        </View>
                        <DownloadButton
                            width={styles.downloadSeason.width}
                            height={styles.downloadSeason.height}
                            resource={item}
                            borderless={true}
                        />
                    </View>
                </TouchableHighlight>
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            horizontal={false}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            data={resources}
            renderItem={defaultRenderResource}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListFooterComponent={hasMore ? LoadingComponent : null}
        />
    );
};

export const EpisodesListView = (props: EpisodesListViewProps): JSX.Element => {
    const { cardProps, seriesId, seasonId, screenName, episodeNumber, ListLoadingComponent } = props;
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
                        episodeNumber={episodeNumber}
                    />
                </>
            )}
        </>
    );
};

export default EpisodesListView;

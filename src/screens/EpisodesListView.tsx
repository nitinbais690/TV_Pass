import React from 'react';
import {
    ActivityIndicator,
    ListRenderItem,
    StyleProp,
    View,
    ViewStyle,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import { ResourceCardViewBaseProps, ResourceVm, ResizableImage } from 'qp-discovery-ui';
import { useFetchTVEpisodesQuery } from 'qp-discovery-ui/src/api';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { appFonts, appPadding } from '../../AppStyles';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Pill } from './components/Pill';
import CreditsIcon from '../../assets/images/credits_small.svg';
import LinearGradient from 'react-native-linear-gradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { useDimensions } from '@react-native-community/hooks';

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
    episodeNumber,
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
                    width: '40%',
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
                    marginHorizontal: appPadding.sm(true),
                    marginVertical: selectDeviceType({ Handset: 0 }, appPadding.xxs(true)),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: selectDeviceType({ Handset: appFonts.xs }, appFonts.md),
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xxs,
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
                    fontSize: appFonts.xxs,
                    fontWeight: '500',
                    marginLeft: 2,
                },
                overlayContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    padding: 6,
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
    const { strings } = useLocalization();

    const OverlayView = ({ resource }: { resource: ResourceVm }) => {
        return (
            <View style={styles.overlayContainer}>
                <LinearGradient
                    locations={[0, 1]}
                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradient}
                />
                <View style={styles.footer}>
                    {!!resource.credits && (
                        <Pill>
                            <View style={styles.pillWrapper}>
                                <CreditsIcon />
                                <Text style={styles.pillText}>{resource.credits}</Text>
                            </View>
                        </Pill>
                    )}
                </View>
            </View>
        );
    };

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            const releaseYear = (item && item.releaseYear) || '';
            return (
                <BorderlessButton onPress={() => onResourcePress(item)}>
                    <View style={episodeNumber === item?.episodeNumber ? styles.activeContainer : styles.container}>
                        <View style={styles.imageWrapper}>
                            <ResizableImage
                                keyId={item.id}
                                aspectRatioKey={AspectRatio._16by9}
                                imageType={ImageType.Poster}
                                style={styles.image}
                            />
                            <View style={[styles.overviewWrapperStyle]}>{<OverlayView resource={item} />}</View>
                        </View>
                        <View style={styles.textContainer}>
                            <View>
                                <Text style={[styles.titleTypography, styles.title]}>
                                    {strings.formatString(
                                        strings['content_detail.episode_ordinal_lbl'],
                                        item?.episodeNumber,
                                    )}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={[styles.titleTypography, styles.title]}>
                                    {item.name}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.captionTypography]}>
                                    {strings.formatString(strings['content_detail.tvseries_aired_on'], releaseYear)}
                                </Text>
                                <Text style={[styles.captionTypography]}>{item.formattedRunningTime}</Text>
                            </View>
                        </View>
                    </View>
                </BorderlessButton>
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

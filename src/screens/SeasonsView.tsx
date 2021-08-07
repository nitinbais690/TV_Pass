import React, { useState, useCallback, useRef } from 'react';
import { View, Platform, TouchableOpacity, Text, FlatList, findNodeHandle } from 'react-native';
import { DropDownMenuView, ResourceCardViewBaseProps, ResourceVm, useFetchTVSeriesQuery } from 'qp-discovery-ui';
import { defaultDropDownMenuStyle, defaultEpisodesCardStyle } from 'styles/ContentDetails.style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import EpisodesListView from './EpisodesListView';
import SkeletonVList from 'screens/components/loading/SkeletonVList';
import AppContant from 'utils/AppContant';
export interface SeasonsViewProps {
    /**
     * Resource Id
     */
    resourceId: string;
    /**
     * Page number
     */
    pageNumber?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Rendered when the list is loading.
     */
    ListLoadingComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Rendered when the list has an error.
     */
    ListErrorComponent?: React.ComponentType<any> | React.ReactElement | null;

    episodeCardProps: ResourceCardViewBaseProps<ResourceVm>;

    /**
     * Allows the ability to provide a custom rendering of `Download icon`.
     * When none is provided, the default rendering would ignore it.
     */
    renderDownloadItem?: (resource: ResourceVm) => React.ReactNode;

    /**
     * Indicates the parent screen name to report to analytics
     */
    screenOrigin?: string;

    /**
     * Indicates the season number of the Tv Series.
     */
    seasonNumber?: number;

    /**
     * Indicates the episode number of the Tv Series that is highlighted.
     */
    episodeNumber?: number;

    /**
     * provide focus to initial item of list of season in episode.
     */
    isEpisodeHasTVPreferredFocus?: boolean;

    /**
     * provide focus to initial item of list of season in tv.
     */
    isSeasonHasTVPreferredFocus?: boolean;

    /**
     * help to sift focus from list.
     */
    onHandleBlur?: (type: string, index: number) => void;
}

const SeasonItemView = ({
    title,
    onSelectSeason,
    activeSeasonIndex,
    styles,
    index,
    hasTVPreferredFocus,
    onHandleBlur,
    blockFocusDown,
}: {
    title: string;
    onSelectSeason: () => void;
    activeSeasonIndex: number;
    styles: any;
    index: number;
    hasTVPreferredFocus: boolean | undefined;
    onHandleBlur: (type: string, index?: number) => void;
    blockFocusDown: boolean;
}) => {
    const [isItemFocus, setItemFocused] = useState<boolean>(false);
    let isActiveItem = Platform.isTV ? isItemFocus : false;
    const touchableHighlightRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            hasTVPreferredFocus={hasTVPreferredFocus}
            onFocus={
                Platform.isTV
                    ? () => {
                          setItemFocused(true);
                      }
                    : undefined
            }
            onBlur={
                Platform.isTV
                    ? () => {
                          onHandleBlur(AppContant.SEASON, index);
                          setItemFocused(false);
                      }
                    : undefined
            }
            ref={onRef}
            nextFocusLeft={findNodeHandle(touchableHighlightRef.current)}
            nextFocusDown={blockFocusDown ? findNodeHandle(touchableHighlightRef.current) : null}
            onPress={onSelectSeason}
            style={[
                styles.seasonContainerStyle,
                isActiveItem
                    ? styles.focusedSeasonContainerStyle
                    : activeSeasonIndex === index && styles.activeSeasonContainerStyle,
            ]}>
            <Text
                style={[
                    styles.headingTextStyle,
                    isActiveItem || activeSeasonIndex === index ? styles.activeTextStyle : styles.inActiveTextStyle,
                ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const SeasonsView = (props: SeasonsViewProps): JSX.Element => {
    const {
        resourceId,
        seasonNumber,
        episodeNumber,
        pageSize,
        pageNumber,
        ListLoadingComponent,
        ListErrorComponent,
        episodeCardProps,
        renderDownloadItem,
        screenOrigin,
        isEpisodeHasTVPreferredFocus,
        isSeasonHasTVPreferredFocus,
        onHandleBlur,
    } = props;

    const { loading, error, seasons } = useFetchTVSeriesQuery(
        resourceId,
        'seasons',
        screenOrigin,
        pageSize,
        pageNumber,
    );

    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings } = useLocalization();
    const [season, setSeason] = useState<ResourceVm | undefined>(undefined);
    const [changingSeasonTV, setChangingSeasonTv] = useState<boolean>(false);
    const styles = defaultEpisodesCardStyle({ appColors });
    const dropDownStyles = defaultDropDownMenuStyle({ appColors });
    const routes = seasons.map(season => {
        const seasonNumber = season.seasonNumber;
        return {
            key: seasonNumber,
            title: 'Season ' + seasonNumber,
            testID: seasonNumber,
            accessibilityLabel: 'Season ' + seasonNumber,
        };
    });
    const data = routes.map(d => d.title);
    //Sorting the tvseasons in descending order to match Web UI design
    data.sort((a, b) => b - a).reverse();

    let activeSeasonIndex = season ? seasons.findIndex(s => s.seasonNumber === season.seasonNumber) : 0;

    const renderSeasonView = ({ item, index }) => {
        return (
            <SeasonItemView
                onSelectSeason={() => {
                    setSeason(seasons[index]);
                }}
                activeSeasonIndex={activeSeasonIndex}
                hasTVPreferredFocus={isSeasonHasTVPreferredFocus && index === activeSeasonIndex}
                title={item}
                blockFocusDown={index === data.length - 1}
                onHandleBlur={onHandleBlur}
                styles={styles}
                index={index}
                key={index}
            />
        );
    };

    const renderSeasonsPage = (seasons: ResourceVm[], episodeNumber: number) => {
        if (seasons && season === undefined) {
            if (seasonNumber) {
                setSeason(seasons.find(s => s.seasonNumber === seasonNumber));
            } else if (seasons.length > 0) {
                setSeason(seasons[0]);
            }
        }

        const ChangeSeason = (seasonIndex: number) => {
            if (seasonIndex !== activeSeasonIndex) {
                if (seasonIndex === seasons.length) {
                    setSeason(seasons[0]);
                    setChangingSeasonTv(true);
                } else {
                    setSeason(seasons[seasonIndex]);
                    setChangingSeasonTv(true);
                }
            }
        };

        return (
            <View style={styles.episodesListViewContainer}>
                {Platform.isTV && (
                    <View style={styles.seasonListContainer}>
                        <FlatList
                            nestedScrollEnabled={true}
                            data={data}
                            removeClippedSubviews={false}
                            scrollEnabled={true}
                            renderItem={renderSeasonView}
                            keyExtractor={item => item.id}
                            horizontal={false}
                        />
                    </View>
                )}

                {season && resourceId && (
                    <EpisodesListView
                        seriesId={resourceId}
                        seasonId={season.id}
                        episodeNumber={episodeNumber}
                        onHandleBlur={onHandleBlur}
                        activeSeasonIndex={activeSeasonIndex}
                        onChangeSeason={(seasonIndex: number) => {
                            ChangeSeason(seasonIndex);
                        }}
                        isEpisodeHasTVPreferredFocus={
                            changingSeasonTV ? changingSeasonTV : isEpisodeHasTVPreferredFocus
                        }
                        cardProps={episodeCardProps}
                        screenName={screenOrigin}
                        renderDownloadItem={renderDownloadItem}
                        ListLoadingComponent={<SkeletonVList count={8} />}
                        ListErrorComponent={ListErrorComponent}
                    />
                )}
            </View>
        );
    };

    return (
        <>
            {loading && ListLoadingComponent}

            {error && ListErrorComponent}

            {!loading && !error && (
                <View style={[styles.containerStyle, Platform.isTV && styles.containerStyleTv]}>
                    <View style={[styles.dropDownContainer]}>
                        {Platform.isTV && (
                            <View style={styles.seasonHeadingContainer}>
                                <Text style={styles.headingTextStyle}>
                                    {strings['content_detail.seasons_and_episode']}
                                </Text>
                            </View>
                        )}
                        {!Platform.isTV && (
                            <DropDownMenuView
                                tintColor={appColors.secondary}
                                activeTintColor={appColors.brandTint}
                                selectionColor={appColors.brandTint}
                                selectIndex={activeSeasonIndex}
                                dropDownMenuStyle={dropDownStyles}
                                onMenuItemPress={index => {
                                    setSeason(seasons[index]);
                                }}
                                data={[data]}
                            />
                        )}

                        {seasons.length > 0 && renderSeasonsPage(seasons, episodeNumber)}
                    </View>
                </View>
            )}
        </>
    );
};

export default SeasonsView;

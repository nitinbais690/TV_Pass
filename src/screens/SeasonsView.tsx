import React, { useState } from 'react';
import { View } from 'react-native';
import { ResourceCardViewBaseProps, ResourceVm, useFetchTVSeriesQuery } from 'qp-discovery-ui';
import { defaultEpisodesCardStyle } from 'styles/ContentDetails.style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import EpisodesListView from './EpisodesListView';
import SkeletonVList from 'screens/components/loading/SkeletonVList';
import InlineDropDown from 'core/presentation/components/atoms/InlineDropDown';

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
}

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
    const [season, setSeason] = useState<ResourceVm | undefined>(undefined);
    const styles = defaultEpisodesCardStyle({ appColors });

    const routes = seasons.map(season => {
        const seasonNumber = season.seasonNumber;
        return {
            key: seasonNumber,
            title: 'Season ' + seasonNumber,
            testID: seasonNumber,
            accessibilityLabel: 'Season ' + seasonNumber,
        };
    });

    const renderSeasonsPage = (seasons: ResourceVm[], episodeNumber: number) => {
        if (seasons && season === undefined) {
            if (seasonNumber) {
                setSeason(seasons.find(s => s.seasonNumber === seasonNumber));
            } else if (seasons.length > 0) {
                setSeason(seasons[0]);
            }
        }

        return (
            <View>
                {season && resourceId && (
                    <EpisodesListView
                        seriesId={resourceId}
                        seasonId={season.id}
                        episodeNumber={episodeNumber}
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

            {!loading && !error && seasons.length > 0 && (
                <View style={[styles.containerStyle]}>
                    <View>
                        <InlineDropDown
                            data={routes}
                            keyName={'key'}
                            onMenuClicked={(index: number) => {
                                setSeason(seasons[index]);
                            }}
                        />

                        {renderSeasonsPage(seasons, episodeNumber)}
                    </View>
                </View>
            )}
        </>
    );
};

export default SeasonsView;

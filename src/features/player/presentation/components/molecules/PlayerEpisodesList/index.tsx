import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { EpisodesListViewProps } from 'screens/EpisodesListView';
import { useFetchTVEpisodesQuery } from 'qp-discovery-ui/src/api';
import { EpisodesResourceListView } from '../EpisodesResourceListView';
import { playerEpisodesListStyle } from './style';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import CloseIcon from 'assets/images/close_icon.svg';
import { appIconStyles } from 'core/styles/AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';

export const PlayerEpisodesList = (props: PlayerEpisodesListProps): JSX.Element => {
    const appColors = useAppColors();
    const { strings } = useLocalization();
    const styles = playerEpisodesListStyle(appColors);
    const { cardProps, seriesId, seasonId, screenName, episodeNumber } = props;
    const { episodes, loading, error } = useFetchTVEpisodesQuery(seriesId, seasonId, screenName, 1, 25);

    return (
        <>
            {!loading && !error && episodes.length > 0 && (
                <>
                    {props.seasonNumber && episodes && (
                        <View style={styles.episodesListHeader}>
                            <Text style={styles.episodesListHeaderText}>
                                {strings['player.season']} {props.seasonNumber}, {strings['player.episodes']}{' '}
                                {episodes.length}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    props.onCloseIconPress();
                                }}
                                style={styles.closeIcon}>
                                <CloseIcon height={appIconStyles.height} width={appIconStyles.width} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <EpisodesResourceListView
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

export interface PlayerEpisodesListProps extends EpisodesListViewProps {
    seasonNumber: number;
    onCloseIconPress: () => void;
}

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ResourceCardViewBaseProps, ResourceVm } from 'qp-discovery-ui';
import { useFetchTVSeriesQuery } from 'qp-discovery-ui/src/api';
import { PlayerEpisodesList } from '../../molecules/PlayerEpisodesList';
import { PlayerProps } from 'features/player/presentation/hooks/usePlayerConfig';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useBookmarkOffset } from 'screens/hooks/useBookmarkOffset';
import { useTVODEntitlement } from 'screens/hooks/useTVODEntitlement';

export const RenderEpisodesList = (props: RenderEpisodesListProps): JSX.Element => {
    const navigation = useNavigation();
    const [season, setSeason] = useState<ResourceVm | undefined>(undefined);
    const bookmarkOffset = useBookmarkOffset(props.episodeResource.id);
    const { tvodToken } = useTVODEntitlement(props.episodeResource.id);

    const { seasons, loading } = useFetchTVSeriesQuery(props.seriesId, 'seasons', props.episodeResource.origin, 25, 1);
    useEffect(() => {
        if (seasons && season === undefined && !loading) {
            if (props.episodeResource.seasonNumber) {
                setSeason(seasons.find(s => s.seasonNumber === props.episodeResource.seasonNumber));
            } else if (seasons.length > 0) {
                setSeason(seasons[0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seasons]);

    const episodeCardProps: ResourceCardViewBaseProps<ResourceVm> = {
        onResourcePress: (currentResource: ResourceVm) => {
            playContent(currentResource, 'resume', currentResource);
        },
    };

    const playContent = (res: ResourceVm, playType: string, resource: ResourceVm) => {
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
        navigation.dispatch(StackActions.replace('Player', playerProps));
    };

    return (
        <View>
            {season && props.episodeResource.id && (
                <PlayerEpisodesList
                    seriesId={props.seriesId}
                    seasonId={season.id}
                    seasonNumber={season.seasonNumber as number}
                    episodeNumber={props.episodeResource.episodeNumber}
                    cardProps={episodeCardProps}
                    onCloseIconPress={() => {
                        props.onCloseIconPress();
                    }}
                />
            )}
        </View>
    );
};

export interface RenderEpisodesListProps {
    episodeResource: ResourceVm;
    seriesId: string;
    onCloseIconPress: () => void;
}

import { ResizableImage, ResourceVm } from 'qp-discovery-ui';
import React from 'react';
import { View } from 'react-native';
import { VideoActionsProp } from '../../atoms/VideoActions';
import { VideoDetailsProps } from '../../atoms/VideoDetails';
import VideoContent, { VideoContentProps } from '../../molecules/VideoContent';
import { WatchListCardStyle } from './style';
import { AspectRatio, ImageType } from 'qp-common-ui';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useLocalization } from 'contexts/LocalizationContext';
import { useBookmarkOffset } from 'screens/hooks/useBookmarkOffset';
import { useTVODEntitlement } from 'screens/hooks/useTVODEntitlement';
import { useNavigation } from '@react-navigation/native';
import { PlayerProps } from 'features/player/presentation/hooks/usePlayerConfig';

export default function WatchListCard(props: WatchListCardProps) {
    const appColors = useAppColors();
    const style = WatchListCardStyle(appColors);
    const { appLanguage } = useLocalization();
    const videoContent: VideoContentProps = getVideoContentData(props.item);
    const bookmarkOffset = useBookmarkOffset(props.item.id);
    const { tvodToken } = useTVODEntitlement(props.item.id);
    const navigation = useNavigation();

    function getVideoContentData(item: ResourceVm): VideoContentProps {
        return {
            title: item.title ? item.title : '',
            details: getVideoDetails(getGenerText(item, appLanguage), item.formattedRunningTime, getRatingText(item)),
            actions: videoActions,
            styles: {},
        };
    }

    const videoActions: VideoActionsProp = {
        onPressPlay: () => playContent(props.item),
        onPressDownload: () => console.log('DownLoad Button Clicked'),
        onPressDelete: () => props.removeSingleResource(props.item.id),
    };
    const playContent = (res: ResourceVm) => {
        const playbackId: string = res.id;
        if (playbackId.length === 0) {
            console.error('Invalid contentId');
            return;
        }
        // add reporting params

        let playerProps: PlayerProps = {
            resource: { ...res, watchedOffset: bookmarkOffset },
            tvodToken: tvodToken || '',
        };
        navigation.navigate('Player', playerProps);
    };

    return (
        <View style={style.container}>
            <View style={style.imageContainer}>
                <ResizableImage
                    keyId={props.item.id}
                    aspectRatioKey={AspectRatio._16by9}
                    imageType={ImageType.Poster}
                    style={style.image}
                />
            </View>

            <VideoContent
                title={videoContent.title}
                details={videoContent.details}
                actions={videoActions}
                styles={style.videoContainer}
            />
        </View>
    );
}

function getVideoDetails(genre: string, time: string | undefined, rating: string): VideoDetailsProps {
    return {
        type: genre,
        duration: time as string,
        rating: rating,
    };
}

function getGenerText(resource: ResourceVm, appLanguage: string) {
    if (resource.contentGenre && resource.contentGenre[appLanguage]) {
        return resource.contentGenre[appLanguage].join(', ');
    }
    return '';
}

function getRatingText(resource: ResourceVm): string {
    if (resource.allRatings && resource.allRatings.Default) {
        return resource.allRatings.Default;
    }
    return '';
}
export interface WatchListCardProps {
    item: ResourceVm;
    index: number;
    removeSingleResource: (id: string) => void;
}

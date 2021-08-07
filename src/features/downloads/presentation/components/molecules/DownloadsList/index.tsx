import React, { useState, useEffect } from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import RoundIconButton from 'core/presentation/components/atoms/RoundIconButton';
import OfflineDownloadButton from '../../atoms/OfflineDownloadButton';
import { OfflineImage } from 'screens/components/OfflineImage';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { Category, ResourceVm, useConfig } from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { PlayerProps } from 'features/player/presentation/hooks/usePlayerConfig';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from 'contexts/AlertContext';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useDimensions } from '@react-native-community/hooks';
import { useDownloads } from 'platform/hooks/useDownloads';
import { useLocalization } from 'contexts/LocalizationContext';
import { downloadListStyles } from './styles';
import Delete from 'assets/images/delete_outline_gray_sm.svg';

export type DownloadWithMetadata = ResourceVm & Download;

interface DownloadListProps {
    downloads: DownloadWithMetadata[];
}

const DownloadList = ({ downloads }: DownloadListProps): JSX.Element => {
    const { downloads: originalDownloads } = useDownloads(downloadManager);
    const navigation = useNavigation();
    const { strings, appLanguage } = useLocalization();
    const { width } = useDimensions().window;
    const appColors = useAppColors();
    const { Alert } = useAlert();
    const imageWidth = (width * 40) / 100; // 40% width of the screen

    const styles = downloadListStyles(appColors);

    const [listData, setListData] = useState(downloads || []);

    useEffect(() => {
        setListData(downloads || []);
    }, [downloads]);

    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = /*(config && config.imageResizerPath)*/ 'image' || undefined;

    const deleteItem = async (downloadItem: DownloadWithMetadata) => {
        const newData = [...listData];
        const prevIndex = listData.findIndex(d => d.id === downloadItem.id);
        newData.splice(prevIndex, 1);
        setListData(newData);
        await downloadManager.purgeDownload(downloadItem.id);
    };

    const showDownloadError = () => {
        Alert.alert(
            strings['download.error.general_error_msg'],
            undefined,
            [
                {
                    text: strings['global.okay'],
                },
            ],
            {
                cancelable: false,
            },
        );
    };

    const _onPress = (item: DownloadWithMetadata, index: number) => {
        if (!item) {
            return;
        }

        const originalItem = originalDownloads.find(d => d.id === item.id);
        if (!originalItem) {
            return;
        }

        switch (originalItem.state) {
            case 'DOWNLOADING':
                downloadManager.pauseDownload(item.id);
                break;
            case 'FAILED':
                showDownloadError();
                break;
            case 'PAUSED':
                downloadManager.resumeDownload(item.id);
                break;
            case 'REMOVING':
            case 'STALE':
                deleteItem(item);
                break;
            case 'COMPLETED':
                console.log(`gonna launch player for ${item.id} at index ${index}`);
                let playerProps: PlayerProps = {
                    tvodToken: '',
                    resource: item,
                    platformDownload: originalItem,
                };
                navigation.navigate('Player', playerProps);
                break;
        }
    };

    const renderItem = (data: ListRenderItemInfo<DownloadWithMetadata>) => {
        const { item, index } = data;
        const originalItem = originalDownloads.find(d => d.id === item.id);
        const isTVEpisode = item.type === Category.TVEpisode && item.seriesId !== undefined;

        const genres = (item.contentGenre && item.contentGenre[appLanguage]) || [];
        const genreString = genres.join(', ');
        const metaInfo = [];
        if (genreString) {
            metaInfo.push(genreString);
        }
        if (isTVEpisode) {
            metaInfo.push(`S${item.seasonNumber} E${item.episodeNumber}`);
        }
        if (!isTVEpisode && item.formattedRunningTime) {
            metaInfo.push(item.formattedRunningTime);
        }

        const metaInfoString = metaInfo.join(' | ');
        const default_thumbnail = require('assets/images/default_thumbnail.png');
        const posterImageURI = imageResizerUri(
            resizerEndpoint || '',
            resizerPath,
            item.id,
            AspectRatio._16by9,
            ImageType.Poster,
            imageWidth,
        );
        const title = isTVEpisode ? item.seriesTitle : item.name;

        return (
            <View style={styles.container}>
                <View style={styles.imageWrapper}>
                    <OfflineImage
                        style={styles.image}
                        resizeMode="contain"
                        imageURI={posterImageURI}
                        offlineID={item.id}
                        fallbackSource={default_thumbnail}
                    />
                </View>
                <View style={styles.textContainer}>
                    <View>
                        <Text style={[styles.titleTypography, styles.title]}>{title}</Text>
                        <Text style={[styles.captionTypography]}>{metaInfoString}</Text>
                    </View>
                    <View style={styles.buttonsWrapper}>
                        <OfflineDownloadButton
                            width={styles.button.width}
                            height={styles.button.height}
                            iconSize={styles.buttonIcon.width}
                            download={originalItem}
                            onPress={() => _onPress(item, index)}
                        />
                        <RoundIconButton
                            style={styles.deleteButton}
                            width={styles.button.width}
                            height={styles.button.height}
                            svgIcon={<Delete width={styles.buttonIcon.width} height={styles.buttonIcon.height} />}
                            onPress={() => deleteItem(item)}
                        />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            {listData.length > 0 && (
                <FlatList
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </>
    );
};

const propsAreEqual = (prevProps: DownloadListProps, nextProps: DownloadListProps): boolean => {
    return prevProps.downloads.map(r => r.id).join(',') === nextProps.downloads.map(r => r.id).join(',');
};

export default React.memo(DownloadList, propsAreEqual);

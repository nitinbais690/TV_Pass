import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from 'contexts/LocalizationContext';
import { DiskStorage } from 'screens/components/DiskStorage';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { Category, ResourceVm } from 'qp-discovery-ui';
import { useDownloads } from 'platform/hooks/useDownloads';
import { AssetMetadata } from 'utils/AssetConversionUtils';
import EmptyStateView from './EmptyStateView';
import DownloadList from './DownloadList';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { useAuth } from 'contexts/AuthContextProvider';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';

type DownloadWithMetadata = ResourceVm & Download;

const DownloadsScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const userState = useAuth();
    const { userType } = userState;
    const { isInternetReachable } = useNetworkStatus();

    const createSeriesMetadata = (episode: DownloadWithMetadata): DownloadWithMetadata => {
        const subtitleForResource = (item: DownloadWithMetadata): string | undefined => {
            if (!item.episodes) {
                return undefined;
            }

            if (item.episodes.length > 1) {
                return strings.formatString(
                    strings['my_content.download.episode_many'],
                    item.episodes.length,
                ) as string;
            }

            return strings.formatString(strings['my_content.download.episode_single'], item.episodes.length) as string;
        };

        return {
            name: episode.seriesTitle || '',
            type: Category.TVSeries,
            contentGenre: episode.contentGenre,
            mediaURL: '',
            id: episode.seriesId || '',
            key: episode.seriesId || '',
            state: 'COMPLETED',
            metadata: '',
            episodes: [episode],
            get subtitle() {
                return subtitleForResource(this);
            },
            progressPercent: 0,
        };
    };

    const { loading, downloads } = useDownloads(downloadManager);
    const downloadsRef = useRef<Download[]>(downloads);
    const [listData, setListData] = useState<DownloadWithMetadata[]>([]);

    useEffect(() => {
        downloadsRef.current = downloads;
    }, [downloads]);

    useEffect(() => {
        const downloadMetadata: Array<DownloadWithMetadata> = downloadsRef.current.map(
            (download: Download): DownloadWithMetadata => {
                return { ...metadataFromDownload(download), ...download };
            },
        );

        let mainList: DownloadWithMetadata[] = [];
        let seriesMap: { [key: string]: DownloadWithMetadata } = {};

        downloadMetadata.forEach(meta => {
            if (meta.type === Category.TVEpisode && meta.seriesId !== undefined) {
                const series = seriesMap[meta.seriesId];
                if (series && series.episodes) {
                    series.episodes = [...series.episodes, meta];
                    seriesMap[meta.seriesId] = series;
                } else {
                    const _series = createSeriesMetadata(meta);
                    mainList.push(_series);
                    seriesMap[meta.seriesId] = _series;
                }
            } else {
                mainList.push(meta);
            }
        });
        setListData(mainList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads.length]);

    return (
        <BackgroundGradient insetHeader={true} headerType={'HeaderTab'} insetTabBar={true}>
            {!loading && listData.length === 0 && (
                <EmptyStateView
                    message={strings['my_content.downloads.empty']}
                    secondaryMessage={strings['my_content.browse_empty_download']}
                />
            )}
            {!loading && listData.length > 0 && userType === 'NOT_LOGGED_IN' && (
                <EmptyStateView
                    message={strings['my_content.downloads.empty']}
                    secondaryMessage={strings['my_content.browse_cta']}
                />
            )}
            {!loading &&
                listData.length > 0 &&
                (userType === 'LOGGED_IN' || userType === 'SUBSCRIBED' || !isInternetReachable) && (
                    <>
                        <DiskStorage />
                        <DownloadList downloads={listData} />
                    </>
                )}
        </BackgroundGradient>
    );
};

function metadataFromDownload(download: Download): AssetMetadata {
    const stringifiedMetadata = download.metadata;
    return JSON.parse(stringifiedMetadata) as AssetMetadata;
}

export default DownloadsScreen;

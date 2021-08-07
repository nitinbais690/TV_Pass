import { View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';
import ProfileRow from '../../atoms/ProfileRow';
import { StorageUsage } from '../../atoms/StorageUsage';
import DownloadsList from '../../molecules/DownloadsList';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { ResourceVm } from 'qp-discovery-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { useDownloads } from 'platform/hooks/useDownloads';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { downloadsTemplateStyle } from './style';
import { metadataFromDownload } from 'features/downloads/utils';
import { FooterActionProps, FooterButtonProps } from 'core/presentation/components/molecules/FooterAction';
import { MessageViewProps } from 'core/presentation/components/organisms/MessageView';
import { MessageStyle } from 'core/presentation/components/atoms/ImageAndTextContainer';
import MessageViewTemplate from 'core/presentation/components/templates/MessageViewTemplate';
import { scale } from 'qp-common-ui';

type DownloadWithMetadata = ResourceVm & Download;

const DownloadsTemplate = (props: DownloadsTemplateProps) => {
    const { strings } = useLocalization();
    const { isInternetReachable } = useNetworkStatus();
    const style = downloadsTemplateStyle();

    const { loading, downloads } = useDownloads(downloadManager);
    const downloadsRef = useRef<Download[]>(downloads);
    const [listData, setListData] = useState<DownloadWithMetadata[]>([]);

    useEffect(() => {
        downloadsRef.current = downloads;
    }, [downloads]);

    useEffect(() => {
        if (!downloads) {
            return;
        }

        const downloadMetadata: Array<DownloadWithMetadata> = downloadsRef.current.map(
            (download: Download): DownloadWithMetadata => {
                return { ...metadataFromDownload(download), ...download };
            },
        );

        let mainList: DownloadWithMetadata[] = [];

        downloadMetadata.forEach(meta => {
            if (!isInternetReachable && meta.state !== 'COMPLETED') {
                return;
            }
            mainList.push(meta);
        });

        setListData(mainList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads.length, isInternetReachable]);

    const deleteDownloads = async () => {
        for (const item of listData) {
            await downloadManager.purgeDownload(item.id);
        }
    };

    const primaryButton: FooterButtonProps = {
        label: strings['download.go_to_home'],
        testId: 'homeButton',
        accessibilityLabel: strings['tabs.home'],
        onPress: () => {
            props.navigation.goBack();
        },
    };

    const footerAction: FooterActionProps = {
        primartButton: primaryButton,
    };

    const messageStyle: MessageStyle = {
        paddingLeft: scale(56),
        paddingRight: scale(26),
    };

    const messageView: MessageViewProps = {
        imagePath: 'assets/images/empty_state_image.png',
        infoText: strings['download.empty_msg'],
        messageStyle: messageStyle,
        footer: footerAction,
    };

    return (
        <>
            {loading && <AppLoadingIndicator style={style.loaderStyle} />}
            {!loading && listData.length === 0 && <MessageViewTemplate {...messageView} />}
            {!loading && listData.length > 0 && (
                <BackgroundGradient insetTabBar={false}>
                    <BackNavigation
                        isFullScreen={true}
                        navigationTitle={strings['tabs.downloads']}
                        onPress={() => {
                            props.navigation.goBack();
                        }}
                    />
                    <View style={style.mainContainer}>
                        <ProfileRow onDelete={deleteDownloads} />
                        <StorageUsage style={style.storageWrapper} />
                        <View style={style.listWrapper}>
                            <DownloadsList downloads={listData} />
                        </View>
                    </View>
                </BackgroundGradient>
            )}
        </>
    );
};

interface DownloadsTemplateProps {
    navigation: any;
}

export default DownloadsTemplate;

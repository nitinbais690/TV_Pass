import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { downloadManager } from 'rn-qp-nxg-player';
import { formatSizeBytes } from 'utils/DownloadUtils';
import { useLocalization } from 'contexts/LocalizationContext';
import { useDownloads } from 'platform/hooks/useDownloads';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { storageUsageStyles } from './styles';

export const StorageUsage = (props: DiskStorageProps) => {
    const { strings } = useLocalization();
    const appColors = useAppColors();
    const style = storageUsageStyles(appColors);

    const [total] = useState(DeviceInfo.getTotalDiskCapacitySync());
    const free = DeviceInfo.getFreeDiskStorageSync();
    const [appUsed, setAppUsed] = useState(0);

    const percent = (value: number) => (value / total) * 100;
    const [appPercent, setAppPercent] = useState(0);

    const { downloads } = useDownloads(downloadManager);

    useEffect(() => {
        var downloadItemsSize = 0;
        downloads.forEach(downloadItem => {
            const size: number = downloadItem.sizeOnDisk ? downloadItem.sizeOnDisk : 0;
            downloadItemsSize = downloadItemsSize + size;
        });
        const appUsedStorage = downloadItemsSize;
        setAppUsed(appUsedStorage);
        setAppPercent(percent(appUsedStorage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads]);

    function getUsedStorageText() {
        const label = [];
        label.push(strings['download.storage']);
        if (appUsed > 0) {
            label.push(strings.formatString(strings['download.storage_used'], formatSizeBytes(appUsed)));
        }
        return label.join(' | ');
    }

    return (
        <View style={[style.container, props.style]}>
            <View style={style.labelContainer}>
                <Text style={style.label}>{getUsedStorageText()}</Text>
                <Text style={style.label}>
                    {strings.formatString(strings['download.storage_available'], formatSizeBytes(free))}
                </Text>
            </View>
            <View style={style.barWrapper}>
                {appPercent > 0 && <View style={[style.barUsed, { width: `${appPercent}%` }]} />}
                <View style={[style.bar]} />
            </View>
        </View>
    );
};

interface DiskStorageProps {
    style?: {};
}

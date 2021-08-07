import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../AppStyles';
import { useDownloads } from 'platform/hooks/useDownloads';
import { downloadManager } from 'rn-qp-nxg-player';

type StorageType = 'Used' | 'Free' | 'App';

const labelForType = (_type: StorageType, strings: any) => {
    switch (_type) {
        case 'Used':
            return strings['my_content.downloads_used'];
        case 'Free':
            return strings['my_content.downloads_free'];
        case 'App':
            return strings['my_content.downloads_app'];
    }
};

const colorForType = (_type: StorageType, appColors: any) => {
    switch (_type) {
        case 'Used':
            return appColors.tertiary;
        case 'Free':
            return appColors.caption;
        case 'App':
            return appColors.brandTint;
    }
};

const AnnotationBar = () => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const style = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 8,
        },
        label: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        bar: {
            height: 10,
            width: '100%',
            marginBottom: 8,
            borderRightWidth: 2,
            borderColor: appColors.primaryVariant2,
        },
        annotationWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        annotation: { height: 10, aspectRatio: 1, marginRight: 5 },
    });

    const types: StorageType[] = ['App', 'Used', 'Free'];

    return (
        <View style={style.container}>
            {types.map((type, i) => (
                <View style={style.annotationWrapper} key={i}>
                    <View style={[style.annotation, { backgroundColor: colorForType(type, appColors) }]} />
                    <Text style={style.label}>{labelForType(type, strings)}</Text>
                </View>
            ))}
        </View>
    );
};

export const DiskStorage = () => {
    const percent = (value: number) => (value / total) * 100;
    const prefs = useAppPreferencesState();
    const { strings } = useLocalization();
    let { appColors } = prefs.appTheme!(prefs);

    const total = DeviceInfo.getTotalDiskCapacitySync();
    const free = DeviceInfo.getFreeDiskStorageSync();
    const used = total - free;
    const [freePercent] = useState(percent(free));
    const [usedPercent, setUsedPercent] = useState(percent(used));
    const [appPercent, setAppPercent] = useState(0);
    const style = StyleSheet.create({
        container: {
            padding: 20,
            backgroundColor: appColors.primaryVariant2,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: appColors.primaryVariant1,
        },
        label: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        bar: { height: 10, marginBottom: 8, borderRightWidth: 2, borderColor: appColors.primaryVariant1 },
        caption: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        barWrapper: {
            flexDirection: 'row',
            paddingTop: 8,
        },
    });

    const { downloads } = useDownloads(downloadManager);

    useEffect(() => {
        var downloadItemsSize = 0;
        downloads.forEach(downloadItem => {
            const size: number = downloadItem.sizeOnDisk ? downloadItem.sizeOnDisk : 0;
            downloadItemsSize = downloadItemsSize + size;
        });
        const appUsedStorage = downloadItemsSize;
        setAppPercent(percent(appUsedStorage));
        setUsedPercent(percent(used - appUsedStorage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloads]);

    return (
        <View style={style.container}>
            <Text style={style.label}>{strings['my_content.downloads_device_storage']}</Text>
            <View style={style.barWrapper}>
                {appPercent > 0 && (
                    <View
                        style={[
                            style.bar,
                            { width: `${appPercent}%`, backgroundColor: colorForType('App', appColors) },
                        ]}
                    />
                )}
                <View
                    style={[style.bar, { width: `${usedPercent}%`, backgroundColor: colorForType('Used', appColors) }]}
                />
                <View
                    style={[style.bar, { width: `${freePercent}%`, backgroundColor: colorForType('Free', appColors) }]}
                />
            </View>
            <AnnotationBar />
            <Text style={style.caption}>{strings['my_content.downloads_note']}</Text>
        </View>
    );
};

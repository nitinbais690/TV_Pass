import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import ActionSheet from 'react-native-actionsheet';
import { downloadManager } from 'rn-qp-nxg-player';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { settingStyle } from '../../styles/Settings.Style';
import RightArrow from '../../../assets/images/RightArrow.svg';
import {
    StreamQuality,
    DownloadQuality,
    getStreamQuality,
    setStreamQuality,
    getDownloadQuality,
    setDownloadQuality,
    setStreamOverCellular,
    setDownloadOverCellular,
    canSendPushNotifications,
    setSendPushNotifications,
    DEFAULT_STREAM_QUALITY,
    DEFAULT_DOWNLOAD_QUALITY,
    setItem,
} from 'utils/UserPreferenceUtils';
import { AppEvents, condensePreferanceData } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useSwrve, SWRVE_KEY } from 'contexts/SwrveContextProvider';
import { useDownloads } from 'platform/hooks/useDownloads';
import Button from 'screens/components/Button';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useDownloadsContext, PreferenceUpdates } from 'utils/DownloadsContextProvider';
import { useAlert } from 'contexts/AlertContext';
import { DOWNLOAD_COMPLETE_LIST } from 'utils/DownloadBookmarkUtils';

export const PreferencesScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const actionSheetRef = useRef<ActionSheet>(null);
    const downloadQualityActionSheetRef = useRef<ActionSheet>(null);
    const clearDownloadsActionSheetRef = useRef<ActionSheet>(null);
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings } = useLocalization();
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const [purging, setPurging] = useState<boolean>(false);
    const [downloadOverCellular, setDownloadCellularLocal] = useState<boolean | undefined>(undefined);
    const [sendPushNotification, setSendPushNotificationLocal] = useState<boolean | undefined>(undefined);
    const [qp, setQp] = useState(DEFAULT_STREAM_QUALITY);
    const [dwQuality, setDwQuality] = useState(DEFAULT_DOWNLOAD_QUALITY);
    const { swrveUserUpdate } = useSwrve();
    const { downloads } = useDownloads(downloadManager);
    const { downloadOverWifiOnly, streamOverCellular: streamOverCellular, updatePreference } = useDownloadsContext();
    const { Alert } = useAlert();

    const qualityPlaybackValues = [
        {
            key: 0,
            label: strings['global.cancel'],
            value: '',
        },
        {
            key: 1,
            label: strings['preference.stream_quality.high'],
            value: 'High',
        },
        {
            key: 2,
            label: strings['preference.stream_quality.medium'],
            value: 'Medium',
        },
        {
            key: 3,
            label: strings['preference.stream_quality.low'],
            value: 'Low',
        },
        {
            key: 4,
            label: strings['preference.stream_quality.auto'],
            value: DEFAULT_STREAM_QUALITY,
        },
    ];

    const downloadQualityValues = [
        {
            key: 0,
            label: strings['global.cancel'],
            value: '',
        },
        {
            key: 1,
            label: strings['preference.download_quality.hd'],
            value: 'HD',
        },
        {
            key: 2,
            label: strings['preference.download_quality.sd'],
            value: 'SD',
        },
    ];

    const clearDownloadsValues = [
        {
            key: 0,
            label: strings['global.cancel'],
            value: '',
        },
        {
            key: 1,
            label: strings['preference.clear'],
            value: '',
        },
    ];

    const analytics = useAnalytics();
    const { recordEvent } = analytics;

    useEffect(() => {
        const setup = async () => {
            setQp(await getStreamQuality());
            setDwQuality(await getDownloadQuality());
            setDownloadCellularLocal(downloadOverWifiOnly);
            setSendPushNotificationLocal(await canSendPushNotifications());
        };

        setup();
    }, [downloadOverWifiOnly]);

    const showActionSheet = () => {
        if (actionSheetRef.current) {
            actionSheetRef.current.show();
        }
    };

    const showDownloadQualityActionSheet = () => {
        if (downloadQualityActionSheetRef.current) {
            downloadQualityActionSheetRef.current.show();
        }
    };

    const showClearDownloadsActionSheet = () => {
        if (clearDownloadsActionSheetRef.current) {
            clearDownloadsActionSheetRef.current.show();
        }
    };

    const clearAllDownloads = async () => {
        if (downloadManager) {
            setPurging(true);
            try {
                const downloads = await downloadManager.getAllDownloads();
                const purgePromises = downloads.map(download => downloadManager.purgeDownload(download.id));
                await Promise.all(purgePromises);
                await clearDownloadsFromAStorage();
            } catch (e) {
                console.debug('[clearAllDownloads] Error purging downloads', e);
            }
            setPurging(false);
        }
    };

    const clearDownloadsFromAStorage = async () => {
        await setItem(DOWNLOAD_COMPLETE_LIST, '');
    };

    const clearAllDownloadsConfirmation = () => {
        Alert.alert(strings['preference.alert_title'], strings['preference.alert_message'], [
            {
                text: strings['preference.alert_confirm'],
                onPress: () => clearAllDownloads(),
            },
            {
                text: strings['preference.alert_cancel'],
                onPress: () => {},
                style: 'cancel',
            },
        ]);
    };

    return (
        <BackgroundGradient insetTabBar={true}>
            <ScrollView style={settStyle.mainContainer_mh} showsVerticalScrollIndicator={false}>
                <Text style={[settStyle.text_md_lg, settStyle.container, settStyle.marginTop, settStyle.pageMarginTop]}>
                    {strings['preference.videoPlaback']}
                </Text>
                <ActionSheet
                    ref={actionSheetRef}
                    title={strings['preference.playback_quality.title']}
                    options={qualityPlaybackValues.map(q => q.label)}
                    cancelButtonIndex={0}
                    onPress={index => {
                        if (index > 0) {
                            const value = qualityPlaybackValues[index].value;
                            setStreamQuality(value as StreamQuality);
                            setQp(value);
                            recordEvent(
                                AppEvents.UPDATE_USER_PREFRENCES,
                                condensePreferanceData({
                                    qp,
                                    streamOverCellular,
                                    sendPushNotification,
                                    prefDownloadOnWifiOnly: !downloadOverCellular,
                                }),
                            );
                        }
                    }}
                />
                <TouchableOpacity onPress={() => showActionSheet()}>
                    <View style={[settStyle.row_between, settStyle.borderBottom, settStyle.borderTop]}>
                        <View style={[settStyle.row_between_container]}>
                            <Text style={[settStyle.text_md_sm, settStyle.container]}>
                                {strings['preference.quality']}
                            </Text>
                            <Text style={[settStyle.text_md_xxs, settStyle.container, settStyle.paddingTop]}>
                                {strings['preference.quality_sub.text']}
                            </Text>
                        </View>
                        <View style={settStyle.toggle}>
                            <Text style={settStyle.qpText}>{qp}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={[settStyle.row_between, settStyle.borderBottom]}>
                    <Text style={[settStyle.text_md_sm, settStyle.container]}>{strings['preference.mobileData']}</Text>
                    <View style={settStyle.toggle}>
                        <Switch
                            ios_backgroundColor={appColors.primary}
                            style={[settStyle.margin_toggle, { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }]}
                            thumbColor={streamOverCellular ? appColors.secondary : appColors.captionLight}
                            trackColor={{ true: appColors.brandTint, false: appColors.primary }}
                            onValueChange={value => {
                                setStreamOverCellular(value);
                                updatePreference(PreferenceUpdates.streamOverCellular, value);
                                recordEvent(
                                    AppEvents.UPDATE_USER_PREFRENCES,
                                    condensePreferanceData({
                                        qp,
                                        streamOverCellular,
                                        sendPushNotification,
                                        prefDownloadOnWifiOnly: !downloadOverCellular,
                                    }),
                                );
                            }}
                            value={streamOverCellular}
                        />
                    </View>
                </View>
                <Text style={[settStyle.text_md_lg, settStyle.container, settStyle.marginTop]}>
                    {strings['preference.downloads']}
                </Text>
                <ActionSheet
                    ref={downloadQualityActionSheetRef}
                    title={strings['preference.download_quality.title']}
                    options={downloadQualityValues.map(q => q.label)}
                    cancelButtonIndex={0}
                    onPress={index => {
                        if (index > 0) {
                            const value = downloadQualityValues[index].value;
                            setDownloadQuality(value as DownloadQuality);
                            setDwQuality(value);
                        }
                    }}
                />
                <TouchableOpacity onPress={() => showDownloadQualityActionSheet()}>
                    <View style={[settStyle.row_between, settStyle.borderBottom, settStyle.borderTop]}>
                        <Text style={[settStyle.text_md_sm, settStyle.container]}>
                            {strings['preference.download.quality']}
                        </Text>
                        <View style={settStyle.toggle}>
                            <Text style={settStyle.qpText}>{dwQuality}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={[settStyle.row_between, settStyle.borderBottom, settStyle.borderTop]}>
                    <View style={[settStyle.row_between_container]}>
                        <Text style={[settStyle.text_md_sm, settStyle.container]}>{strings['preference.wifi']}</Text>
                        <Text style={[settStyle.text_md_xxs, settStyle.container, settStyle.paddingTop]}>
                            {strings['preference.wifi_sub.text_1']}
                        </Text>
                    </View>
                    <View style={settStyle.toggle}>
                        <Switch
                            ios_backgroundColor={appColors.primary}
                            style={[settStyle.margin_toggle, { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }]}
                            thumbColor={downloadOverCellular ? appColors.secondary : appColors.captionLight}
                            trackColor={{ true: appColors.brandTint, false: appColors.primaryVariant4 }}
                            onValueChange={value => {
                                setDownloadOverCellular(value);
                                setDownloadCellularLocal(value);
                                updatePreference(PreferenceUpdates.downloadOverWifiOnly, value);
                                recordEvent(
                                    AppEvents.UPDATE_USER_PREFRENCES,
                                    condensePreferanceData({
                                        qp,
                                        streamOverCellular,
                                        sendPushNotification,
                                        prefDownloadOnWifiOnly: !downloadOverCellular,
                                    }),
                                );
                            }}
                            value={downloadOverCellular}
                        />
                    </View>
                </View>
                <View style={[settStyle.row_between, settStyle.borderBottom]}>
                    <Text style={[settStyle.text_md_xs, settStyle.container]}>
                        {strings['preference.deletedownloads']}
                    </Text>
                    <View style={settStyle.removeButtonContainer}>
                        <Button
                            buttonStyle={settStyle.removeButton}
                            title={strings['preference.clear']}
                            onPress={showClearDownloadsActionSheet}
                            loading={purging}
                            disabled={downloads.length <= 0}
                        />
                    </View>
                </View>
                <ActionSheet
                    ref={clearDownloadsActionSheetRef}
                    title={strings['preference.clearDownloads.title']}
                    options={clearDownloadsValues.map(q => q.label)}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={1}
                    onPress={index => {
                        if (index > 0) {
                            clearAllDownloadsConfirmation();
                            // clearAllDownloads();
                        }
                    }}
                />
                <Text style={[settStyle.text_md_lg, settStyle.container, settStyle.marginTop]}>
                    {strings['preference.notification']}
                </Text>
                <View style={[settStyle.row_between, settStyle.borderBottom, settStyle.borderTop]}>
                    <Text style={[settStyle.text_md_sm, settStyle.container]}>
                        {strings['preference.pushNotification']}
                    </Text>
                    <View style={settStyle.toggle}>
                        <Switch
                            ios_backgroundColor={appColors.primary}
                            style={[settStyle.margin_toggle, { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }]}
                            thumbColor={sendPushNotification ? appColors.secondary : appColors.captionLight}
                            trackColor={{ true: appColors.brandTint, false: appColors.caption }}
                            onValueChange={value => {
                                setSendPushNotifications(value);
                                setSendPushNotificationLocal(value);
                                recordEvent(
                                    AppEvents.UPDATE_USER_PREFRENCES,
                                    condensePreferanceData({
                                        qp,
                                        streamOverCellular,
                                        sendPushNotification,
                                        prefDownloadOnWifiOnly: !downloadOverCellular,
                                    }),
                                );
                                swrveUserUpdate({ [SWRVE_KEY.opt_out_push]: value ? 0 : 1 });
                            }}
                            value={sendPushNotification}
                        />
                    </View>
                </View>
                <Text style={[settStyle.text_md_lg, settStyle.container, settStyle.marginTop]}>
                    {strings['preference.devices']}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.push('ManageDevices')}
                    style={[settStyle.row_between_noColor, settStyle.borderBottom, settStyle.borderTop]}>
                    <Text style={[settStyle.text_md_sm, settStyle.container]}>
                        {strings['preference.manageDevices']}
                    </Text>
                    <View style={settStyle.margin_sm}>
                        <RightArrow />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </BackgroundGradient>
    );
};

import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { appPadding, appFonts } from '../../../AppStyles';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { ListItem } from 'react-native-elements';

type ItemType = 'SWITCH' | 'ACTION_BUTTON';

interface SettingsItemProps {
    type: ItemType;
    key: string;
    [key: string]: any;
}

export const VideoQualityScreen = ({ navigation }: { navigation: any }) => {
    const prefs = useAppPreferencesState();
    const { appTheme, useWifiOnly, togglePlayerNetwork } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const defaultStyles = StyleSheet.create({
        rowWrapperStyle: {
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: appColors.primary,
            backgroundColor: appColors.backgroundInactive,
        },
        mainText: { color: appColors.secondary, fontFamily: appFonts.primary, fontSize: appFonts.sm },
        subText: { color: appColors.caption, fontFamily: appFonts.light, fontSize: appFonts.xs },
        switch: { marginRight: appPadding.xs() },
        listBottomPadding: {
            marginTop: appPadding.sm(),
            width: Platform.isTV ? '40%' : '100%',
            alignSelf: 'center',
        },
    });

    const streamingSettings: Array<SettingsItemProps> = [
        { type: 'ACTION_BUTTON', key: 'Streaming Quality', screen: 'StreamQuality' },
        { type: 'SWITCH', key: 'Stream on Wi-Fi only', value: useWifiOnly, toggle: togglePlayerNetwork },
        { type: 'SWITCH', key: 'Notify me when using mobile data' },
    ];

    const downloadSettings: Array<SettingsItemProps> = [
        { type: 'ACTION_BUTTON', key: 'Download Quality', screen: 'DownloadQuality' },
        { type: 'SWITCH', key: 'Download on Wi-Fi only' },
    ];

    const renderTable = (settings: Array<SettingsItemProps>) => (
        <>
            {settings.map((item, i) => (
                <ListItem
                    key={i}
                    containerStyle={defaultStyles.rowWrapperStyle}
                    title={item.key}
                    titleStyle={defaultStyles.mainText}
                    subtitleStyle={defaultStyles.subText}
                    subtitle={item.subText}
                    chevron={item.type !== 'SWITCH' ? { size: 24 } : undefined}
                    onPress={() => item.screen && navigation.push(item.screen)}
                    switch={
                        item.type === 'SWITCH'
                            ? {
                                  value: item.value,
                                  onValueChange: () => item.toggle && item.toggle(),
                              }
                            : undefined
                    }
                />
            ))}
        </>
    );

    return (
        <>
            <View style={defaultStyles.listBottomPadding}>{renderTable(streamingSettings)}</View>
            {!Platform.isTV && <View style={defaultStyles.listBottomPadding}>{renderTable(downloadSettings)}</View>}
        </>
    );
};

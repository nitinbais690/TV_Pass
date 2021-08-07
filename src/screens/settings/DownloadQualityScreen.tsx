import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { appPadding, appFonts } from '../../../AppStyles';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { ListItem } from 'react-native-elements';

type ItemType = 'CHECK_BUTTON';

interface SettingsItemProps {
    type: ItemType;
    key: string;
    [key: string]: any;
}

export const DownloadQualityScreen = () => {
    const [state, setState] = useState('Good');
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const defaultStyles = StyleSheet.create({
        rowWrapperStyle: {
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: appColors.primary,
            backgroundColor: appColors.backgroundInactive,
        },
        mainText: { color: appColors.secondary, fontFamily: appFonts.bold, fontSize: appFonts.sm },
        subText: { color: appColors.caption, fontFamily: appFonts.light, fontSize: appFonts.xs },
        switch: { marginRight: appPadding.xs() },
        listBottomPadding: {
            marginTop: appPadding.sm(),
            width: Platform.isTV ? '40%' : '100%',
            alignSelf: 'center',
        },
    });

    const qualitySettings: Array<SettingsItemProps> = [
        {
            type: 'CHECK_BUTTON',
            key: 'Best',
            subText: 'one hour of video uses .5 Gb of data',
            displayCheckmark: state === 'Best',
        },
        {
            type: 'CHECK_BUTTON',
            key: 'Better',
            subText: 'one hour of video uses .35 Gb of data',
            displayCheckmark: state === 'Better',
        },
        {
            type: 'CHECK_BUTTON',
            key: 'Good',
            subText: 'one hour of video uses .2 Gb of data',
            displayCheckmark: state === 'Good',
        },
    ];

    return (
        <View style={defaultStyles.listBottomPadding}>
            {qualitySettings.map((item, i) => (
                <ListItem
                    key={i}
                    containerStyle={defaultStyles.rowWrapperStyle}
                    title={item.key}
                    titleStyle={defaultStyles.mainText}
                    subtitleStyle={defaultStyles.subText}
                    subtitle={item.subText}
                    checkmark={item.displayCheckmark ? { color: appColors.brandTint } : undefined}
                    onPress={() => setState(item.key)}
                />
            ))}
        </View>
    );
};

import React from 'react';
import { View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { style } from './style';

export default function SelectedTabView() {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const textStyles = style({ appColors });

    return (
        <View>
            <Text style={textStyles.textStyle}> Tab is selected </Text>
        </View>
    );
}

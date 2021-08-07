import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const HeaderGradient = (props: ViewProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    return (
        <BlurView style={props.style}>
            <LinearGradient
                colors={[appColors.headerGradientStart, appColors.headerGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />
        </BlurView>
    );
};

export default HeaderGradient;

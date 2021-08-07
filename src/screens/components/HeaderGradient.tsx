import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import BlurComponent from './BlurComponent';

const HeaderGradient = (props: ViewProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    return (
        <BlurComponent style={props.style}>
            <LinearGradient
                colors={[appColors.headerGradientStart, appColors.headerGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />
        </BlurComponent>
    );
};

export default HeaderGradient;

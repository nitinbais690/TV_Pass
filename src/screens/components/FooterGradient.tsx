import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const FooterGradient = (props: React.PropsWithChildren<ViewProps>): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    return (
        <BlurView style={props.style}>
            <LinearGradient
                colors={[appColors.bottomNavGradientStart, appColors.bottomNavGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />
            {props.children}
        </BlurView>
    );
};

export default FooterGradient;

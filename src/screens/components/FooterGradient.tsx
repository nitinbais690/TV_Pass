import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import BlurComponent from './BlurComponent';

const FooterGradient = (props: React.PropsWithChildren<ViewProps>): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    return (
        <BlurComponent style={props.style}>
            <LinearGradient
                colors={[appColors.bottomNavGradientStart, appColors.bottomNavGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />
            {props.children}
        </BlurComponent>
    );
};

export default FooterGradient;

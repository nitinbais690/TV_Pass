import React from 'react';
import { ViewProps, StyleSheet, View, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const HeaderGradient = (props: ViewProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    if (Platform.OS === 'android') {
        return (
            <View style={props.style}>
                <LinearGradient
                    colors={['#522C1E', '#292c31', '#202325']}
                    useAngle={true}
                    angle={160}
                    locations={[0, 0.2, 0.45]}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        );
    } else {
        return (
            <BlurView style={props.style}>
                <LinearGradient
                    colors={[appColors.headerGradientStart, appColors.headerGradientEnd]}
                    style={StyleSheet.absoluteFillObject}
                />
            </BlurView>
        );
    }
};

export default HeaderGradient;

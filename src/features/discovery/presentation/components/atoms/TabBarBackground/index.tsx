import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { BottomTabBar, BottomTabBarProps, BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { tabBarBackgroundStyles } from './style';

export default function TabBarBackground(props: BottomTabBarProps<BottomTabBarOptions>) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    if (Platform.OS === 'android') {
        return (
            <View style={tabBarBackgroundStyles.positionAbsolute}>
                <LinearGradient
                    useAngle={true}
                    angle={180}
                    colors={[appColors.bottomNavGradientStart, appColors.bottomNavGradientEnd]}
                    style={StyleSheet.absoluteFillObject}
                    {...props}>
                    <BottomTabBar {...props} />
                </LinearGradient>
            </View>
        );
    } else {
        return (
            <BlurView style={tabBarBackgroundStyles.positionAbsolute}>
                <LinearGradient
                    useAngle={true}
                    angle={180}
                    colors={[appColors.bottomNavGradientStart, appColors.bottomNavGradientEnd]}
                    style={StyleSheet.absoluteFillObject}
                    {...props}>
                    <BottomTabBar {...props} />
                </LinearGradient>
            </BlurView>
        );
    }
}

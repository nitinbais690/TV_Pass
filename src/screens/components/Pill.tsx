import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

export const Pill = ({ children, borderRadius }: { children: React.PropsWithChildren<{}>; borderRadius: number }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: appColors.brandTint,
            borderRadius: borderRadius || 12,
            padding: 2,
        },
    });

    return <View style={styles.container}>{children}</View>;
};

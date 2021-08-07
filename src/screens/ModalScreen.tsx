import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppPreferencesState } from '../utils/AppPreferencesContext';

export default ({ navigation }: { navigation: any }) => {
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
        },
        logoContainer: {
            alignSelf: 'stretch',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            height: 60,
            resizeMode: 'contain',
        },
        tagline: {
            color: appColors.secondary,
            margin: appPadding.sm(),
        },
        loading: { justifyContent: 'flex-start' },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}
                onPress={() => navigation.pop()}>
                <Text>Modal me</Text>
                <ActivityIndicator color={appColors.brandTint} style={styles.loading} size="large" />
            </TouchableOpacity>
        </View>
    );
};

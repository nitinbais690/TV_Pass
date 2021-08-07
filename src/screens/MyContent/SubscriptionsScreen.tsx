import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';

const SubscriptionsScreen = (): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tagline: {
            color: appColors.secondary,
        },
    });

    return (
        <View style={style.container}>
            <Text style={style.tagline}>Subscriptions</Text>
        </View>
    );
};

export default SubscriptionsScreen;

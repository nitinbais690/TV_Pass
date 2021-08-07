import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';

const RegionLockScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        contentContainer: {
            flex: 1,
        },
        header: {
            color: appColors.secondary,
            margin: appPadding.sm(),
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.bold,
        },
        tagline: {
            color: appColors.secondary,
            margin: appPadding.sm(),
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
            marginVertical: 60,
        },
    });

    return (
        <SafeAreaView style={style.container}>
            <View style={style.contentContainer}>
                <Text style={style.header}>{strings['region_lock.title']}</Text>
                <Text style={style.tagline}>{strings['region_lock.err_msg']}</Text>
            </View>
        </SafeAreaView>
    );
};

export default RegionLockScreen;

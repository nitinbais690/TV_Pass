import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appFonts } from '../../../AppStyles';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { useLocalization } from '../../contexts/LocalizationContext';
import Button from '../components/Button';

const ForceUpdateScreen = (): JSX.Element => {
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
        buttonWrapper: {
            ...StyleSheet.absoluteFillObject,
            alignSelf: 'stretch',
            flex: 1,
            justifyContent: 'center',
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
                <Text style={style.header}>{strings['force_update.title']}</Text>
                <Text style={style.tagline}>{strings['force_update.err_msg']}</Text>

                <View style={style.buttonWrapper}>
                    <Button title={strings['force_update.update_btn_label']} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForceUpdateScreen;

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts, appPadding } from '../../../AppStyles';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

const EmptyStateView = ({ message }: { message: string }) => {
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            margin: appPadding.sm(true),
            paddingTop: 10,
        },
        tagline: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xlg,
            fontWeight: '600',
            paddingBottom: 20,
        },
        button: {
            color: appColors.brandTint,
        },
    });

    return (
        <View style={style.container}>
            <Text style={style.tagline}>{message}</Text>
            <BorderlessButton onPress={() => navigation.navigate(NAVIGATION_TYPE.BROWSE)}>
                <Text style={[style.tagline, style.button]}>{strings['my_content.browse_cta']}</Text>
            </BorderlessButton>
        </View>
    );
};

export default EmptyStateView;

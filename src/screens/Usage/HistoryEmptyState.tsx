import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import { selectDeviceType } from 'qp-common-ui';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useNavigation } from '@react-navigation/native';
import { Button as RNEButton } from 'react-native-elements';

const HiistoryEmptyState = (): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const navigation = useNavigation();

    const style = StyleSheet.create({
        rootContainer: {
            marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
        },
        container: {},
        barContainer: {
            alignItems: 'flex-start',
        },
        infoText: {
            color: appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.sm,
            paddingVertical: 15,
        },
        infoBrowseText: {
            color: appColors.brandTint,
            fontFamily: appFonts.primary,
            fontSize: appFonts.sm,
            paddingBottom: 15,
        },
        info: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    const { strings } = useLocalization();

    return (
        <>
            <View style={style.rootContainer}>
                <View style={style.container}>
                    <View style={style.barContainer}>
                        <View style={style.info}>
                            <Text style={style.infoText}>{strings['content_usage.history_empty_info']}</Text>
                        </View>
                        <View style={style.info}>
                            <RNEButton
                                title={strings['content_usage.go_to_browse']}
                                titleStyle={style.infoBrowseText}
                                buttonStyle={{ paddingLeft: 0 }}
                                type="clear"
                                onPress={() => navigation.navigate(NAVIGATION_TYPE.BROWSE)}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default HiistoryEmptyState;

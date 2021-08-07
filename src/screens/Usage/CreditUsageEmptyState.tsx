import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import { selectDeviceType } from 'qp-common-ui';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { useNavigation } from '@react-navigation/native';
import { Button as RNEButton } from 'react-native-elements';

const CreditUsageEmptyState = (props: { info: string }): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const navigation = useNavigation();

    const style = StyleSheet.create({
        rootContainer: {
            margin: selectDeviceType({ Tablet: 40 }, 20),
            borderRadius: 22,
            backgroundColor: 'rgba(39, 56, 78, 0.5)',
        },
        container: {
            paddingLeft: selectDeviceType({ Tablet: 40 }, 20),
            paddingRight: selectDeviceType({ Tablet: 40 }, 20),
        },
        tagline: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
        },
        countValueText: {
            color: appColors.brandTint,
        },
        creditsUsage: {
            alignContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            marginLeft: selectDeviceType({ Tablet: 40 }, 20),
            marginRight: selectDeviceType({ Tablet: 40 }, 20),
            margin: 20,
            justifyContent: 'space-between',
        },
        divider: {
            height: 1,
            backgroundColor: '#2E4259',
            marginTop: 0,
        },
        barContainer: {
            alignItems: 'flex-start',
        },
        infoText: {
            color: appColors.caption,
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
                <View style={style.creditsUsage}>
                    <View>
                        <Text style={style.tagline}>{strings['content_usage.credits_used']}</Text>
                    </View>
                    <Text style={[style.tagline, style.countValueText]}>{0}</Text>
                </View>
                <View style={style.container}>
                    <View style={style.divider} />
                    <View style={style.barContainer}>
                        <View style={style.info}>
                            <Text style={style.infoText}>{props.info}</Text>
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

export default CreditUsageEmptyState;

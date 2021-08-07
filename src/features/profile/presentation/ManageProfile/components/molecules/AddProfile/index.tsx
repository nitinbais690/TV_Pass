import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AddProfileStyles, ANGLE, GRADIENT_COLOR_GRAY, GRADIENT_COLOR_RED } from './style';
import PlusIcon from 'assets/images/add_profile_plus.svg';
import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';
import { appFlexStyles } from 'core/styles/FlexStyles';
import LinearGradient from 'react-native-linear-gradient';

export default function AddProfile(props: any): JSX.Element {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const style = AddProfileStyles(appColors);
    const { strings } = useLocalization();

    return (
        <View
            style={[
                style.container,
                appFlexStyles.rowHorizontalAlignSpaceBetween,
                appFlexStyles.rowVerticalAlignCenter,
            ]}>
            <View style={[appFlexStyles.flexRow, appFlexStyles.rowVerticalAlignCenter, style.content]}>
                <TouchableOpacity
                    onPress={props.onPress}
                    style={style.addContainer}
                    testID={AUTOMATION_TEST_ID.ADD_PROFILE}
                    accessibilityLabel={AUTOMATION_TEST_ID.ADD_PROFILE}>
                    <LinearGradient
                        colors={[GRADIENT_COLOR_GRAY, GRADIENT_COLOR_RED]}
                        useAngle={true}
                        angle={ANGLE}
                        style={style.gradient}>
                        <View style={style.addWrapper}>
                            <PlusIcon width={style.plusIcon.width} height={style.plusIcon.height} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={style.profileNameStyle}>{strings.addProfile}</Text>
            </View>
        </View>
    );
}

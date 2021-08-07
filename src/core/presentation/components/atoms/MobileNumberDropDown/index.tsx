import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { mobileDropDownStyle } from './style';
import { TextinputBox } from '../TextinputBox';
import { isTablet } from 'core/styles/AppStyles';
import DropDownIcon from 'assets/images/drop_down_icon.svg';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

export default function MobileNumberDropDown(props: MobileNumberDropDownProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const mobileDropDownStyles = mobileDropDownStyle(appColors);
    return (
        <View>
            <TouchableOpacity
                style={mobileDropDownStyles.clickableDropdownContainer}
                onPress={props.onPress}
                testID={AUTOMATION_TEST_ID.DROP_DOWN}
                accessibilityLabel={AUTOMATION_TEST_ID.DROP_DOWN}>
                <View style={mobileDropDownStyles.dropdownContainer}>
                    <View style={mobileDropDownStyles.countryIcon}>{props.countryIcon}</View>
                    <Text style={mobileDropDownStyles.countryCode}>{props.countryCode}</Text>
                    <DropDownIcon />
                </View>
            </TouchableOpacity>
            <View style={mobileDropDownStyles.dropdownLineContainer}>
                <View style={mobileDropDownStyles.verticalLine} />
            </View>

            <TextinputBox
                style={
                    isTablet
                        ? mobileDropDownStyles.tabTextInputLayoutStyle
                        : mobileDropDownStyles.mobileTextInputLayoutStyle
                }
                keyboardType={'numeric'}
                onChangeText={props.onChangeMobileNumber}
                textInputBoxTestID={AUTOMATION_TEST_ID.MOBILE_NUMBER_TEXT_INPUT_BOX}
                textInputBoxAccessibilityLabel={AUTOMATION_TEST_ID.MOBILE_NUMBER_TEXT_INPUT_BOX}
            />
        </View>
    );
}

export interface MobileNumberDropDownProps {
    countryIcon: any;
    countryCode: string;
    placehodler?: string;
    onPress: () => void;
    onChangeMobileNumber: (text: string) => void;
}

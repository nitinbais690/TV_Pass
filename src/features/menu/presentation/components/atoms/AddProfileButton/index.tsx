import React from 'react';
import { View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AddProfileButtonStyle } from './style';
import PlusIcon from 'assets/images/add_profile_plus.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLocalization } from 'contexts/LocalizationContext';
import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';

export default function AddProfileButton(props: AddProfileButtonProps) {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const { strings } = useLocalization();

    const style = AddProfileButtonStyle(appColors);

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={style.mainContainer}
            testID={AUTOMATION_TEST_ID.ADD_PROFILE}
            accessibilityLabel={AUTOMATION_TEST_ID.ADD_PROFILE}>
            <View style={style.container}>
                <PlusIcon />
            </View>
            <Text style={style.textStyle}>{strings.menu_Add_profile_btn_label}</Text>
        </TouchableOpacity>
    );
}

interface AddProfileButtonProps {
    onPress: () => void;
}

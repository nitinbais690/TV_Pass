import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import ManageProfileItem from '../../atoms/ManageProfileItem';
import AddIcon from 'assets/images/ic_add_themed.svg';
import EditIcon from 'assets/images/ic_edit.svg';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { View } from 'react-native';
import { manageProfileOptionsStyle } from './styles';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNavigation } from '@react-navigation/native';
import { AUTOMATION_TEST_ID } from 'features/profile/presentation/automation-ids';

const ManageProfileOptions = ({ hideAddMore }: ManageProfileOptionsProps) => {
    const navigation = useNavigation();
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const { strings } = useLocalization();

    const openAddProfileScreen = () => navigation.push(NAVIGATION_TYPE.EDIT_PROFILE, {});

    const openManageProfileScreen = () =>
        navigation.push(NAVIGATION_TYPE.MANAGE_PROFILE, { title: strings.manageProfile }, {});
    return (
        <View>
            {!hideAddMore && (
                <>
                    <ManageProfileItem
                        onPress={() => {
                            openAddProfileScreen();
                        }}
                        title={strings['profile.add_profile']}
                        description={strings['profile.add_profile_desc']}
                        icon={<AddIcon />}
                        testID={AUTOMATION_TEST_ID.ADD_PROFILE}
                        accessibilityLabel={AUTOMATION_TEST_ID.ADD_PROFILE}
                    />
                    <View style={manageProfileOptionsStyle(appColors).dividerStyle} />
                </>
            )}

            <ManageProfileItem
                onPress={() => {
                    openManageProfileScreen();
                }}
                title={strings['profile.manage_profiles']}
                description={strings['profile.manage_profiles_desc']}
                icon={<EditIcon />}
                testID={AUTOMATION_TEST_ID.MANAGE_PROFILE}
                accessibilityLabel={AUTOMATION_TEST_ID.MANAGE_PROFILE}
            />
        </View>
    );
};

export default ManageProfileOptions;

interface ManageProfileOptionsProps {
    hideAddMore?: boolean;
}

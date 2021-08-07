import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useProfiles } from 'contexts/ProfilesContextProvider';
import { MAX_PROFILE_COUNT } from 'features/profile/data/utils/ProfileUtils';
import { Profile } from 'features/profile/domain/entities/profile';
import React from 'react';
import { FlatList, View } from 'react-native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import AddProfileButton from '../../atoms/AddProfileButton';
import ProfileItemView from '../../atoms/ProfileItemView';
import { ProfileListViewStyle } from './style';

export function ProfileListView(props: ProfileItemProps) {
    const style = ProfileListViewStyle();
    const navigation = useNavigation();
    const { setActiveProfile } = useProfiles();

    function navigateToHome(navigation: any) {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
            }),
        );
    }

    const renderItem = (item: Profile) => {
        return (
            <View
                style={style.itemStyle}
                testID={AUTOMATION_TEST_ID.PROFILE + item.firstName}
                accessibilityLabel={AUTOMATION_TEST_ID.PROFILE + item.firstName}>
                <ProfileItemView
                    profileName={item.firstName}
                    isSelectedItem={item.isSelectedProfile}
                    onPress={async () => {
                        await setActiveProfile(item);
                        navigateToHome(navigation);
                    }}
                />
            </View>
        );
    };

    const openAddProfileScreen = () => navigation.push(NAVIGATION_TYPE.EDIT_PROFILE, {});
    const canShowAddProfile = (): boolean => props.profiles.length < MAX_PROFILE_COUNT;

    return (
        <View style={style.container}>
            {canShowAddProfile() && (
                <View style={style.itemStyle}>
                    <AddProfileButton
                        onPress={() => {
                            openAddProfileScreen();
                        }}
                    />
                </View>
            )}

            <View style={style.profileList}>
                <FlatList<Profile>
                    data={props.profiles}
                    renderItem={({ item }) => renderItem(item)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item: Profile) => String(item.contactID)}
                />
            </View>
        </View>
    );
}

export interface ProfileItemProps {
    profiles: Array<Profile>;
}

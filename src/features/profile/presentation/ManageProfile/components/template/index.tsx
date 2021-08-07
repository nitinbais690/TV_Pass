import React from 'react';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { FlatList, View, ListRenderItem } from 'react-native';
import { manageProfileStyle } from './styles';
import { Profile } from 'features/profile/domain/entities/profile';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';
import ProfileList from '../molecules/ProfileList';
import { useProfiles } from 'contexts/ProfilesContextProvider';
import { appFlexStyles } from 'core/styles/FlexStyles';
import AddProfile from '../molecules/AddProfile';
import { MAX_PROFILE_COUNT } from 'features/profile/data/utils/ProfileUtils';
import { useLocalization } from 'contexts/LocalizationContext';

const ManageProfileTemplate = (props: ManageProfileTemplateProps) => {
    const style = manageProfileStyle();
    const { profiles, loading } = useProfiles();
    const { strings } = useLocalization();
    const renderItem: ListRenderItem<Profile> = ({ item, index }) => {
        return (
            <ProfileList
                profile={item}
                onPress={() => {
                    props.navigation.navigate(NAVIGATION_TYPE.EDIT_PROFILE, {
                        resource: item,
                        isEditProfile: true,
                    });
                }}
                isLastItem={profiles.length - 1 === index}
            />
        );
    };

    const navigateToAddProfile = () => {
        props.navigation.navigate(NAVIGATION_TYPE.EDIT_PROFILE, {});
    };

    const showAddProfileButton = (): boolean => {
        return props.title === strings['settings.list.user_profiles.title'] && profiles.length < MAX_PROFILE_COUNT;
    };
    return (
        <BackgroundGradient>
            <BackNavigation
                isFullScreen={true}
                navigationTitle={props.title}
                onPress={() => {
                    props.navigation.goBack();
                }}
            />

            {loading && <AppLoadingIndicator style={style.loaderStyle} />}
            {!loading && (
                <View style={style.container}>
                    <FlatList data={profiles} renderItem={renderItem} keyExtractor={item => item.contactID} />
                    {showAddProfileButton() && (
                        <View
                            style={[
                                appFlexStyles.rowHorizontalAlignSpaceBetween,
                                appFlexStyles.rowVerticalAlignCenter,
                            ]}>
                            <AddProfile onPress={() => navigateToAddProfile()} />
                        </View>
                    )}
                </View>
            )}
        </BackgroundGradient>
    );
};

interface ManageProfileTemplateProps {
    navigation: any;
    title: string;
}

export default ManageProfileTemplate;

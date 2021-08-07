import React from 'react';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { StatusBar, FlatList, View, ListRenderItem } from 'react-native';
import { profileSelectionTemplateStyle } from './styles';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import ProfileListItem from '../molecules/ProfileListItem';
import ManageProfileOptions from '../molecules/ManageProfileOptions/ManageProfileOptions';
import { Profile } from 'features/profile/domain/entities/profile';
import { CommonActions } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { MAX_PROFILE_COUNT } from 'features/profile/data/utils/ProfileUtils';
import { selectDeviceType } from 'qp-common-ui';
import { useProfiles } from 'contexts/ProfilesContextProvider';

const ProfileSelectionTemplate = (props: ProfileSelectionTemplateProps) => {
    const { strings } = useLocalization();
    const appPref = useAppPreferencesState();
    const { profiles, loading, setActiveProfile } = useProfiles();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const numberOfColumns = selectDeviceType({ Handset: 3 }, 3);
    const style = profileSelectionTemplateStyle();

    const renderItem: ListRenderItem<Profile> = ({ item }) => {
        return (
            <ProfileListItem
                numberOfColumns={numberOfColumns}
                profile={item}
                onPress={() => {
                    navigateToHome(item);
                }}
            />
        );
    };

    async function navigateToHome(item: Profile) {
        if (item) {
            await setActiveProfile(item);
        }
        props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
            }),
        );
    }

    const canHideAddMoreRow = () => profiles && profiles.length > MAX_PROFILE_COUNT - 1;

    return (
        <BackgroundGradient>
            <StatusBar translucent backgroundColor={appColors.transparent} />
            <View style={style.container}>
                <CommonTitle style={style.titleStyle} text={strings['profile.select_profile']} showThemedDot={true} />
                <FlatList
                    data={profiles}
                    renderItem={renderItem}
                    numColumns={numberOfColumns}
                    keyExtractor={item => item.contactID}
                />
            </View>
            <View style={[style.container, style.manageProfileStyle]}>
                <ManageProfileOptions hideAddMore={canHideAddMoreRow()} />
            </View>
            {loading && <AppLoadingIndicator style={style.loaderStyle} />}
        </BackgroundGradient>
    );
};

interface ProfileSelectionTemplateProps {
    navigation: any;
}

export default ProfileSelectionTemplate;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableHighlight, Image, FlatList } from 'react-native';
import { appPadding } from '../../../AppStyles';
import { Avatar } from 'react-native-elements';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { percentage } from 'qp-common-ui';
import { useProfiles } from '../../contexts/ProfilesContextProvider';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

interface UserProfileViewProps {
    horizontal: boolean;
    numColumns?: number;
    navigation: any;
}

export const UserProfileView = (props: UserProfileViewProps): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const { profiles, setActiveProfile, activeProfile } = useProfiles();

    const defaultStyles = StyleSheet.create({
        listBottomPadding: {
            alignSelf: 'flex-start',
            flex: 1,
        },
        selectedProfile: {
            borderRadius: 50,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: appColors.brandTint,
        },
        unselectedProfile: {
            width: percentage(28, true),
            height: percentage(35, true),
            borderRadius: 50,
            overflow: 'hidden',
        },
        profileName: {
            color: appColors.secondary,
            marginTop: appPadding.xs(),
            alignSelf: 'center',
        },
        selectedImage: {
            width: Platform.isTV ? percentage(2, true) : percentage(5, true),
            height: Platform.isTV ? percentage(2, true) : percentage(5, true),
            marginTop: appPadding.sm(),
            marginRight: appPadding.sm(),
            position: 'absolute',
            alignSelf: 'flex-end',
        },
        induvidualProfile: {
            //height: percentage(35, true),
            width: percentage(32, true),
            alignItems: 'center',
        },
        profilesContainer: {
            marginBottom: appPadding.md(),
            marginLeft: appPadding.sm(),
        },
    });
    const [activeUser, setActiveUser] = useState<string>();
    useEffect(() => {
        activeProfile && setActiveUser(activeProfile.name);
    }, [activeProfile]);
    const defaultRenderResource = React.useCallback(
        ({ item }: { item: any }): JSX.Element => {
            const isActive = activeProfile && item.name === activeUser;
            return (
                <TouchableHighlight
                    style={defaultStyles.induvidualProfile}
                    underlayColor={'transparent'}
                    onPress={() => {
                        setActiveProfile(item);
                        props.navigation.navigate(NAVIGATION_TYPE.APP_TABS);
                    }}>
                    <View>
                        <Avatar
                            size={100}
                            rounded
                            icon={{ name: 'user', type: 'font-awesome' }}
                            activeOpacity={0.7}
                            avatarStyle={isActive ? defaultStyles.selectedProfile : defaultStyles.unselectedProfile}
                        />
                        <Text style={defaultStyles.profileName}>{item.name}</Text>
                        {isActive && (
                            <Image
                                source={require('../../../assets/images/selected.png')}
                                style={defaultStyles.selectedImage}
                            />
                        )}
                    </View>
                </TouchableHighlight>
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeUser],
    );

    const renderProfiles = () => (
        <>
            {
                <FlatList
                    style={defaultStyles.listBottomPadding}
                    horizontal={props.horizontal}
                    numColumns={props.horizontal ? 1 : props.numColumns}
                    showsHorizontalScrollIndicator={false}
                    data={profiles}
                    renderItem={defaultRenderResource}
                />
            }
        </>
    );

    return <View style={defaultStyles.profilesContainer}>{renderProfiles()}</View>;
};

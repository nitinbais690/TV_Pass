import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { profileListItemStyle } from './styles';
import FastImage from 'react-native-fast-image';
import { Profile } from 'features/profile/domain/entities/profile';
import { getDefaultProfileLogo } from 'features/profile/data/utils/ProfileUtils';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { AUTOMATION_TEST_ID } from 'features/profile/presentation/automation-ids';

const ProfileListItem = (props: ProfileListItemProps) => {
    const styles = profileListItemStyle(useAppColors(), props.numberOfColumns);
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={props.onPress}
            testID={AUTOMATION_TEST_ID.PROFILE + props.profile.firstName}
            accessibilityLabel={AUTOMATION_TEST_ID.PROFILE + props.profile.firstName}>
            <View style={styles.profileItemStyle}>
                <FastImage style={styles.profileLogoSize} source={getDefaultProfileLogo(props.profile.contactType)} />
                <Text style={styles.profileNameStyle}>{props.profile.firstName}</Text>
            </View>
        </TouchableOpacity>
    );
};

interface ProfileListItemProps {
    profile: Profile;
    onPress: () => void;
    numberOfColumns: number;
}

export default ProfileListItem;

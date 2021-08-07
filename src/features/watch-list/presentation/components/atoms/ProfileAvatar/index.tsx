import { useProfiles } from 'contexts/ProfilesContextProvider';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { getDefaultProfileLogo } from 'features/profile/data/utils/ProfileUtils';
import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ProfileAvatarStyles } from './style';

export default function ProfileAvatar(): JSX.Element {
    const { activeProfile } = useProfiles();
    const appcolors = useAppColors();
    const styles = ProfileAvatarStyles(appcolors);
    return (
        <View style={styles.container}>
            <FastImage
                style={styles.logo}
                source={getDefaultProfileLogo(activeProfile ? activeProfile.contactType : '')}
            />
            <Text style={styles.profileTitle}>{activeProfile ? activeProfile.firstName : ''}</Text>
        </View>
    );
}

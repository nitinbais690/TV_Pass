import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ProfileAvatar from 'features/watch-list/presentation/components/atoms/ProfileAvatar';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useLocalization } from 'contexts/LocalizationContext';
import { profileRowStyle } from './style';

const ProfileRow = (props: ProfileRowProps) => {
    const { strings } = useLocalization();
    const styles = profileRowStyle(useAppColors());

    return (
        <View style={styles.container}>
            <ProfileAvatar />

            <TouchableOpacity onPress={props.onDelete}>
                <Text style={styles.deleteLabel}>{strings['download.delete_all']}</Text>
            </TouchableOpacity>
        </View>
    );
};

interface ProfileRowProps {
    onDelete: () => void;
}

export default ProfileRow;

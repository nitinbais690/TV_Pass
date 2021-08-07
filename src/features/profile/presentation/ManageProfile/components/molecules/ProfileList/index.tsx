import React from 'react';
import { Text, View } from 'react-native';
import { profileListItemStyle } from './styles';
import FastImage from 'react-native-fast-image';
import { Profile } from 'features/profile/domain/entities/profile';
import { getDefaultProfileLogo } from 'features/profile/data/utils/ProfileUtils';
import { appFlexStyles } from 'core/styles/FlexStyles';
import EditRow from 'core/presentation/components/atoms/EditRow';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { scale } from 'qp-common-ui';

const ProfileList = (props: ProfileListItemProps) => {
    const getBorderWidth = (isLastItem: boolean) => {
        if (isLastItem) {
            return scale(0);
        } else {
            return scale(1);
        }
    };
    const styles = profileListItemStyle(useAppColors(), getBorderWidth(props.isLastItem));

    return (
        <View
            style={[
                styles.container,
                appFlexStyles.rowHorizontalAlignSpaceBetween,
                appFlexStyles.rowVerticalAlignCenter,
            ]}>
            <View style={[appFlexStyles.flexRow, appFlexStyles.rowVerticalAlignCenter, styles.content]}>
                <FastImage style={styles.profileLogoSize} source={getDefaultProfileLogo(props.profile.contactType)} />
                <Text style={styles.profileNameStyle}>{props.profile.firstName}</Text>
            </View>

            <EditRow
                showText={true}
                onPress={props.onPress}
                testID={props.profile.firstName}
                accessibilityLabel={props.profile.firstName}
            />
        </View>
    );
};

interface ProfileListItemProps {
    profile: Profile;
    onPress: () => void;
    isLastItem: boolean;
}

export default ProfileList;

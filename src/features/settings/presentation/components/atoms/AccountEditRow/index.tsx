import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Profile } from 'features/profile/domain/entities/profile';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { accountEditRowStyle } from './style';
import Edit from 'assets/images/edit_outline_white.svg';
import { getDefaultProfileLogo } from 'features/profile/data/utils/ProfileUtils';
import useAppColors from 'core/presentation/hooks/use-app-colors';

const AccountEditRow = (props: AccountEditRowProps) => {
    const styles = accountEditRowStyle(useAppColors());

    return (
        <View style={[appFlexStyles.rowVerticalAlignCenter]}>
            <View style={[appFlexStyles.flexRow, appFlexStyles.rowVerticalAlignCenter, styles.content]}>
                <FastImage style={styles.profileLogoSize} source={getDefaultProfileLogo(props.profile.contactType)} />
                <Text style={styles.profileNameStyle}>{props.profile.firstName}</Text>
            </View>

            <TouchableOpacity onPress={props.onPress}>
                <Edit height={styles.editIconSize.height} width={styles.editIconSize.width} />
            </TouchableOpacity>
        </View>
    );
};

interface AccountEditRowProps {
    profile: Profile;
    onPress: () => void;
}

export default AccountEditRow;

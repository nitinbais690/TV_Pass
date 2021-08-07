import React from 'react';
import { View, Text } from 'react-native';

import { otpMobileNumberStyles } from './style';
import { useLocalization } from 'contexts/LocalizationContext';
import EditRow from 'core/presentation/components/atoms/EditRow';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import SubSectionLabel from 'core/presentation/components/atoms/SubSectionLabel';

export default function OTPMobileNumber(props: OTPMobileNumberProps) {
    const { strings } = useLocalization();
    const styles = otpMobileNumberStyles(useAppColors());
    return (
        <View style={[styles.container, props.style]}>
            <SubSectionLabel title={props.subSectionTitle} />
            <View style={styles.mobileNumberContainer}>
                <Text style={styles.mobileNumberText}>{props.mobileNumber}</Text>
                <EditRow showText={true} onPress={props.onChangePressed} editText={strings['verifyotp.change']} />
            </View>
        </View>
    );
}
export interface OTPMobileNumberProps {
    style?: {};
    subSectionTitle: string;
    mobileNumber: string;
    onChangePressed: () => void;
}

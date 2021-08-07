import React from 'react';
import { View } from 'react-native';
import { otpOrganismStyles } from './style';
import OTPMobileNumber from 'core/presentation/components/molecules/OTPMobileNumber';
import { useLocalization } from 'contexts/LocalizationContext';
import OTPInput from 'core/presentation/components/atoms/OTPInput';

export default function OTPOrganism(props: OTPOrganismProps) {
    const { strings }: any = useLocalization();
    return (
        <View style={otpOrganismStyles.otpContainer}>
            <OTPMobileNumber
                subSectionTitle={strings['verifyotp.otp_sent_to']}
                mobileNumber={props.mobileNumber}
                onChangePressed={() => {
                    props.onMobileNumberChange();
                }}
            />
            <OTPInput
                style={otpOrganismStyles.otpInputSection}
                getOTP={otp => {
                    props.getOTP(otp);
                }}
                pinCount={props.pinCount}
                reset={props.reset}
            />
        </View>
    );
}

export interface OTPOrganismProps {
    pinCount: string;
    mobileNumber: string;
    reset: boolean;
    getOTP: (otp: string) => void;
    onMobileNumberChange: () => void;
}

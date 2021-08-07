import React from 'react';
import VerifyOTPTemplate from 'features/authentication/presentation/mob-auth/components/template/VerifyOTPTemplate';

export default function VerifyOTPScreen({ navigation, route }: { navigation: any; route: any }) {
    const { mobileNumber, country, countryCode } = route.params;
    return (
        <VerifyOTPTemplate
            navigation={navigation}
            mobileNumber={mobileNumber}
            country={country}
            countryCode={countryCode}
        />
    );
}

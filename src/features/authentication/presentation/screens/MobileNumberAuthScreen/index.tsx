import React from 'react';
import MobileNumberAuthTemplate from 'features/authentication/presentation/mob-auth/components/template/MoblieNumberAuthTemplate';

export default function MobileNumberAuthScreen(props: MobileNumberAuthScreenProps) {
    return <MobileNumberAuthTemplate navigation={props.navigation} />;
}

interface MobileNumberAuthScreenProps {
    navigation: any;
}

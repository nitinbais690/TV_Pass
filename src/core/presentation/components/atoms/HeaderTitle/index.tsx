import React from 'react';
import { View } from 'react-native';
import BrandLogo from '../BrandLogo';
import { headerTitleStyle, BRAND_LOGO_HEIGHT, BRAND_LOGO_WIDTH } from './style';

export default function HeaderTitle() {
    return (
        <View style={headerTitleStyle.headerTitleContainer}>
            <BrandLogo width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} />
        </View>
    );
}

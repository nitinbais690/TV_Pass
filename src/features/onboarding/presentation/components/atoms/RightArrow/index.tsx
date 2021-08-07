import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import RightArrowIcon from '../../../../../../../assets/images/right_arrow.svg';
import { rightArrowStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';

/*
 *   Renders circle button includes right arrow image with gradient effect.
 **/
export default function RightArrowCircleButton() {
    const appColors = useAppColors();
    return (
        <LinearGradient
            style={rightArrowStyle.buttonCircle}
            colors={[appColors.brandTintLight, appColors.brandTintDark]}>
            <RightArrowIcon />
        </LinearGradient>
    );
}

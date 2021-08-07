import useAppColors from 'core/presentation/hooks/use-app-colors';
import React, { useEffect, useState } from 'react';
import { styles } from '../BrightnessView/styles';
import { appDimensionValues } from 'core/styles/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import Brightnessicon from 'assets/images/sun.svg';
import { Text } from 'react-native';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';

export default function BrightnessView(props: BlackBgWithBorderProps) {
    const appColors = useAppColors();
    const style = styles(appColors);
    const [brightness, setBrightness] = useState<number>(0);

    useEffect(() => {
        if (brightness == 0) {
            SystemSetting.setAppBrightness(props.initialBrightness / 100);
            setBrightness(props.initialBrightness);
        }
    }, [brightness, props.initialBrightness]);

    return (
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
            useAngle={true}
            angle={90}
            style={[style.containerStyle, props.style]}>
            <Text style={style.plusTextStyle}>+</Text>
            <Slider
                maximumValue={100}
                minimumValue={0}
                value={brightness}
                step={1}
                style={style.sliderStyle}
                onSlidingComplete={(value: number) => {
                    setBrightness(value);
                    SystemSetting.setAppBrightness(value / 100);
                    props.onCompleteBrightness(value);
                }}
                onValueChange={(value: number) => {
                    setBrightness(value);
                    SystemSetting.setAppBrightness(value / 100);
                }}
                thumbTintColor={appColors.secondary}
                minimumTrackTintColor={appColors.secondary}
                maximumTrackTintColor={appColors.secondary}
            />
            <Text style={style.minusTextStyle}>-</Text>
            <Brightnessicon
                style={style.brightnessIconStyle}
                height={appDimensionValues.xlg}
                width={appDimensionValues.xlg}
            />
        </LinearGradient>
    );
}

interface BlackBgWithBorderProps {
    initialBrightness: number;
    onCompleteBrightness: (brightness: number) => void;
    style?: {};
}

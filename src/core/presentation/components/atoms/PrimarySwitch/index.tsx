import React from 'react';
import { Switch } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';

export const PrimarySwitch = ({ activated, containerStyle, onValueChange }: PrimarySwitchProps) => {
    const appColors = useAppColors();

    return (
        <Switch
            style={containerStyle}
            thumbColor={appColors.secondary}
            trackColor={{ false: appColors.primaryVariant3, true: appColors.brandTintLight }}
            value={activated}
            onValueChange={onValueChange}
        />
    );
};

interface PrimarySwitchProps {
    containerStyle?: {};
    onValueChange: (value: boolean) => void;
    activated: boolean;
}

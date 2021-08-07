import React from 'react';
import { View, Text } from 'react-native';
import { PrimarySwitch } from 'core/presentation/components/atoms/PrimarySwitch';
import { primarySwitchRowStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';

const PrimarySwitchRow = (props: PrimarySwitchRowProps) => {
    const styles = primarySwitchRowStyle(useAppColors());
    return (
        <View style={props.style}>
            <View style={styles.rowContainer}>
                <Text style={styles.text}>{props.text}</Text>
                <PrimarySwitch
                    containerStyle={styles.switch}
                    activated={props.activated}
                    onValueChange={props.onValueChange}
                />
            </View>
            {props.secondaryText && <Text style={styles.secondaryText}>{props.secondaryText}</Text>}
        </View>
    );
};

interface PrimarySwitchRowProps {
    style?: {};
    text: string;
    secondaryText?: string;
    activated: boolean;
    onValueChange: (value: boolean) => void;
}

export default PrimarySwitchRow;

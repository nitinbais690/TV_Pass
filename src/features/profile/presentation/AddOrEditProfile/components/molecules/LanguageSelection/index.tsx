import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { selectionStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFlexStyles } from 'core/styles/FlexStyles';
import DropDownArrow from 'assets/images/drop_down_arrow.svg';

export const LanguageSelection = (props: LanguageSelectionProps) => {
    const styles = selectionStyle(useAppColors());

    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={props.style}
            testID={props.dropDownTestID}
            accessibilityLabel={props.dropDownaccessibilityLabel}>
            <>
                <View style={[appFlexStyles.rowHorizontalAlignSpaceBetween]}>
                    <Text style={styles.label}>{props.label}</Text>
                    <DropDownArrow />
                </View>
                <Text style={styles.value}>{props.value}</Text>
            </>
        </TouchableOpacity>
    );
};

interface LanguageSelectionProps {
    style?: {};
    label: string;
    value: string;
    onPress: any;
    dropDownTestID?: string;
    dropDownaccessibilityLabel?: string;
}

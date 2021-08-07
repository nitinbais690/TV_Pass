import React from 'react';
import { AccessibilityProps, Text } from 'react-native';
import { rightArrowActionButtonStyles } from './style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RightArrowIcon from 'assets/images/right_arrow_icon.svg';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

export default function RightArrowActionButton(props: RightArrowActionButtonProps) {
    const styles = rightArrowActionButtonStyles(useAppColors());
    return (
        <TouchableOpacity
            style={[styles.container, props.style]}
            onPress={props.onPress}
            testID={props.testID}
            accessibilityLabel={props.accessibilityLabel}>
            <Text style={[styles.textStyle, props.textStyle]}>{props.title}</Text>
            <RightArrowIcon />
        </TouchableOpacity>
    );
}

export interface RightArrowActionButtonProps extends AccessibilityProps {
    title: string;
    style?: {};
    textStyle?: {};
    onPress?: () => void;
    testID?: string;
    accessibilityLabel?: string;
}

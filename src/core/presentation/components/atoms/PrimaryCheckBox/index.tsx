import React from 'react';
import { CheckBox } from 'react-native-elements';
import { checkBoxStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import CheckboxSelected from 'assets/images/checkbox_selected.svg';
import CheckboxUnselected from 'assets/images/checkbox_unselected.svg';

export const PrimaryCheckBox = ({ checked, label, containerStyle, onPress }: PrimaryCheckBoxProps) => {
    const styles = checkBoxStyle(useAppColors());

    return (
        <CheckBox
            containerStyle={[styles.container, containerStyle]}
            textStyle={styles.text}
            checkedIcon={<CheckboxSelected />}
            uncheckedIcon={<CheckboxUnselected />}
            checked={checked}
            title={label}
            onPress={onPress}
        />
    );
};

interface PrimaryCheckBoxProps {
    containerStyle?: {};
    label: string;
    onPress: any;
    checked: boolean;
}

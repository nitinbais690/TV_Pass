import React from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import CheckboxSelected from 'assets/images/checkbox_selected.svg';
import CheckboxUnselected from 'assets/images/checkbox_unselected.svg';
import { hintCheckBoxStyle } from './style';
import useAppColors from 'core/presentation/hooks/use-app-colors';

export const HintCheckBox = (props: HintCheckBoxProps) => {
    const styles = hintCheckBoxStyle(useAppColors());

    return (
        <View style={[styles.container, props.containerStyle]}>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    containerStyle={styles.checkbox}
                    textStyle={styles.text}
                    checkedIcon={props.checkedIcon ? props.checkedIcon : <CheckboxSelected />}
                    uncheckedIcon={props.uncheckedIcon ? props.uncheckedIcon : <CheckboxUnselected />}
                    checked={props.checked}
                    title={props.label}
                    onPress={props.onPress}
                />
            </View>
            <View style={styles.hintContainer}>{props.hint && <Text style={styles.hintText}>{props.hint}</Text>}</View>
        </View>
    );
};

interface HintCheckBoxProps {
    containerStyle?: {};
    label: string;
    hint?: string;
    onPress: () => void;
    checked: boolean;
    checkedIcon?: JSX.Element;
    uncheckedIcon?: JSX.Element;
}

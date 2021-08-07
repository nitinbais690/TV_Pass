import { TextinputBox } from 'core/presentation/components/atoms/TextinputBox';
import React from 'react';
import { View, Text, TextInputProps } from 'react-native';
import { textInputBoxStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import InputErrorView from 'core/presentation/components/atoms/InputErrorView';

export const TextinputBoxWithLabel = (props: TextinputBoxWithLabelProps) => {
    const styles = textInputBoxStyle(useAppColors());

    return (
        <View style={props.style}>
            <Text style={styles.label}>{props.label}</Text>
            <TextinputBox
                {...props}
                textInputBoxTestID={props.textInputBoxTestID}
                textInputBoxAccessibilityLabel={props.textInputBoxAccessibilityLabel}
            />
            {props.isError && <InputErrorView errorText={props.validationError} style={styles.inputErrorStyle} />}
        </View>
    );
};

interface TextinputBoxWithLabelProps extends TextInputProps {
    style?: {};
    label: string;
    isError?: boolean;
    validationError: string;
    textInputBoxTestID?: string;
    textInputBoxAccessibilityLabel?: string;
}

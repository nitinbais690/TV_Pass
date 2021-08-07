import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { textInputBoxStyle } from './styles';

export const TextinputBox = React.forwardRef<TextInput, TextInputBoxProps>((props, ref) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const styles = textInputBoxStyle(appColors);
    return (
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
            useAngle={true}
            angle={140}
            style={[styles.container]}>
            <TextInput
                keyboardType="default"
                ref={ref}
                style={[styles.textInputStyle, props.style]}
                selectionColor={appColors.brandTintLight}
                autoCorrect={false}
                {...props}
                testID={props.textInputBoxTestID}
                accessibilityLabel={props.textInputBoxAccessibilityLabel}
            />
        </LinearGradient>
    );
});

interface TextInputBoxProps extends TextInputProps {
    style?: {};
    textInputBoxTestID?: string;
    textInputBoxAccessibilityLabel?: string;
}

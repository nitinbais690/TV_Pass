import React from 'react';
import { AccessibilityProps, View, Text } from 'react-native';

import { ErrorMessageBoxStyle } from 'styles/ErrorMessageBox.style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

export interface ErrorMessage {
    displayError: boolean;
    message: string;
}
interface ErrorMessageBoxProps extends AccessibilityProps {
    value: string;
}

const ErrorMessageBox = (props: ErrorMessageBoxProps): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const styles: any = ErrorMessageBoxStyle({ appColors, appPadding });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.value}</Text>
        </View>
    );
};

export default ErrorMessageBox;

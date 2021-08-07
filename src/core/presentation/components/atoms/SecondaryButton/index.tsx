import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button as RNEButton, ButtonProps as RNEButtonProps } from 'react-native-elements';
import { styles } from './styles';
import { appFontStyle } from 'core/styles/AppStyles';
import useAppColors from 'core/presentation/hooks/use-app-colors';

interface ButtonProps extends RNEButtonProps {
    hasTVPreferredFocus?: boolean;
    secondaryTestID?: string;
    secondaryAccessibilityLabel?: string;
}

const SecondaryButton = (props: ButtonProps) => {
    const [focussed, setFocussed] = useState(false);
    let buttonStyles = styles(useAppColors());
    let fontStyles = appFontStyle;

    return (
        <RNEButton
            containerStyle={[buttonStyles.containerStyle, props.containerStyle]}
            buttonStyle={[
                buttonStyles.buttonStyle,
                Platform.isTV && !focussed ? buttonStyles.unfocused : {},
                props.buttonStyle,
            ]}
            titleStyle={props.titleStyle || [fontStyles.body3, buttonStyles.titleStyle]}
            {...props}
            onFocus={() => setFocussed(true)}
            onBlur={() => setFocussed(false)}
            hasTVPreferredFocus={props.hasTVPreferredFocus === false ? props.hasTVPreferredFocus : true}
            onPress={e => {
                if (props.onPress) {
                    // see here for more details: https://github.com/facebook/react-native/issues/25979
                    props.onPress(e);
                }
            }}
            testID={props.secondaryTestID}
            accessibilityLabel={props.secondaryAccessibilityLabel}
        />
    );
};

export default SecondaryButton;

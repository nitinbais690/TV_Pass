import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button as RNEButton, ButtonProps as RNEButtonProps } from 'react-native-elements';
import { arrowRightIconHeight, arrowRightIconWidth, styles } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import { appFontStyle } from 'core/styles/AppStyles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import ArrowRightIcon from 'assets/images/arrow_right_icon.svg';

interface ButtonProps extends RNEButtonProps {
    hasTVPreferredFocus?: boolean;
    primaryButtonIcon?: any;
    primaryTestID?: string;
    primaryAccessibilityLabel?: string;
}

const PrimaryButton = (props: ButtonProps) => {
    const [focussed, setFocussed] = useState(false);
    let buttonStyles = styles(useAppColors());
    let fontStyles = appFontStyle;

    return (
        <RNEButton
            containerStyle={[buttonStyles.containerStyle, props.containerStyle]}
            buttonStyle={[
                buttonStyles.buttonStyle,
                Platform.isTV && focussed ? buttonStyles.focusStyle : buttonStyles.unfocused,
                props.buttonStyle,
            ]}
            titleStyle={props.titleStyle || [fontStyles.body3, buttonStyles.titleStyle]}
            {...props}
            onFocus={() => setFocussed(true)}
            onBlur={() => setFocussed(false)}
            icon={
                Platform.isTV ? (
                    <ArrowRightIcon
                        width={arrowRightIconWidth}
                        height={arrowRightIconHeight}
                        style={Platform.isTV && buttonStyles.iconStyle}
                    />
                ) : (
                    props.primaryButtonIcon && <props.primaryButtonIcon style={buttonStyles.buttonIconStyle} />
                )
            }
            iconRight={Platform.isTV ? true : false}
            hasTVPreferredFocus={props.hasTVPreferredFocus === false ? props.hasTVPreferredFocus : true}
            ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
                colors: [useAppColors().brandTintLight, useAppColors().brandTintDark],
            }}
            onPress={e => {
                if (props.onPress) {
                    // see here for more details: https://github.com/facebook/react-native/issues/25979
                    props.onPress(e);
                }
            }}
            testID={props.primaryTestID}
            accessibilityLabel={props.primaryAccessibilityLabel}
        />
    );
};

export default PrimaryButton;

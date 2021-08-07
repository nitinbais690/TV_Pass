import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button as RNEButton, ButtonProps as RNEButtonProps } from 'react-native-elements';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';

export enum ButtonType {
    RegularButton,
    CancelButton,
}

interface ButtonProps extends RNEButtonProps {
    buttonType?: ButtonType;
    /**
     * The color of the disabled button
     */
    disabledColor?: string;
    isTV?: boolean;
    heightTv?: number;
}

const Button = (props: ButtonProps) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const isOutline = props.type === 'outline';
    const isClear = props.type === 'clear';

    const [isFocused, setIsFocused] = useState(false);

    const styles = StyleSheet.create({
        containerStyle: {
            width: '100%',
            //Android expects backgroundColor in containerStyle button appears without borderRadius and has white background
            //only when buttons are disabled and enabled
            backgroundColor: isOutline
                ? appColors.primary
                : isClear
                ? 'transparent'
                : props.buttonType === ButtonType.CancelButton
                ? appColors.primaryVariant1
                : appColors.brandTint,
        },
        buttonStyle: {
            height: props.heightTv || 50,
            width: '100%',
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 25,
            // TODO: refactor to simplify based on new design spec
            backgroundColor:
                isOutline && !props.isTV
                    ? appColors.primary
                    : isClear
                    ? 'transparent'
                    : props.buttonType === ButtonType.CancelButton
                    ? appColors.primaryVariant1
                    : props.isTV
                    ? appColors.primaryVariant1
                    : appColors.brandTint,
            borderColor:
                isOutline && !props.isTV
                    ? appColors.brandTint
                    : Platform.isTV && isFocused
                    ? appColors.secondary
                    : undefined,
            borderWidth: isOutline && !props.isTV ? 1 : Platform.isTV && isFocused ? 2 : undefined,
        },
        titleStyle: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontWeight: '500',
            color:
                (isOutline && !props.isTV) || isClear
                    ? appColors.brandTint
                    : props.isTV
                    ? appColors.secondary
                    : appColors.secondary,
        },
        disabledStyle: {
            backgroundColor: props.disabledColor ? props.disabledColor : appColors.primaryVariant1,
        },
        disabledTitleStyle: {
            color: appColors.caption,
        },
    });

    return (
        <RNEButton
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            containerStyle={styles.containerStyle}
            buttonStyle={styles.buttonStyle}
            disabledStyle={styles.disabledStyle}
            disabledTitleStyle={styles.disabledTitleStyle}
            titleStyle={props.titleStyle || styles.titleStyle}
            raised={props.raised || true}
            {...props}
        />
    );
};

export default Button;

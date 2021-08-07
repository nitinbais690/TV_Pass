import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as RNEButton, ButtonProps as RNEButtonProps } from 'react-native-elements';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';

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
}

const Button = (props: ButtonProps) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const isOutline = props.type === 'outline';
    const isClear = props.type === 'clear';
    const isSolid = props.type === 'solid';

    const styles = StyleSheet.create({
        containerStyle: {
            width: '100%',
        },
        buttonStyle: {
            height: 50,
            width: '100%',
            borderRadius: 25,
            // TODO: refactor to simplify based on new design spec
            backgroundColor: isOutline
                ? appColors.primary
                : isClear
                ? 'transparent'
                : props.buttonType === ButtonType.CancelButton
                ? appColors.primaryVariant1
                : appColors.brandTint,
            borderColor: isOutline ? appColors.brandTint : undefined,
            borderWidth: isOutline ? 1 : undefined,
        },
        titleStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: isOutline || isClear ? appColors.brandTint : isSolid ? appColors.tertiary : appColors.secondary,
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

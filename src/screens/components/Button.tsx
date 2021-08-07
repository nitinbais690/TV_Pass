import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button as RNEButton, ButtonProps as RNEButtonProps } from 'react-native-elements';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';

export enum ButtonType {
    RegularButton,
    CancelButton,
}

interface ButtonProps extends RNEButtonProps {
    buttonType?: ButtonType;
    hasTVPreferredFocus?: boolean;
}

const Button = (props: ButtonProps) => {
    const [focussed, setFocussed] = useState(false);
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const isOutline = props.type === 'outline';
    const isClear = props.type === 'clear';

    const styles = StyleSheet.create({
        containerStyle: {
            width: Platform.isTV ? '90%' : '100%',
        },
        buttonStyle: {
            height: 50,
            width: '100%',
            borderRadius: 25,
            // TODO: refactor to simplify based on new design spec
            backgroundColor: isOutline
                ? 'appColors.primary'
                : isClear
                ? 'transparent'
                : props.buttonType === ButtonType.CancelButton
                ? appColors.primaryVariant1
                : appColors.brandTint,
            borderColor: isOutline ? appColors.brandTint : undefined,
            borderWidth: isOutline ? 1 : undefined,
            elevation: 20,
        },
        titleStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: isOutline || isClear ? appColors.brandTint : appColors.secondary,
        },
        disabledStyle: {
            backgroundColor: appColors.brandTint,
        },
        disabledTitleStyle: {
            color: appColors.secondary,
        },
    });

    return (
        <RNEButton
            containerStyle={styles.containerStyle}
            buttonStyle={[
                styles.buttonStyle,
                Platform.isTV && !focussed ? { backgroundColor: appColors.primaryVariant3, elevation: 0 } : {},
            ]}
            disabledStyle={styles.disabledStyle}
            disabledTitleStyle={styles.disabledTitleStyle}
            titleStyle={props.titleStyle || styles.titleStyle}
            //raised={props.raised || true}
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
        />
    );
};

export default Button;

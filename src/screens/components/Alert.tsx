import React from 'react';
import { View, StyleSheet, Text, AlertButton, AlertOptions } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../../AppStyles';
import Button, { ButtonType } from 'screens/components/Button';
import BackgroundGradient from './BackgroundGradient';

export interface AlertProps {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
    onClose?: () => void;
}

const Alert = ({ title, message, buttons, onClose }: AlertProps) => {
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    let { appColors } = prefs.appTheme!(prefs);
    const isPortrait = height > width;

    const styles = StyleSheet.create({
        content: {
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 22,
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '20%' : '30%' }, isPortrait ? '0%' : '25%'),
            padding: 40,
        },
        title: {
            color: appColors.secondary,
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
        message: {
            color: appColors.caption,
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            marginTop: 20,
        },
        ctaContainer: {},
        button: {
            marginTop: 20,
            width: '100%',
        },
    });

    let showMessage = false;
    if (message && message.length > 0) {
        showMessage = true;
    }

    const onPress = (button: AlertButton) => {
        if (button.onPress) {
            button.onPress();
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <BackgroundGradient style={styles.content} childContainerStyle={{ width: '100%' }}>
            {title.length > 0 && <Text style={styles.title}>{title}</Text>}
            {showMessage && <Text style={styles.message}>{message}</Text>}
            <View style={styles.ctaContainer}>
                {buttons &&
                    buttons.map((button, i) => (
                        <Button
                            key={i}
                            title={button.text}
                            raised={false}
                            containerStyle={[styles.button]}
                            buttonType={button.style === 'cancel' ? ButtonType.CancelButton : ButtonType.RegularButton}
                            onPress={() => onPress(button)}
                        />
                    ))}
            </View>
        </BackgroundGradient>
    );
};

export default Alert;

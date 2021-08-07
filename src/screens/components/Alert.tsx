import React from 'react';
import { View, Text, AlertButton, AlertOptions } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import LinearGradient from 'react-native-linear-gradient';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { alertStyles } from 'core/styles/AlertStyles';
import AlertIcon from 'assets/images/alert_icon.svg';
import SecondaryButton from 'core/presentation/components/atoms/SecondaryButton';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';

export interface AlertProps {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
    onClose?: () => void;
}

const Alert = ({ title, message, buttons, onClose }: AlertProps) => {
    const { width, height } = useDimensions().window;
    const appColors = useAppColors();
    const isPortrait = height > width;
    const styles = alertStyles(appColors, isPortrait);
    let showTitle = false;
    let showMessage = false;

    if (title && title.length > 0) {
        showTitle = true;
    }
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
        <LinearGradient
            colors={['#3B4046', '#2D3037']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.content}>
            {showTitle && <Text style={styles.title}>{title}</Text>}
            {showMessage && (
                <View style={styles.textContainer}>
                    <LinearGradient
                        colors={['rgba(78, 67, 63, 0.5)', 'rgba(255, 110, 69, 0.5)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 0.5 }}
                        style={styles.iconContainer}>
                        <AlertIcon />
                    </LinearGradient>
                    <Text style={styles.textStyle}>{message}</Text>
                </View>
            )}
            {buttons && (
                <View style={buttons.length === 2 ? styles.confirmationAlertFooter : styles.infoAlertFooter}>
                    {buttons.map((button, i) => {
                        if (button.style === 'cancel') {
                            return (
                                <SecondaryButton
                                    key={i}
                                    title={button.text}
                                    raised={false}
                                    containerStyle={styles.buttonStyle}
                                    onPress={() => onPress(button)}
                                />
                            );
                        } else {
                            return (
                                <PrimaryButton
                                    key={i}
                                    title={button.text}
                                    raised={false}
                                    containerStyle={styles.buttonStyle}
                                    onPress={() => onPress(button)}
                                />
                            );
                        }
                    })}
                </View>
            )}
        </LinearGradient>
    );
};

export default Alert;

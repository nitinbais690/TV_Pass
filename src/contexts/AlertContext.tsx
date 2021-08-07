import React, { createContext, useState, useContext } from 'react';
import { AlertStatic, AlertButton, StyleSheet, Platform, AlertOptions } from 'react-native';
import Modal from 'react-native-modal';
import AlertDialog, { AlertProps } from 'screens/components/Alert';
import { RedeemButtonProps } from 'screens/components/RedeemButton';
import { useDimensions } from '@react-native-community/hooks';

interface AlertState {
    isModalVisible: boolean;
    Alert: AlertStatic;
    dismiss: () => void;
}

export const AlertContext = createContext<AlertState>({
    isModalVisible: false,
    Alert: {
        alert: () => {},
    },
    dismiss: () => {},
});

/**
 * AppPreviewContextProvider manages localization/i18n strings for the app. It allows switching the app language
 * on the fly and allows overriding the localized strings via server configuration.
 */
export const AlertContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [alertProps, setAlertProps] = useState<AlertProps>();
    const { width, height } = useDimensions().window;
    const styles = StyleSheet.create({
        container: {
            width: width,
            height: height,
            margin: 0,
            padding: 0,
        },
    });

    const Alert = {
        alert: (
            title: string,
            message?: string,
            buttons?: AlertButton[],
            options?: AlertOptions,
            subTitle?: string,
            type?: RedeemButtonProps,
        ) => {
            setAlertProps({ title, message, buttons, options, subTitle, type });
            setModalVisible(true);
        },
    };

    const onCancel = () => {
        if (alertProps && alertProps.options && alertProps.options.cancelable) {
            onClose();
        }
    };

    const onClose = () => {
        if (alertProps && alertProps.options && alertProps.options.onDismiss) {
            alertProps.options.onDismiss();
        }
        setModalVisible(false);
    };

    return (
        <AlertContext.Provider
            value={{
                isModalVisible,
                Alert,
                dismiss: onClose,
            }}>
            <>
                {children}
                <Modal
                    style={[Platform.isTV ? styles.container : undefined]}
                    onBackdropPress={onCancel}
                    isVisible={isModalVisible}
                    useNativeDriver={true}
                    hardwareAccelerated
                    hideModalContentWhileAnimating
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']}>
                    <>{alertProps && <AlertDialog {...alertProps} onClose={onClose} />}</>
                </Modal>
            </>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertContext');
    }
    return context;
};

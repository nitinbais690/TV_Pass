import React, { createContext, useState, useContext } from 'react';
import { AlertStatic, AlertButton, AlertOptions } from 'react-native';
import Modal from 'react-native-modal';
import AlertDialog, { AlertProps } from 'screens/components/Alert';

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

    const Alert = {
        alert: (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
            setAlertProps({ title, message, buttons, options });
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
                    onBackdropPress={onCancel}
                    isVisible={isModalVisible}
                    useNativeDriver={true}
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

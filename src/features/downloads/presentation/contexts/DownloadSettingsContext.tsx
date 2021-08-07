import React, { createContext, useContext, useState } from 'react';
import Modal from 'react-native-modal';
import { DownloadQuality } from 'utils/UserPreferenceUtils';
import DownloadSettingsSheet, { DownloadSettingsSheetProps } from '../components/templates/DownloadSettingsSheet';

interface DownloadSettingsState {
    isModalVisible: boolean;
    Settings: {
        show: (onSave: (quality: DownloadQuality, downloadOverCellular: boolean) => void) => void;
    };
    dismiss: () => void;
}

export const DowloadSettingsContext = createContext<DownloadSettingsState>({
    isModalVisible: false,
    Settings: {
        show: () => {},
    },
    dismiss: () => {},
});

export const DownloadSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [settingsProps, setSettingsProps] = useState<DownloadSettingsSheetProps>();

    const onClose = () => {
        setModalVisible(false);
    };

    const saveCallback = (callback: (quality: DownloadQuality, downloadOverCellular: boolean) => void) => {
        return (quality: DownloadQuality, downloadOverCellular: boolean) => {
            callback(quality, downloadOverCellular);
            onClose();
        };
    };

    const Settings = {
        show: (onSave: (quality: DownloadQuality, downloadOverCellular: boolean) => void) => {
            setSettingsProps({ onSave: saveCallback(onSave), onClose: onClose });
            setModalVisible(true);
        },
    };

    return (
        <DowloadSettingsContext.Provider
            value={{
                isModalVisible,
                Settings,
                dismiss: onClose,
            }}>
            {children}
            <Modal
                style={{ margin: 0 }}
                onBackdropPress={onClose}
                isVisible={isModalVisible}
                useNativeDriver={true}
                supportedOrientations={['portrait', 'landscape-left', 'landscape-right']}>
                <>{settingsProps && <DownloadSettingsSheet {...settingsProps} />}</>
            </Modal>
        </DowloadSettingsContext.Provider>
    );
};

export const useDownloadSettings = () => {
    const context = useContext(DowloadSettingsContext);
    if (context === undefined) {
        throw new Error('useDownloadSettings must be used within a DowloadSettingsContext');
    }
    return context;
};

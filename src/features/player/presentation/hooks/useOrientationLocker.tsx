import { useIsFocused } from '@react-navigation/native';
import { useDeviceOrientation } from '@react-native-community/hooks';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';

export const useOrientationLocker = () => {
    const { portrait } = useDeviceOrientation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToLandscape();
        }

        return () => {
            if (DeviceInfo.getDeviceType() === 'Handset') {
                Orientation.lockToPortrait();
            }
        };
    }, []);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            if (DeviceInfo.getDeviceType() === 'Handset' && portrait && isFocused) {
                Orientation.lockToLandscape();
            }
        });

        return () => task.cancel();
    }, [isFocused, portrait]);
};

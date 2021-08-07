import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/**
 * A custom hook to fetch the current orientation of the device.
 *
 * @returns {DeviceOrientation} The current orientation.
 */
export const useDeviceOrientation = () => {
    type DeviceOrientation = 'PORTRAIT' | 'LANDSCAPE';
    const [deviceOrientation, setDeviceOrientation] = useState<DeviceOrientation>();

    useEffect(() => {
        function updateState() {
            const { height, width } = Dimensions.get('window');
            if (height >= width) {
                setDeviceOrientation('PORTRAIT');
            } else {
                setDeviceOrientation('LANDSCAPE');
            }
        }

        updateState();

        // trigger a state update by watching the `Dimensions` change event
        Dimensions.addEventListener('change', updateState);

        return () => {
            Dimensions.removeEventListener('change', updateState);
        };
    }, []);

    return deviceOrientation;
};

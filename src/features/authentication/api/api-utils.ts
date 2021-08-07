import { Platform } from 'react-native';
import { isTablet } from 'react-native-device-info';

export function getFLDeviceName(): string {
    if (Platform.OS === 'ios') {
        if (Platform.isTV) {
            return 'tvos';
        } else if (isTablet()) {
            return 'iostablet';
        }
        return 'iosmobile';
    } else if (Platform.OS === 'android') {
        if (Platform.isTV) {
            return 'androidtv';
        } else if (isTablet()) {
            return 'androidtablet';
        }
        return 'androidmobile';
    }
    return 'androidmobile';
}

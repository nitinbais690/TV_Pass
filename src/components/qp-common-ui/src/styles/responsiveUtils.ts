import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

//Default guideline sizes are based on standard ~5" screen mobile device
const GUIDELINE_BASE_WIDTH = 350;
const fullWidth = Dimensions.get('window').width;

/**
 * Scales the given value relative to the current screen width, assuming a baseline width of
 * ~5" devices.
 *
 * Typical Usage:
 * ```
 * const fonts = {
 *  sm: scale(12),
 *  md: scale(14),
 *  lg: scale(20)
 * }
 * ```
 *
 * @param value The value that must be scaled to current screen size.
 * @param factor The scaling factor
 */
export const scale = (value: number, factor: number = 0.4): number =>
    value + ((fullWidth / GUIDELINE_BASE_WIDTH) * value - value) * factor;

/**
 * Calculates the percentage with respect to total available width of the screen or
 * simply appends a `%` to the passed in value, based on a given flag.
 *
 * @param value The value for which the percentage has to be calculated.
 * @param absoluteValue Optional param, that modifies controls the desired behavior.
 * Default value is false which simply appends the `%` to the value.
 *
 * @note As of RN 0.59, a bug causes the app to crash when '%' values are used inside
 * an horizontal `FlatList`. In order to work around this limitation, this function offers the
 * `absoluteValue` flag to get an absolute percentage value based on the current screen.
 * If and when this bug is fixed in future releases of RN, we will deprecate this feature.
 * Until then, we recommend using the `absoluteValue` flag very sparingly.
 *
 * @returns The percent string or the calculated absolute percent as a number
 */
export const percentage = <T extends boolean>(
    value: number,
    absoluteValue: boolean = false,
): T extends true ? number : string => {
    const w = Dimensions.get('window').width;
    // Need (as any) because of this: https://github.com/microsoft/TypeScript/issues/24929
    return absoluteValue ? (((value * w) / 100) as any) : ((value + '%') as any);
};

export type DeviceType = 'Handset' | 'Tablet' | 'Tv' | 'unknown';

/**
 * Allows for writing device type specific code, which is useful especially when describing
 * responsive styles for respective device types.
 *
 * Typical Usage:
 * ```
 * const catalogCardsPreview: selectDeviceType<number>({"Tv": 2, "Handset": 6}, 4);
 * ```
 *
 * @param spec An object containing `DeviceType` as keys.
 * @param defaultValue The default value to return when the current device type isn't listed in the spec.
 *
 * @returns The value for the device type the app is currently running on.
 */
export const selectDeviceType = <T>(spec: { [type in DeviceType]?: T }, defaultValue: T): T => {
    const deviceType = DeviceInfo.getDeviceType();
    const definedValue = spec[deviceType];
    return definedValue !== undefined ? definedValue : defaultValue;
};

import { appPaddingValues } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const selectedGradientStart = '#4E433F50';
export const selectedGradientEnd = '#FF6E4550';
export const unselectedGradientStart = '#3B4046';
export const unselectedGradientEnd = '#2D3037';

export function ProfileListViewStyle() {
    return StyleSheet.create({
        container: {
            paddingLeft: appPaddingValues.lg,
            paddingTop: appPaddingValues.md,
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        itemStyle: {
            paddingRight: appPaddingValues.xlg,
        },
        profileList: {
            flex: 1,
        },
    });
}

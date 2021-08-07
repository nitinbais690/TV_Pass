import { StyleSheet } from 'react-native';
import { appFonts } from '../../AppStyles';

export const defaultPasswordStrengthMetertyle = ({ appColors, appPadding }: any) => {
    return StyleSheet.create({
        barContainer: {
            marginVertical: appPadding.xxs(),
            width: '100%',
            flexDirection: 'row',
            textAlign: 'left',
            alignItems: 'center',
        },
        bar: {
            marginHorizontal: 1,
            height: 6,
            flex: 1,
            backgroundColor: appColors.primaryVariant2,
        },
        barWeak: {
            backgroundColor: appColors.error,
        },
        barAverage: {
            backgroundColor: appColors.warning,
        },
        barSecure: {
            backgroundColor: appColors.success,
        },
        barTextContainer: {
            marginTop: appPadding.xs(),
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        barText: {
            color: appColors.secondary,
            height: 20,
            fontFamily: appFonts.primary,
        },
    });
};

import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../AppStyles';

export const defaultSignupStyle = ({ appColors, appPadding, isPortrait, isError, deviceHeight }: any) =>
    StyleSheet.create({
        titleLabel: {
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: '600',
            textAlign: 'left',
        },
        titleContainer: {
            marginBottom: 33,
        },
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '32%' }, appPadding.sm()),
        },
        formContainer: {
            justifyContent: 'flex-start',
            paddingBottom: '10%',
            marginTop: selectDeviceType({ Tablet: -10 }, 0),
        },
        passInstructionLabel: {
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 20,
            marginBottom: 20,
        },
        passInstructionLabelText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        checkboxSection: {
            flexDirection: 'row',
            marginTop: selectDeviceType({ Tablet: !isPortrait ? (isError ? 12 : 15) : 15 }, 15),
            marginBottom: 15,
            paddingTop: 20,
            textAlign: 'left',
            alignItems: 'flex-start',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: appColors.caption,
        },
        checkboxSectionText: {
            flex: 1,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        legelInfoContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: selectDeviceType({ Tablet: deviceHeight > 762 && deviceHeight < 770 ? 5 : 10 }, 10),
            marginBottom: 10,
            paddingVertical: selectDeviceType(
                { Tablet: deviceHeight > 762 && deviceHeight < 770 ? (isError ? 15 : 20) : 20 },
                20,
            ),
            paddingHorizontal: 30,
            borderRadius: 22,
            backgroundColor: appColors.primaryVariant1,
        },
        legelInfoWrapper: {
            width: '100%',
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            flex: 1,
        },
        legalInfoContainerText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        linkColor: {
            color: appColors.brandTint,
        },
    });

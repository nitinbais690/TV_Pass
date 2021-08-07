import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts } from '../../AppStyles';

export const defaultSignupStyle = ({ appColors, appPadding, isPortrait }: any) =>
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
            marginTop: 15,
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
            width: '100%',
            marginVertical: appPadding.sm(true),
        },
        legelInfoWrapper: {
            width: '100%',
            marginTop: appPadding.xs(true),
            textAlign: 'left',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 40,
        },
        legalInfoContainerText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
        },
    });

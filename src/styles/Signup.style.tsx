import { StyleSheet } from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts, tvPixelSizeForLayout } from '../../AppStyles';

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
            marginVertical: 10,
            paddingVertical: selectDeviceType({ Tablet: 20 }, 20),
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

export const defaultSignupTVStyle = ({ appColors }: any) =>
    StyleSheet.create({
        titleLabel: {
            fontSize: tvPixelSizeForLayout(75),
            fontFamily: appFonts.primary,
            color: appColors.secondary,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        titleContainer: {
            marginBottom: tvPixelSizeForLayout(33),
        },
        planTitle: {
            width: tvPixelSizeForLayout(943),
            alignSelf: 'center',
        },
        subHeadingContainer: {
            marginBottom: tvPixelSizeForLayout(40),
            paddingHorizontal: tvPixelSizeForLayout(50),
        },
        subHeadingLabel: {
            fontSize: tvPixelSizeForLayout(45),
            fontFamily: appFonts.primary,
            color: appColors.brandTintDarked,
            fontWeight: '600',
            textAlign: 'center',
            lineHeight: tvPixelSizeForLayout(56),
        },
        rowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
        },
        inputContainer: {
            width: tvPixelSizeForLayout(280),
            marginRight: tvPixelSizeForLayout(40),
        },
        inputLabelStyle: {
            fontSize: tvPixelSizeForLayout(32),
            color: appColors.secondary,
            fontWeight: '500',
            fontStyle: 'normal',
            textAlign: 'center',
            marginBottom: tvPixelSizeForLayout(26),
        },
        containerTV: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        formContainer: {
            width: tvPixelSizeForLayout(943),
            alignSelf: 'center',
            justifyContent: 'center',
        },
        passInstructionLabel: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginBottom: tvPixelSizeForLayout(40),
        },
        passInstructionInfoLabel: {
            marginTop: tvPixelSizeForLayout(41),
            marginBottom: tvPixelSizeForLayout(40),
            alignSelf: 'center',
        },
        passInstructionLabelText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(32),
            lineHeight: tvPixelSizeForLayout(40),
            textAlign: 'center',
        },
        checkboxSection: {
            flexDirection: 'row',
            marginVertical: tvPixelSizeForLayout(33),
            alignItems: 'center',
            width: '100%',
        },
        planContainer: {
            alignSelf: 'center',
        },
        checkboxSectionTextTv: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(32),
            lineHeight: tvPixelSizeForLayout(40),
            fontWeight: '500',
            width: '87%',
        },
        checkboxContainerStyleTv: {
            padding: 0,
            borderRadius: tvPixelSizeForLayout(22),
            overflow: 'hidden',
            height: tvPixelSizeForLayout(80),
            width: tvPixelSizeForLayout(80),
            justifyContent: 'center',
            alignContent: 'center',
            marginRight: tvPixelSizeForLayout(40),
        },
        checkboxContainerStyleActiveTv: {
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(3),
            backgroundColor: appColors.brandTint,
        },
        checkboxActiveBackgroundTv: {
            backgroundColor: appColors.brandTint,
        },
        checkboxInActiveBackgroundTv: {
            backgroundColor: appColors.primaryVariant1,
        },
        legelInfoContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: tvPixelSizeForLayout(10),
            paddingRight: tvPixelSizeForLayout(41),
            padding: tvPixelSizeForLayout(40),
            paddingBottom: tvPixelSizeForLayout(34),
            borderRadius: tvPixelSizeForLayout(22),
            backgroundColor: appColors.primaryVariant1,
            width: '100%',
        },
        noticeView: {
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            marginTop: 0,
            marginBottom: tvPixelSizeForLayout(40),
            padding: tvPixelSizeForLayout(40),
            paddingRight: tvPixelSizeForLayout(45),
            backgroundColor: appColors.primaryVariant1,
            borderRadius: tvPixelSizeForLayout(27),
            width: tvPixelSizeForLayout(947),
        },
        subscribtionView: {
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            marginBottom: 0,
            backgroundColor: appColors.brandTintDarked,
            padding: tvPixelSizeForLayout(40),
            paddingRight: tvPixelSizeForLayout(45),
            borderRadius: tvPixelSizeForLayout(27),
            width: tvPixelSizeForLayout(947),
        },
        emailButtonContainer: {
            marginHorizontal: tvPixelSizeForLayout(10),
            width: tvPixelSizeForLayout(641),
            alignSelf: 'center',
        },
        tvButtonContainer: {
            width: tvPixelSizeForLayout(616),
            alignSelf: 'center',
        },
        plantvButtonContainer: {
            width: tvPixelSizeForLayout(947),
            alignSelf: 'center',
        },
        termsTextStyle: {
            alignSelf: 'center',
            color: appColors.brandTintDarked,
            marginTop: tvPixelSizeForLayout(40),
            lineHeight: tvPixelSizeForLayout(30),
            fontSize: tvPixelSizeForLayout(24),
            fontFamily: appFonts.primary,
        },
        legelInfoWrapper: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
        },
        legalInfoContainerText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(24),
            textAlign: 'center',
            lineHeight: tvPixelSizeForLayout(30),
            fontWeight: '500',
        },
        descPlanText: {
            textAlign: 'justify',
        },
        planTypeStyle: {
            color: appColors.brandTintDarked,
            paddingHorizontal: tvPixelSizeForLayout(23),
            paddingVertical: tvPixelSizeForLayout(5),
            backgroundColor: appColors.secondary,
            alignSelf: 'flex-start',
            borderRadius: tvPixelSizeForLayout(21),
            overflow: 'hidden',
        },
        subScriptionBenefitText: {
            marginTop: tvPixelSizeForLayout(25),
            marginBottom: tvPixelSizeForLayout(20),
        },
        subScriptionAmountStyle: {
            color: appColors.secondary,
            alignSelf: 'flex-start',
        },
        linkColor: {
            color: appColors.brandTint,
        },
    });

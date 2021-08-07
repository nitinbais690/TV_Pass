import { scale } from 'qp-common-ui';
import { StyleSheet } from 'react-native';
import { RoundIconButtonProps } from '.';
import { appFonts } from 'core/styles/AppStyles';

export const styles = (props: RoundIconButtonProps, appColors: any) => {
    return StyleSheet.create({
        containerStyle: {
            alignItems: 'center',
        },
        circle: {
            flex: 1,
            width: props.width,
            height: props.height,
            borderRadius: props.width / 2,
            shadowColor: appColors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: props.width / 2,
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center',
        },
        downloadProgress: {},
        actionTextStyle: {
            color: '#ECECEC',
            marginTop: scale(8),
            fontSize: appFonts.xxxs,
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
    });
};

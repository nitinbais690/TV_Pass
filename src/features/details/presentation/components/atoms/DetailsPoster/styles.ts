import { Platform, StyleSheet } from 'react-native';
import { AspectRatio, selectDeviceType } from 'qp-common-ui';

export const imageAspectRatio = AspectRatio._16by9;

export const styles = (appColors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
        },
        epgImageStyle: {
            justifyContent: 'center',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: imageAspectRatio,
            top: 0,
            left: 0,
            right: 0,
            borderRadius: selectDeviceType({ Tv: 8 }, 0),
            elevation: 30,
            flex: Platform.isTV ? 1 : undefined,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
        },
        imageStyle: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '100%',
            aspectRatio: imageAspectRatio,
            backgroundColor: Platform.isTV ? 'transparent' : appColors.primaryVariant3,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
        },
    });
};

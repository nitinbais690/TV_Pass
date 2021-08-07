import { StyleSheet } from 'react-native';
import { AspectRatio, scale } from 'qp-common-ui';
import { isTablet } from 'core/styles/AppStyles';

export const imageAspectRatio = AspectRatio._2by3;

export const styles = () => {
    return StyleSheet.create({
        container: {
            ...(isTablet
                ? {
                      width: scale(100),
                      height: scale(116.13),
                  }
                : {
                      width: scale(62),
                      height: scale(72),
                  }),
        },
        imageStyle: {
            flex: 1,
            width: '100%',
            aspectRatio: imageAspectRatio,
            borderRadius: scale(8),
        },
    });
};

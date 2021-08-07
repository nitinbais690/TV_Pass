import { StyleSheet } from 'react-native';
import { scale, selectDeviceType } from 'qp-common-ui';

export const INDICATOR_GRADIENT = ['#3B4046', '#2D3037'];

export const styles = (width: string | number, indicatorLeft: string | number) => {
    return StyleSheet.create({
        tabIndicatorStyle: {
            width: width,
            position: 'absolute',
            flex: 1,
            height: scale(38),
            marginTop: selectDeviceType({ Handset: scale(5), Tablet: scale(0) }, scale(0)),
            left: indicatorLeft,
        },
        gradientStyle: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: scale(20),
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: scale(20),
            elevation: 4,
        },
    });
};

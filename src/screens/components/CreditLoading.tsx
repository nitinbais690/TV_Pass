import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

const CreditLoading = ({ style, color = '#ffffff' }: { style?: StyleProp<ViewStyle>; color?: string }): JSX.Element => {
    return (
        <LottieView
            source={require('../../../assets/animations/Struum_CreditTransfer.json')}
            autoPlay
            style={style}
            colorFilters={[
                {
                    keypath: 'Trail Outlines',
                    color: color,
                },
                {
                    keypath: 'Trail Outlines 2',
                    color: color,
                },
                {
                    keypath: 'Trail Outlines 3',
                    color: color,
                },
                {
                    keypath: 'Trail Outlines 4',
                    color: color,
                },
                {
                    keypath: 'Trail Outlines 5',
                    color: color,
                },
                {
                    keypath: 'Trail Outlines 6',
                    color: color,
                },
            ]}
        />
    );
};

export default CreditLoading;

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

const CreditLoading = ({ style }: { style?: StyleProp<ViewStyle> }): JSX.Element => {
    return (
        <LottieView source={require('../../../assets/animations/Struum_CreditTransfer.json')} autoPlay style={style} />
    );
};

export default CreditLoading;

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useLocalization } from 'contexts/LocalizationContext';
import PremiumTick from 'assets/images/premium_tick.svg';

export default function Rating(props: { rating: string; icon?: string }) {
    const { strings } = useLocalization();
    let ratingStyle = styles(useAppColors());

    const checkisPremiumTag = (): boolean => {
        return props.rating === strings.premium;
    };

    return (
        <View style={ratingStyle.container}>
            {checkisPremiumTag() && <PremiumTick style={ratingStyle.image} />}
            <Text style={ratingStyle.textStyle}>{props.rating}</Text>
        </View>
    );
}

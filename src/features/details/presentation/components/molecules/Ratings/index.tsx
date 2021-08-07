import React from 'react';
import { View } from 'react-native';
import Rating from '../../atoms/Rating';
import { styles } from './styles';

export default function Ratings(props: RatingsProps) {
    return (
        <View style={styles.ratings}>
            {props.ratings &&
                props.ratings.length > 0 &&
                props.ratings.map(rating => <Rating key={rating} rating={rating} />)}
        </View>
    );
}

export interface RatingsProps {
    ratings: string[];
}

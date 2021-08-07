import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { MaturityRatingTagViewStyles } from './style';

export default function MaturityRatingTag(props: RatingProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme!(prefs);

    let styles = MaturityRatingTagViewStyles(appColors);
    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.container}
                colors={['rgba(59, 64, 70, 1)', 'rgba(45, 48, 55, 1)']}
                useAngle={true}
                angle={180}>
                <Text style={styles.textStyle}> {props.rating} </Text>
            </LinearGradient>
        </View>
    );
}

interface RatingProps {
    rating: string;
}

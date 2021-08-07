import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TickIcon from 'assets/images/tick.svg';
import { PremiumTagViewStyles } from './style';
import useAppColors from 'core/presentation/hooks/use-app-colors';

export default function PremiumTagView() {
    let styles = PremiumTagViewStyles(useAppColors());
    return (
        <View style={styles.parentContainer}>
            <LinearGradient
                colors={['rgba(255, 109, 46, 1)', 'rgba(221, 70, 29, 1)']}
                useAngle={true}
                angle={180}
                style={styles.gradientStyle}>
                <View style={styles.container}>
                    <TickIcon
                        width={styles.tickIconStyle.width}
                        height={styles.tickIconStyle.height}
                        style={styles.tickIconStyle}
                    />
                    <Text style={[styles.textStyle]}>Premium</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

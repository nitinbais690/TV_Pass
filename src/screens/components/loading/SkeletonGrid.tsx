import React from 'react';
import { StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import SkeletonCard, { SkeletonCardProps } from './SkeletonCard';

interface SkeletonGridProps extends SkeletonCardProps {
    count: number;
    containerStyle: StyleProp<ViewStyle>;
    viewAllAspectRatio?: number;
}

const SkeletonGrid = (props: SkeletonGridProps) => {
    const { width } = useDimensions().window;
    const styles = StyleSheet.create({
        container: { flexDirection: 'row', flexWrap: 'wrap', width: width, marginBottom: 14 },
        cardWrapper: { marginTop: 10 },
    });

    return (
        <View style={props.containerStyle}>
            <View style={styles.container}>
                {[...Array(props.count).keys()].map((n, i) => (
                    <View key={`${i}`} style={styles.cardWrapper}>
                        <SkeletonCard {...props} showFooter gridMode lastItemInRow={i % 2 === 0} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default SkeletonGrid;

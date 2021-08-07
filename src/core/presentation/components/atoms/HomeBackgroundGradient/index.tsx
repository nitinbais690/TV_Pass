import React from 'react';
import { ViewProps, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export type HeaderType = 'Regular' | 'HeaderTab';

interface BackgroundGradientProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
    insetHeader?: boolean;
    headerType?: HeaderType;
    insetTabBar?: boolean;
}

const HomeBackgroundGradient = (props: React.PropsWithChildren<BackgroundGradientProps>): JSX.Element => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        childContainer: {
            flex: 1,
        },
    });

    return (
        <LinearGradient
            colors={['#572c1c', '#572c1c', '#292c31', '#101211', '#101211', '#412c26']}
            locations={[0, 0.05, 0.13, 0.4, 0.6, 0.9]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
            {...props}>
            <View style={props.childContainerStyle ? props.childContainerStyle : styles.childContainer}>
                {props.children}
            </View>
        </LinearGradient>
    );
};

export default HomeBackgroundGradient;

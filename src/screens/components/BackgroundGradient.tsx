import React from 'react';
import { ViewProps, View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { HeaderHeightContext } from '@react-navigation/stack';
import { useHeaderTabBarHeight, useHeaderTabBarLessHeight } from 'screens/components/HeaderTabBar';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { tvPixelSizeForLayout } from '../../../AppStyles';

export type HeaderType = 'Regular' | 'HeaderTab' | 'HeaderTabLess';

interface BackgroundGradientProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
    insetHeader?: boolean;
    headerType?: HeaderType;
    insetTabBar?: boolean;
    horizontal?: boolean;
    sideImageReveal?: boolean;
    transparent?: boolean;
}

const BackgroundGradient = (props: React.PropsWithChildren<BackgroundGradientProps>): JSX.Element => {
    const prefs = useAppPreferencesState();
    const headerHeight = React.useContext(HeaderHeightContext) || 0;
    const headerTabBarHeight = useHeaderTabBarHeight();
    const headerTabBarLessHeight = useHeaderTabBarLessHeight();
    const insetHeader = props.insetHeader === undefined ? true : props.insetHeader;
    const tabBarHeight = React.useContext(BottomTabBarHeightContext) || 0;

    let { appColors } = prefs.appTheme!(prefs);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginLeft: Platform.isTV && Platform.OS === 'android' ? tvPixelSizeForLayout(20) : undefined,
        },
        childContainer: {
            flex: 1,
            paddingTop:
                insetHeader === true
                    ? props.headerType === 'HeaderTab'
                        ? headerTabBarHeight
                        : props.headerType === 'HeaderTabLess'
                        ? headerTabBarLessHeight
                        : headerHeight
                    : undefined,
            paddingBottom: props.insetTabBar === true ? tabBarHeight : undefined,
        },
    });

    //start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
    const colors = props.sideImageReveal
        ? [appColors.primary, appColors.primary, 'rgba(12, 16, 33, 0.7)', 'rgba(12, 16, 33, 0)']
        : [appColors.primary, appColors.primaryEnd];
    const transparentColors = ['transparent', 'transparent'];

    return (
        <LinearGradient
            start={{ x: props.horizontal ? 0 : 1, y: props.horizontal ? 0 : 0 }}
            end={{ x: props.horizontal ? 1 : 1, y: props.horizontal ? 0 : 1 }}
            colors={props.transparent ? transparentColors : colors}
            style={styles.container}
            {...props}>
            <View style={props.childContainerStyle ? props.childContainerStyle : styles.childContainer}>
                {props.children}
            </View>
        </LinearGradient>
    );
};

export default BackgroundGradient;

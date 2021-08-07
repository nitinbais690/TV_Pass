import React from 'react';
import { ViewProps, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { HeaderHeightContext } from '@react-navigation/stack';
import { useHeaderTabBarHeight, useHeaderTabBarLessHeight } from 'screens/components/HeaderTabBar';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

export type HeaderType = 'Regular' | 'HeaderTab' | 'HeaderTabLess';

interface BackgroundGradientProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
    insetHeader?: boolean;
    headerType?: HeaderType;
    insetTabBar?: boolean;
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

    return (
        <LinearGradient colors={[appColors.primary, appColors.primaryEnd]} style={styles.container} {...props}>
            <View style={props.childContainerStyle ? props.childContainerStyle : styles.childContainer}>
                {props.children}
            </View>
        </LinearGradient>
    );
};

export default BackgroundGradient;

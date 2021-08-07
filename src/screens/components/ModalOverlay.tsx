import React from 'react';
import { StyleSheet, View, ViewStyle, Animated, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { EdgeInsets, useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { HeaderContextProvider } from 'contexts/HeaderContextProvider';
import Header from './Header';
import BackgroundGradient from './BackgroundGradient';
import { tvPixelSizeForLayout } from '../../../AppStyles';

export const ModalOverlay = ({
    headerTitle,
    hideHeader,
    headerTransparent,
    narrow,
    children,
    animatedStyle,
    hideBackgroundGradient,
    isHideCrossIcon,
    isCollapsable,
    scrollY,
}: React.PropsWithChildren<{
    headerTitle?: string | (() => React.ReactNode);
    hideHeader?: boolean;
    headerTransparent?: boolean;
    narrow?: boolean;
    animatedStyle?: Animated.AnimatedProps<ViewStyle>;
    hideBackgroundGradient?: boolean;
    isHideCrossIcon?: boolean;
    isCollapsable?: boolean;
    scrollY?: Animated.AnimatedValue;
}>): JSX.Element => {
    const insets = useSafeArea();
    const { width: w, height: h } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appDimensions } = appTheme!(prefs);
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    const isPortrait = h > w;

    const styles = StyleSheet.create({
        containerStyle: {
            flex: 1,
            backgroundColor: appColors.primary,
            ...(narrow && {
                width: isPortrait ? '80%' : '60%',
                alignSelf: 'center',
            }),
            ...(!narrow && {
                marginHorizontal: selectDeviceType({ Tablet: isPortrait ? 40 : '15%' }, '0%'),
                marginVertical: selectDeviceType({ Tablet: 40 }, 0),
            }),
            marginVertical: selectDeviceType({ Handset: 0, Tablet: isPortrait ? (narrow ? 140 : 40) : 40 }, 0),
            borderRadius: selectDeviceType({ Tablet: appDimensions.cardRadius }, 0),
            paddingTop: 0,
            shadowOffset: { width: 2, height: 2 },
            shadowColor: '#000',
            shadowOpacity: 0.7,
            shadowRadius: 30,
            elevation: 0,
            overflow: 'hidden',
        },
        headerContainer: {
            position: 'absolute',
            top: 0,
            zIndex: 100,
            height: Platform.isTV ? tvPixelSizeForLayout(140) : 66 + (isHandset ? insets.top : 0),
            width: '100%',
        },
    });

    const ViewComponent = hideBackgroundGradient ? View : BackgroundGradient;
    return (
        <HeaderContextProvider>
            <ViewComponent style={styles.containerStyle}>
                {children}
                <View style={styles.headerContainer}>
                    {!hideHeader && (
                        <Header
                            animatedStyle={animatedStyle}
                            headerTransparent={headerTransparent}
                            headerTitle={headerTitle}
                            isHideCrossIcon={isHideCrossIcon}
                            isCollapsable={isCollapsable}
                            scrollY={scrollY}
                        />
                    )}
                </View>
            </ViewComponent>
        </HeaderContextProvider>
    );
};

export default React.memo(ModalOverlay);

export const modalHeaderHeight = (insets: EdgeInsets) => {
    let type = DeviceInfo.getDeviceType();
    const isHandset = type === 'Handset';
    return 66 + (isHandset ? insets.top : 0);
};

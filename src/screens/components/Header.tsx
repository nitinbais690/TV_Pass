import React, { useEffect } from 'react';
import { View, StyleSheet, Text, LayoutAnimation, Animated, ViewStyle } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { CastButton } from 'react-native-google-cast';
import { useAppState } from 'utils/AppContextProvider';
import { useAppPreview } from 'contexts/AppPreviewContextProvider';
// import { useHeader } from 'contexts/HeaderContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useCastContext } from 'utils/CastContextProvider';
import { CreditsButton } from '../components/CreditsButton';
import HeaderGradient from 'screens/components/HeaderGradient';
import CloseIcon from '../../../assets/images/close.svg';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { appFonts } from '../../../AppStyles';

const Header = ({
    headerTransparent,
    headerTitle,
    animatedStyle,
    isCollapsable,
    scrollY,
}: {
    headerTransparent?: boolean;
    headerTitle?: string | (() => React.ReactNode);
    animatedStyle?: Animated.AnimatedProps<ViewStyle>;
    isCollapsable?: boolean;
    scrollY?: Animated.AnimatedValue;
}) => {
    const insets = useSafeArea();
    const { toggleModal } = useAppPreview();
    const { appNavigationState } = useAppState();
    const { isCastSessionActive } = useCastContext();
    const navigation = useNavigation();
    // const { headerInset } = useHeader();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: headerTransparent ? 'transparent' : appColors.primary, //'transparent', //'rgba(256, 0, 0, 0.1)', //headerTransparent ? 'transparent' : appColors.primary,
            paddingTop: isHandset ? insets.top : 0,
        },
        headerLeftContainerStyle: {
            left: 0,
            alignItems: 'flex-start',
            paddingVertical: 13,
            flex: 1.2,
            zIndex: 2,
        },
        headerTitleContainerStyle: {
            // flexGrow: typeof headerTitle === 'string' ? 0 : 3,
            flexGrow: 3,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerRightContainerStyle: {
            justifyContent: 'flex-end',
            right: 0,
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            zIndex: 2,
        },
        titleStyle: {
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 15,
        },
        castIcon: { width: 24, height: 24, tintColor: appColors.brandTint },
        doneButton: { marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
    });
    useEffect(() => {
        return () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        };
    }, [headerTransparent]);

    const collapsingHeaderAnimationStyle = scrollY && {
        transform: [
            {
                translateY: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [70, 0],
                    extrapolate: 'clamp',
                }),
            },
            {
                scale: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [2, 0.8],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <HeaderGradient style={{ ...StyleSheet.absoluteFillObject }} />
            <Animated.View style={[styles.headerLeftContainerStyle, animatedStyle]}>
                <CreditsButton
                    onPress={() => {
                        if (appNavigationState !== 'PREVIEW_APP') {
                            navigation.navigate(NAVIGATION_TYPE.CREDITS);
                        } else {
                            toggleModal();
                        }
                    }}
                />
            </Animated.View>
            {!isCollapsable && !scrollY ? (
                <View style={styles.headerTitleContainerStyle}>
                    {headerTitle &&
                        (typeof headerTitle === 'string' ? (
                            <Text numberOfLines={1} style={styles.titleStyle}>
                                {headerTitle}
                            </Text>
                        ) : (
                            <View style={styles.headerTitleContainerStyle}>{headerTitle()}</View>
                        ))}
                </View>
            ) : (
                <>
                    {headerTitle && (
                        <Animated.View style={[styles.headerTitleContainerStyle, collapsingHeaderAnimationStyle]}>
                            {headerTitle &&
                                (typeof headerTitle === 'string' ? (
                                    <Text numberOfLines={1} style={styles.titleStyle}>
                                        {headerTitle}
                                    </Text>
                                ) : (
                                    <View style={styles.headerTitleContainerStyle}>{headerTitle()}</View>
                                ))}
                        </Animated.View>
                    )}
                </>
            )}
            <View style={styles.headerRightContainerStyle}>
                {isCastSessionActive && <CastButton style={styles.castIcon} />}
                <BorderlessButton onPress={() => navigation.goBack()} style={styles.doneButton}>
                    <CloseIcon accessible accessibilityLabel={'Close'} />
                </BorderlessButton>
            </View>
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.headerTransparent === nextProps.headerTransparent && prevProps.headerTitle === nextProps.headerTitle
    );
};

export default React.memo(Header, propsAreEqual);

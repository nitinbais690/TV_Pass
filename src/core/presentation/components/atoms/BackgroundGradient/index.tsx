import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { HeaderHeightContext } from '@react-navigation/stack';
import { useHeaderTabBarHeight } from 'core/presentation/components/molecules/HeaderTabBar';
import LinearGradient from 'react-native-linear-gradient';
import AHAGreyLogo from 'assets/images/aha_grey_logo.svg';

import { SvgCss } from 'react-native-svg';
import { BackgroundGradientProps } from 'core/data/models/BackgroundGradientProps';
import { xml } from './xml/BackgroundGradientXml';
import { scale } from 'qp-common-ui';

const BackgroundGradient = (props: React.PropsWithChildren<BackgroundGradientProps>): JSX.Element => {
    const headerHeight = React.useContext(HeaderHeightContext) || 0;
    const headerTabBarHeight = useHeaderTabBarHeight();
    const insetHeader = props.insetHeader === undefined ? true : props.insetHeader;
    const tabBarHeight = React.useContext(BottomTabBarHeightContext) || 0;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        gradientViewStyle: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        childContainer: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop:
                insetHeader === true
                    ? props.headerType === 'HeaderTab'
                        ? headerTabBarHeight
                        : headerHeight
                    : undefined,
            paddingBottom: props.insetTabBar === true ? tabBarHeight : undefined,
        },
        greyLogoStyle: {
            width: scale(42),
        },
        greyLogoPosition: {
            position: 'absolute',
            right: 50,
            top: 12,
        },
    });

    const gradientVariantColorsTV = {
        primaryVariant1: '#532C1E',
        primaryVariant2: '#24272B',
        primaryVariant3: '#101211',
        primaryVariant4: '#3C2924',
    };

    return (
        <View style={styles.container} {...props}>
            {!Platform.isTV && (
                <SvgCss xml={xml} width={styles.gradientViewStyle.width} height={styles.gradientViewStyle.height} />
            )}
            {!Platform.isTV && <View style={[styles.childContainer, props.childContainerStyle]}>{props.children}</View>}
            {Platform.isTV && (
                <LinearGradient
                    style={styles.gradientViewStyle}
                    colors={[
                        gradientVariantColorsTV.primaryVariant1,
                        gradientVariantColorsTV.primaryVariant2,
                        gradientVariantColorsTV.primaryVariant3,
                        gradientVariantColorsTV.primaryVariant4,
                    ]}
                    locations={[0, 0.035, 0.53, 1]}
                    useAngle={true}
                    angle={140}>
                    <AHAGreyLogo width={styles.greyLogoStyle.width} style={styles.greyLogoPosition} />
                    <View style={[styles.childContainer, props.childContainerStyle]}>{props.children}</View>
                </LinearGradient>
            )}
        </View>
    );
};

export default BackgroundGradient;

import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { AspectRatio, AspectRatioUtil } from 'qp-common-ui';
import { useHeaderTabBarHeight } from 'screens/components/HeaderTabBar';
import SkeletonCatalogContainer from './SkeletonCatalogContainer';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useDimensions } from '@react-native-community/hooks';

export type SkeletonCatalogType = 'Strorefront' | 'MyContent';

const SkeletonCatalog = ({ type }: { type?: SkeletonCatalogType }) => {
    const headerTabBarHeight = useHeaderTabBarHeight();
    const { appConfig } = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    const enterAnimValue = useRef(new Animated.Value(0)).current;
    let bannerAspectRatio = AspectRatio._16by9;
    const aspectRatioOverrideKey = `sf.aspectratio_banner_${DeviceInfo.getDeviceType().toLowerCase()}_${
        isPortrait ? 'portrait' : 'landscape'
    }`;
    const arOverride = appConfig && appConfig[aspectRatioOverrideKey];
    if (arOverride) {
        bannerAspectRatio = AspectRatioUtil.fromString(arOverride);
    }

    useEffect(() => {
        Animated.timing(enterAnimValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const opacityStyle = type !== 'MyContent' ? enterAnimValue : 1;
    const transformStyle =
        type !== 'MyContent'
            ? enterAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0], // 0 : 150, 0.5 : 75, 1 : 0
              })
            : 0;

    return (
        <Animated.View
            style={{
                paddingTop: headerTabBarHeight,
                opacity: opacityStyle,
                transform: [
                    {
                        translateY: transformStyle,
                    },
                ],
            }}>
            {type === 'MyContent' ? (
                <>
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        footerLabelsCount={3}
                        count={3}
                        size={'regular'}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                        size={'regular'}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                    />
                </>
            ) : (
                <>
                    <SkeletonCatalogContainer
                        aspectRatio={bannerAspectRatio}
                        showFooter={false}
                        count={2}
                        layout={'banner'}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._1by1}
                        showFooter={false}
                        showContainerLabel
                        count={8}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                    />
                </>
            )}
        </Animated.View>
    );
};

export default React.memo(SkeletonCatalog);

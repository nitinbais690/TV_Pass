import React from 'react';
import { View, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { AspectRatio, AspectRatioUtil } from 'qp-common-ui';
import SkeletonCatalogContainer from './SkeletonCatalogContainer';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useDimensions } from '@react-native-community/hooks';
import { useHeaderTabBarHeight } from 'core/presentation/components/molecules/HeaderTabBar';

export type SkeletonCatalogType = 'Strorefront' | 'MyContent';

const SkeletonCatalog = ({ type }: { type?: SkeletonCatalogType }) => {
    const headerTabBarHeight = useHeaderTabBarHeight();
    const { appConfig } = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;
    let bannerAspectRatio = AspectRatio._16by9;
    const aspectRatioOverrideKey = Platform.isTV
        ? `sf.aspectratio_banner_${DeviceInfo.getDeviceType().toLowerCase()}`
        : `sf.aspectratio_banner_${DeviceInfo.getDeviceType().toLowerCase()}_${isPortrait ? 'portrait' : 'landscape'}`;
    const arOverride = appConfig && appConfig[aspectRatioOverrideKey];
    if (arOverride) {
        bannerAspectRatio = AspectRatioUtil.fromString(arOverride);
    }

    return (
        <View style={{ paddingTop: Platform.isTV ? 0 : headerTabBarHeight }}>
            {type === 'MyContent' ? (
                <>
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        footerLabelsCount={3}
                        count={3}
                        size={'large'}
                    />
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={3}
                        size={'large'}
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
        </View>
    );
};

export default React.memo(SkeletonCatalog);

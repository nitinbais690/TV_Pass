import React, { useEffect, useRef, useState } from 'react';
import { TVMenuControl } from 'react-native';
import { useFetchCollectionQuery } from 'qp-discovery-ui';
import StorefrontCatalog from './components/StorefrontCatalog';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import ModalOverlay from './components/ModalOverlay';
import CollectionHeaderLogo, { imageAspectRatio } from 'screens/components/CollectionHeaderLogo';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';
import { Animated, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImageGradient from './components/BackgroundImageGradient';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useHeaderTabBarHeight } from 'screens/components/HeaderTabBar';

const CollectionsDetailsScreen = ({ route }: { route: any }): JSX.Element => {
    const { resource, title, isCardCustomSpacing } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { recordErrorEvent } = useAnalytics();
    const { loading, error, errorObject, containers, reload, hasMore, loadMore, pageOffset } = useFetchCollectionQuery(
        resource.id,
        title,
        5,
        isInternetReachable,
    );

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.COLLECTION_FETCH_ERROR, condenseErrorObject(errorObject));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    useEffect(() => {
        TVMenuControl.enableTVMenuKey();
        return () => {
            TVMenuControl.disableTVMenuKey();
        };
    }, []);

    const headerTitle = React.useCallback(() => <CollectionHeaderLogo id={resource.id} />, [resource]);
    const hasHeaderLogo = resource.ia && resource.ia.includes(imageAspectRatio);
    const scrollY = useRef(new Animated.Value(0)).current;
    const imageUrl = require('../../assets/images/sampleCollectionBg.jpeg'); // for temporary used static image
    const [opacityVal, setOpacityVal] = useState(0);
    const headerHeight = useHeaderTabBarHeight();
    const tabBarHeight = React.useContext(BottomTabBarHeightContext) || 0;

    const gradientContainerStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            }),
        [],
    );

    const wrapperContainerStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingTop: headerHeight + 170,
                    paddingBottom: tabBarHeight + 15,
                    marginLeft: 0,
                },
            }),
        [headerHeight, tabBarHeight],
    );
    return (
        <>
            {!Platform.isTV ? (
                <ModalOverlay headerTitle={hasHeaderLogo ? headerTitle : resource.name}>
                    <StorefrontCatalog {...{ loading, error, containers, reload, hasMore, loadMore, pageOffset }} />
                </ModalOverlay>
            ) : (
                <ModalOverlay
                    scrollY={scrollY}
                    isCollapsable={true}
                    headerTransparent={true}
                    isHideCrossIcon={true}
                    headerTitle={hasHeaderLogo ? headerTitle : resource.name}>
                    {imageUrl ? (
                        <BackgroundImageGradient source={imageUrl} />
                    ) : (
                        <>
                            <LinearGradient
                                colors={['transparent', 'rgba(104, 110, 255, 0.7)']}
                                useAngle={true}
                                angle={40}
                                style={[gradientContainerStyle.container]}
                            />
                            <LinearGradient
                                colors={['rgba(12, 16, 33, 1)', 'transparent']}
                                useAngle={true}
                                angle={360}
                                locations={[0.2, 0.7]}
                                style={[gradientContainerStyle.container]}
                            />
                        </>
                    )}

                    <StorefrontCatalog
                        {...{ loading, error, containers, reload, hasMore, loadMore, pageOffset, scrollY }}
                        containerStyle={wrapperContainerStyle.container}
                        blockFocusUpListReachedEnd={Platform.isTV}
                        blockFocusDownListReachedEnd={Platform.isTV}
                        blockFocusLeftListReachedEnd={Platform.isTV}
                        blockFocusRightListReachedEnd={Platform.isTV}
                        hasTVPreferredFocus={Platform.isTV}
                        isCardCustomSpacing={isCardCustomSpacing}
                        onTvScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            y: scrollY,
                                        },
                                    },
                                },
                            ],
                            {
                                useNativeDriver: true,
                                listener: (event: any) => {
                                    if (event.nativeEvent.contentOffset.y <= 200) {
                                        setOpacityVal((event.nativeEvent.contentOffset.y * 1) / 150);
                                    }
                                },
                            },
                        )}
                    />

                    <LinearGradient
                        colors={['rgba(12, 16, 33, 1)', 'transparent']}
                        useAngle={true}
                        angle={180}
                        locations={[0.12, 0.3]}
                        style={[
                            gradientContainerStyle.container,
                            {
                                opacity: opacityVal,
                            },
                        ]}
                    />
                </ModalOverlay>
            )}
        </>
    );
};

export default CollectionsDetailsScreen;

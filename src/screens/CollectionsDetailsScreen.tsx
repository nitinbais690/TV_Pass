import React, { useEffect, useRef } from 'react';
import { useFetchCollectionQuery } from 'qp-discovery-ui';
import StorefrontCatalog from './components/StorefrontCatalog';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import ModalOverlay from './components/ModalOverlay';
import CollectionHeaderLogo from 'screens/components/CollectionHeaderLogo';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { condenseErrorObject, ErrorEvents, AppEvents, getContentDetailsAttributes } from 'utils/ReportingUtils';
import { Animated, View } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const CollectionsDetailsScreen = ({ route }: { route: any }): JSX.Element => {
    const { resource, title } = route.params;
    const { isInternetReachable } = useNetworkStatus();
    const { recordErrorEvent } = useAnalytics();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appPadding } = appTheme!(prefs);
    const { recordEvent } = useAnalytics();

    const { loading, error, errorObject, containers, reload, hasMore, loadMore, pageOffset } = useFetchCollectionQuery(
        resource.id,
        title,
        5,
        isInternetReachable,
    );

    useEffect(() => {
        recordEvent(AppEvents.VIEW_COLLECTION_DETAILS, getContentDetailsAttributes(resource), true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.COLLECTION_FETCH_ERROR, condenseErrorObject(errorObject));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const headerTitle = React.useCallback(() => <CollectionHeaderLogo id={resource.id} />, [resource]);
    // const hasHeaderLogo = resource.ia && resource.ia.includes(imageAspectRatio);
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <ModalOverlay scrollY={scrollY} isCollapsable={true} headerTransparent={true} headerTitle={headerTitle}>
            <View style={{ paddingVertical: appPadding.md() }} />
            <StorefrontCatalog
                {...{
                    loading,
                    error,
                    containers,
                    reload,
                    hasMore,
                    loadMore,
                    pageOffset,
                    scrollY,
                }}
                cardType="collections"
            />
        </ModalOverlay>
    );
};

export default CollectionsDetailsScreen;

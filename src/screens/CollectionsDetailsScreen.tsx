import React, { useEffect } from 'react';
import { useFetchCollectionQuery } from 'qp-discovery-ui';
import StorefrontCatalog from './components/StorefrontCatalog';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import ModalOverlay from './components/ModalOverlay';
import CollectionHeaderLogo, { imageAspectRatio } from 'screens/components/CollectionHeaderLogo';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';

const CollectionsDetailsScreen = ({ route }: { route: any }): JSX.Element => {
    const { resource, title } = route.params;
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

    const headerTitle = React.useCallback(() => <CollectionHeaderLogo id={resource.id} />, [resource]);
    const hasHeaderLogo = resource.ia && resource.ia.includes(imageAspectRatio);

    return (
        <ModalOverlay headerTitle={hasHeaderLogo ? headerTitle : resource.name}>
            <StorefrontCatalog {...{ loading, error, containers, reload, hasMore, loadMore, pageOffset }} />
        </ModalOverlay>
    );
};

export default CollectionsDetailsScreen;

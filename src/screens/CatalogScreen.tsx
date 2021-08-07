import React, { useEffect } from 'react';
import { useFetchContainerQuery } from 'qp-discovery-ui';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import StorefrontCatalog from './components/StorefrontCatalog';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';
import { TimerType, useTimer } from 'utils/TimerContext';

const CatalogScreen = ({
    storefrontId,
    tabId,
    tabName,
}: {
    storefrontId: string;
    tabId: string;
    tabName: string;
}): JSX.Element => {
    const { isInternetReachable } = useNetworkStatus();
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const { stopTimer } = useTimer();

    // Fetch Sub-Containers
    const {
        loading,
        error,
        errorObject,
        containers,
        reset,
        reload,
        hasMore,
        loadMore,
        pageOffset,
    } = useFetchContainerQuery(storefrontId, tabId, tabName, 3, isInternetReachable);

    useEffect(() => {
        if ((containers.length > 0 && loading === false) || error === true) {
            stopTimer(TimerType.Storefront);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.CONTAINER_FETCH_ERROR, condenseErrorObject(errorObject));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    useEffect(() => {
        recordEvent(AppEvents.STOREFRONT_TAB_CHANGE, {
            storefrontId: storefrontId,
            tabId: tabId,
            tabName: tabName,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabName]);

    return <StorefrontCatalog {...{ loading, error, containers, reset, reload, hasMore, loadMore, pageOffset }} />;
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.tabId === nextProps.tabId && prevProps.storefrontId === nextProps.storefrontId;
};

export default React.memo(CatalogScreen, propsAreEqual);

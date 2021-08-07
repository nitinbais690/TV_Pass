import React, { useEffect } from 'react';
import { useFetchContainerQuery } from 'qp-discovery-ui';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import StorefrontCatalog from './components/StorefrontCatalog';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { condenseErrorObject, ErrorEvents } from 'utils/ReportingUtils';
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
    const { recordErrorEvent } = useAnalytics();
    const { stopTimer } = useTimer();
    const { appConfig } = useAppPreferencesState();
    const pageSize = (appConfig && appConfig.storefrontPageSize) || 25;
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
    } = useFetchContainerQuery(storefrontId, tabId, tabName, pageSize, isInternetReachable);

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

    return <StorefrontCatalog {...{ loading, error, containers, reset, reload, hasMore, loadMore, pageOffset }} />;
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.tabId === nextProps.tabId;
};

export default React.memo(CatalogScreen, propsAreEqual);

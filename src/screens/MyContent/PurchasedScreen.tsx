import React from 'react';
import { useLocalization } from 'contexts/LocalizationContext';
import StorefrontCatalog from 'screens/components/StorefrontCatalog';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useFetchRedeemed } from 'screens/hooks/useFetchRedeemed';
import EmptyStateView from './EmptyStateView';

const PurchasedScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const { loading, error, containers, reset, reload, loadMoreResources } = useFetchRedeemed();
    
    return (
        <>
            {!loading && !error && containers.length === 0 ? (
                <BackgroundGradient insetHeader headerType={'HeaderTab'}>
                    <EmptyStateView message={strings['my_content.empty']} />
                </BackgroundGradient>
            ) : (
                <StorefrontCatalog
                    loadingType={'MyContent'}
                    contentTabName={'Redeemed'}
                    containers={containers}
                    loading={loading}
                    error={error}
                    pageOffset={0}
                    reset={reset}
                    reload={reload}
                    loadMoreResources={loadMoreResources}
                />
            )}
        </>
    );
};

export default PurchasedScreen;

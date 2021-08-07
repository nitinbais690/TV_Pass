import React from 'react';
import { Platform } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import StorefrontCatalog from 'screens/components/StorefrontCatalog';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { useFetchRedeemed } from 'screens/hooks/useFetchRedeemed';
import EmptyStateView from './EmptyStateView';

const PurchasedScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const { loading, error, containers, reset, reload, loadMoreResources } = useFetchRedeemed();

    return (
        <>
            {!loading && !error && containers.length === 0 ? (
                <BackgroundGradient insetHeader={!Platform.isTV} headerType={'HeaderTab'}>
                    <EmptyStateView
                        message={strings['my_content.empty']}
                        secondaryMessage={strings['my_content.browse_cta']}
                    />
                </BackgroundGradient>
            ) : (
                <StorefrontCatalog
                    loadingType={'MyContent'}
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

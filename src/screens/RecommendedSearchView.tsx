import React from 'react';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { selectDeviceType } from 'qp-common-ui';
import { ContainerVm, useFetchRecommendedSearchQuery } from 'qp-discovery-ui';
import { View, StyleSheet, Text, FlatList, TouchableHighlight, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, appPadding } from '../../AppStyles';
import AppErrorComponent from 'utils/AppErrorComponent';
import AppLoadingIndicator from './components/AppLoadingIndicator';

export const RecommendedSearchView = ({
    onRecommendedItemSelect,
}: {
    onRecommendedItemSelect: (container: ContainerVm) => void;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;

    let { appColors } = appTheme && appTheme(prefs);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: appPadding.xs(true),
                },
                rowContainer: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 20),
                    paddingTop: 20,
                },
                itemText: {
                    color: appColors.brandTint,
                    fontSize: appFonts.xlg,
                    fontFamily: appFonts.primary,
                },
            }),
        [appColors.brandTint],
    );

    const { isInternetReachable } = useNetworkStatus();
    const storefrontId = appConfig && appConfig.recommendSearchStorefrontId;
    const tabId = appConfig && appConfig.recommendSearchStorefrontTabId;

    // Fetch Sub-Containers
    const { loading, error, containers, reload, hasMore, loadMore, pageOffset } = useFetchRecommendedSearchQuery(
        storefrontId,
        tabId,
        5,
        isInternetReachable,
    );

    const renderItem = (container: ContainerVm, index: number) => {
        return (
            <TouchableHighlight
                key={index}
                activeOpacity={1}
                underlayColor={appColors.primaryVariant2}
                style={[styles.rowContainer]}
                onPress={() => {
                    onRecommendedItemSelect(container);
                }}>
                <Text style={styles.itemText}>{container.name}</Text>
            </TouchableHighlight>
        );
    };

    const keyExtractor = (item: ContainerVm) => String(item.id);

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);

    const refreshControl = React.useMemo(
        () => (
            <RefreshControl
                refreshing={(loading && containers && containers.length > 0) || false}
                onRefresh={reload}
                tintColor={appColors.tertiary}
                titleColor={appColors.tertiary}
                progressBackgroundColor={appColors.backgroundInactive}
                colors={[appColors.tertiary]}
                // title={'Pull to refresh'}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appColors.tertiary, appColors.backgroundInactive],
    );

    const onEndReached = React.useCallback(() => {
        if (hasMore && loadMore) {
            loadMore(pageOffset);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, pageOffset]);

    return (
        <View style={styles.container}>
            {/* Loading State */}
            {loading && <AppLoadingIndicator />}

            {/* Error State */}
            {!loading && error && <AppErrorComponent />}

            <FlatList
                data={containers}
                renderItem={({ item, index }) => renderItem(item, index)}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                onEndReached={onEndReached}
                refreshControl={refreshControl}
                onEndReachedThreshold={0.8}
                ListFooterComponent={hasMore ? LoadingComponent : undefined}
            />
        </View>
    );
};

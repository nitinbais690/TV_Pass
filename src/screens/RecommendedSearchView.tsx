import React, { useState } from 'react';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { selectDeviceType } from 'qp-common-ui';
import { ContainerVm, useFetchRecommendedSearchQuery } from 'qp-discovery-ui';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, appPadding } from '../../AppStyles';
import AppErrorComponent from 'utils/AppErrorComponent';
import AppLoadingIndicator from './components/AppLoadingIndicator';

export const RecommendedSearchView = ({
    searchWord,
    onRecommendedItemSelect,
}: {
    searchWord: string;
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
                    marginTop: Platform.isTV ? 0 : appPadding.xs(true),
                },
                rowContainer: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 20),
                    paddingTop: 20,
                },
                rowContainerTV: {
                    flexDirection: 'row',
                    padding: 20,
                    paddingBottom: selectDeviceType({ Handset: 12 }, 20),
                    height: 64,
                    margin: 50,
                    marginTop: 10,
                    paddingTop: 20,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 32,
                },
                listStyle: {
                    flex: 1,
                    maxHeight: 100,
                    width: '94%',
                    alignSelf: 'center',
                },
                listContentStyle: {
                    marginTop: -160,
                    height: 100,
                    width: '100%',
                },
                itemText: {
                    color: Platform.isTV ? appColors.tertiary : appColors.brandTint,
                    fontSize: appFonts.xlg,
                    fontFamily: appFonts.primary,
                    height: 30,
                },
            }),
        [appColors.brandTint, appColors.tertiary],
    );

    const { isInternetReachable } = useNetworkStatus();
    const storefrontId = appConfig && appConfig.recommendSearchStorefrontId;
    const tabId = appConfig && appConfig.recommendSearchStorefrontTabId;
    const [indexFocused, setIndexFocused] = useState<number>(0);

    // Fetch Sub-Containers
    const { loading, error, containers, reload, hasMore, loadMore, pageOffset } = useFetchRecommendedSearchQuery(
        storefrontId,
        tabId,
        5,
        isInternetReachable,
    );

    const onCardFocus = (index: number): void => {
        setIndexFocused(index);
    };
    const onCardBlur = (): void => {};

    const renderItem = (container: ContainerVm, index: number) => {
        var matchColorText = appColors.brandTint;
        if (Platform.isTV) {
            matchColorText = indexFocused == index ? 'white' : appColors.tertiary;
        }
        if (index == 0 && searchWord == '') {
            onRecommendedItemSelect(container);
        }

        return (
            <TouchableHighlight
                key={index}
                activeOpacity={1}
                onFocus={
                    Platform.isTV
                        ? () => {
                              onCardFocus(index);
                          }
                        : undefined
                }
                onBlur={Platform.isTV ? onCardBlur : undefined}
                underlayColor={appColors.primaryVariant2}
                style={
                    Platform.isTV
                        ? [
                              styles.rowContainerTV,
                              { backgroundColor: indexFocused == index ? appColors.primaryVariant2 : 'transparent' },
                          ]
                        : [styles.rowContainer]
                }
                onPress={() => {
                    onRecommendedItemSelect(container);
                }}>
                <Text style={[styles.itemText, { color: matchColorText }]}>{container.name}</Text>
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
                style={Platform.isTV ? styles.listStyle : undefined}
                contentContainerStyle={Platform.isTV ? styles.listContentStyle : undefined}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                horizontal={Platform.isTV}
                onEndReached={onEndReached}
                refreshControl={refreshControl}
                onEndReachedThreshold={0.8}
                ListFooterComponent={hasMore ? LoadingComponent : undefined}
            />
        </View>
    );
};

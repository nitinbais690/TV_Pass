import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, LogBox } from 'react-native';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { SearchBox } from 'core/presentation/components/atoms/SearchBox';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useSafeArea } from 'react-native-safe-area-context';
import { searchResultsTemplateStyles } from './style';
import BackArrow from 'assets/images/back_arrow.svg';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AppEvents, condenseErrorObject, condenseSearchData, ErrorEvents } from 'utils/ReportingUtils';
import { ResourceVm, useDebounce, useDiscoverySearch } from 'qp-discovery-ui';
import ResourceListView from '../../organisms/SearchOrganism';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import AppErrorComponent from 'utils/AppErrorComponent';
import DetailPopup from 'features/details/presentation/components/template/DetailPopupScreen';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAddSearchHistory } from 'features/search/presentation/hooks/useAddSearchHistory';
import { useAuth } from 'contexts/AuthContextProvider';
import { useEntitlements } from 'contexts/EntitlementsContextProvider';
import { useGetSearchHistoryList } from 'features/search/presentation/hooks/useGetSearchHistoryList';
import { GetSearchHistoryListItem } from 'features/search/domain/entities/get-search-history-list-response';
import { useFocusEffect } from '@react-navigation/native';

export enum SearchMode {
    Recommended = 'recommended',
    Default = 'default',
}
const SearchResultsTemplate = (props: SearchResultsTemplateProps): JSX.Element => {
    const insets = useSafeArea();
    const isMounted = useRef(true);
    const { strings }: any = useLocalization();
    const styles = searchResultsTemplateStyles(useAppColors(), insets);
    const [searchTerm, setSearchTerm] = useState('');
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const [detailModelResource, setDetailModelResource] = useState({});
    const { flAuthToken } = useAuth();
    const { xAuthToken } = useEntitlements();
    const [recentSearchList, setRecentSearchList] = useState<GetSearchHistoryListItem[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 2000);

    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const storefrontId = appConfig && appConfig.recommendSearchStorefrontId;
    const tabId = appConfig && appConfig.recommendSearchStorefrontTabId;
    const noSearchResultsURL = appConfig && appConfig.noSearchResultsURL;
    const { addSearchHistoryCall } = useAddSearchHistory();
    const { getSearchHistoryListCall } = useGetSearchHistoryList();

    const [searchMode, setSearchMode] = useState(SearchMode.Recommended);
    const [recommendedSearchWord, setRecommendedSearchWord] = useState('');
    const pageSize = 12;

    const {
        resources,
        noSearchResources,
        error,
        errorObject,
        hasMore,
        loading,
        loadMore,
        isSearchNotFound,
    } = useDiscoverySearch(searchMode, '', noSearchResultsURL, searchTerm, 300, pageSize);

    useFocusEffect(
        React.useCallback(() => {
            isMounted.current = true;
            return () => {
                // Resetting the Search Screen values

                isMounted.current = false;
                setSearchTerm('');
                setRecommendedSearchWord('');
                setSearchMode(SearchMode.Recommended);
                setRecentSearchList([]);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []),
    );

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.SEARCH_FAILURE, condenseErrorObject(errorObject));
        }
    }, [error, errorObject, recordErrorEvent]);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, []);

    const getSearchHistoryList = useCallback(async () => {
        if (flAuthToken && xAuthToken) {
            const response = await getSearchHistoryListCall(flAuthToken, xAuthToken);
            setRecentSearchList([...response.searchHistoryList]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flAuthToken, xAuthToken]);

    useEffect(() => {
        getSearchHistoryList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted.current]);

    const createSearchHistory = useCallback(
        async (searchText: string) => {
            if (flAuthToken && xAuthToken) {
                await addSearchHistoryCall(searchText, flAuthToken, xAuthToken);
            }
        },
        [addSearchHistoryCall, flAuthToken, xAuthToken],
    );

    useEffect(() => {
        if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
            createSearchHistory(debouncedSearchTerm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm]);

    const onEndReached = React.useCallback(() => {
        if (hasMore && loadMore) {
            loadMore();
        }
    }, [hasMore, loadMore]);

    const onHandlePress = React.useCallback(
        (resource: ResourceVm, position: number) => {
            recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length, position + 1));
            resource.storeFrontId = storefrontId;
            resource.tabId = tabId;
            setDetailModelResource({
                resource: resource,
                title: resource.name,
                resourceId: resource.id,
                resourceType: resource.type,
                searchPosition: position + 1,
            });
        },
        [recordEvent, resources.length, searchTerm, storefrontId, tabId],
    );

    const onModelClosed = () => {
        setDetailModelResource({});
    };

    useEffect(() => {
        recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length));
    }, [recordEvent, resources.length, searchTerm]);

    const handleOnChangeText = (value: string) => {
        setSearchTerm(value);
        setRecommendedSearchWord(value);
        if (value.length > 2) {
            setSearchMode(SearchMode.Default);
        } else {
            setSearchMode(SearchMode.Recommended);
        }
    };

    const goBack = () => {
        props.navigation.goBack();
    };

    const recentSearchListSection = () => {
        return (
            <>
                {recentSearchList && recentSearchList.length > 0 && (
                    <View style={styles.recentSearchConatiner}>
                        <Text style={styles.titleHeader}>{strings['search.recent_searches']}</Text>
                        {recentSearchList.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    if (item.text === searchTerm) {
                                        return;
                                    }
                                    setSearchTerm(item.text);
                                    setRecommendedSearchWord(item.text);
                                    if (item.text.length > 2) {
                                        setSearchMode(SearchMode.Default);
                                    } else {
                                        setSearchMode(SearchMode.Recommended);
                                    }
                                }}>
                                <Text style={styles.recentSearchText}>{item.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </>
        );
    };

    const searchHomeHeader = () => {
        return (
            <View style={styles.searchHeaderSection}>
                {recentSearchListSection()}
                <Text style={styles.titleHeader}>{strings['search.popular.title']}</Text>
            </View>
        );
    };

    const searchErrorHeader = () => {
        return (
            <View style={styles.searchHeaderSection}>
                {recentSearchListSection()}
                <Text style={styles.titleHeader}>{strings['search.popular.title']}</Text>
            </View>
        );
    };

    const resourceList = (list: ResourceVm[]) => {
        return (
            <ResourceListView
                resources={list}
                onPress={onHandlePress}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.7}
                hasMore={hasMore}
            />
        );
    };

    const searchList = () => {
        if (searchTerm.length > 2 && resources && resources.length > 0) {
            return <>{resourceList(resources)}</>;
        } else if ((searchTerm === '' || searchTerm.length < 3) && noSearchResources.length > 0) {
            return (
                <ScrollView horizontal={false}>
                    {searchHomeHeader()}
                    {resourceList(noSearchResources)}
                </ScrollView>
            );
        } else if (
            searchTerm.length > 2 &&
            resources.length === 0 &&
            isSearchNotFound &&
            noSearchResources.length > 0
        ) {
            return (
                <>
                    <Text style={styles.searhNotFound}>{strings['search.not_found']}</Text>
                    <ScrollView horizontal={false}>
                        {searchErrorHeader()}
                        {resourceList(noSearchResources)}
                    </ScrollView>
                </>
            );
        }
    };

    return (
        <BackgroundGradient insetHeader={false} style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backArrowSection}
                    onPress={() => {
                        goBack();
                    }}>
                    <BackArrow />
                </TouchableOpacity>
                <SearchBox onChangeText={handleOnChangeText} searchWord={recommendedSearchWord} />
            </View>
            <>
                {/* Loading State */}
                {loading && <AppLoadingIndicator />}
                {/* Error State */}
                {!loading && searchTerm !== '' && error && <AppErrorComponent />}

                {/* Search Content */}
                {!loading && !error && searchList()}
            </>
            <DetailPopup onModelClosed={onModelClosed} data={detailModelResource} />
        </BackgroundGradient>
    );
};

export default SearchResultsTemplate;

interface SearchResultsTemplateProps {
    navigation: any;
}

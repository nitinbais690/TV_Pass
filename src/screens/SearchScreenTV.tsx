import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, FlatList, Platform, TouchableHighlight } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useDiscoverySearch, ResourceVm } from 'qp-discovery-ui';
import { selectDeviceType, AspectRatio } from 'qp-common-ui';
import { SearchBar } from 'react-native-elements';
import { AppEvents, ErrorEvents, condenseSearchData, condenseErrorObject } from 'utils/ReportingUtils';
import AppErrorComponent from 'utils/AppErrorComponent';
import { appFonts, appPadding } from '../../AppStyles';
import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import AppLoadingIndicator from './components/AppLoadingIndicator';
import StorefrontCardView from './components/StorefrontCardView';

export enum SearchMode {
    Recommended = 'recommended',
    Default = 'default',
}

const SearchScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldApplyFocusStyle, setShouldApplyFocusStyle] = useState(false);
    const searchBarRef = useRef<SearchBar>(null);

    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const insets = useSafeArea();
    const { recordEvent, recordErrorEvent } = useAnalytics();

    const { strings } = useLocalization();
    const storefrontId = appConfig && appConfig.recommendSearchStorefrontId;
    const tabId = appConfig && appConfig.recommendSearchStorefrontTabId;
    const noSearchResultsURL = appConfig && appConfig.noSearchResultsURL;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    flexDirection: 'column',
                },
                headerContainer: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 20),
                    paddingTop: selectDeviceType({ Handset: appPadding.md(true) }, appPadding.xs(true)) + insets.top,
                    marginBottom: 10,
                },
                searchContainer: {
                    padding: 0,
                    margin: 0,
                    backgroundColor: 'transparent',
                },
                doneButton: {
                    marginLeft: selectDeviceType({ Handset: 5 }, 20),
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                doneButtonText: { color: appColors.tertiary, fontFamily: appFonts.semibold, fontSize: appFonts.xs },
                searchTitle: {
                    color: appColors.tertiary,
                    fontFamily: appFonts.medium,
                    fontSize: appFonts.xxs,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: appPadding.sm(true),
                },
                emptyResultContainer: {
                    margin: 10,
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: appColors.primaryVariant2,
                },
                emptyResultText: {
                    color: appColors.tertiary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xs,
                },
            }),
        [appColors.primaryVariant2, appColors.tertiary, insets.top],
    );

    const focusSearch = () => {
        if (searchBarRef !== null && searchBarRef.current !== null) {
            searchBarRef.current.focus();
        }
    };

    const [searchMode] = useState(SearchMode.Default);
    const [recommendedSearchUrl] = useState('');
    const pageSize = 12;

    const { resources, error, errorObject, hasMore, loading, loadMore } = useDiscoverySearch(
        searchMode,
        recommendedSearchUrl,
        noSearchResultsURL,
        searchTerm,
        300,
        pageSize,
    );

    useEffect(() => {
        if (error === true) {
            recordErrorEvent(ErrorEvents.SEARCH_FAILURE, condenseErrorObject(errorObject));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    const onEndReached = React.useCallback(() => {
        if (hasMore && loadMore) {
            loadMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore]);

    useEffect(() => {
        recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resources.length, searchTerm]);

    const handleOnChangeText = (value: string) => {
        setSearchTerm(value);
        // setRecommendedSearchWord(value);

        // if (value.length > 0) {
        //     setShowRecommendedOverlay(false);
        // } else {
        //     setShowRecommendedOverlay(true);
        //     setSearchMode(SearchMode.Default);
        // }
    };

    // const handleOnItemSelect = (container: ContainerVm) => {
    //     setSearchMode(SearchMode.Recommended);
    //     // setShowRecommendedOverlay(false);
    //     // setRecommendedSearchWord(container.name);
    //     if (container && container.contentUrl) {
    //         setRecommendedSearchUrl(container.contentUrl);
    //     }
    // };

    const isAndroidTV = Platform.OS === 'android' && Platform.isTV;
    // const defaultSearchStyle = isAndroidTV ? styles.searchContainerStyle : undefined;
    const focusStyle = isAndroidTV
        ? shouldApplyFocusStyle
            ? {
                  borderBottomWidth: 0,
                  borderColor: appColors.brandTint,
                  backgroundColor: appColors.primaryVariant3,
                  elevation: 0,
              }
            : { borderBottomWidth: 0, backgroundColor: 'transparent', elevation: 0 }
        : undefined;

    const aspectRatio = AspectRatio._16by9;

    const onHandlePress = React.useCallback(
        (resource: ResourceVm, position: number = 0) => {
            recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length, position + 1));
            resource.storeFrontId = storefrontId;
            resource.tabId = tabId;
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: resource,
                title: resource.name,
                resourceId: resource.id,
                resourceType: resource.type,
                searchPosition: position + 1,
            });
        },
        [navigation, recordEvent, resources.length, searchTerm, storefrontId, tabId],
    );

    const renderResource = React.useCallback(
        ({ item }: { item: ResourceVm }) => (
            <StorefrontCardView
                resource={item}
                isPortrait={height > width}
                onResourcePress={onHandlePress}
                fallbackAspectRatio={aspectRatio}
                cardsPreview={5.6}
                gridMode
                containerSize={{ width: width - 2 * appPadding.sm(true), height }}
            />
        ),
        [height, width, onHandlePress, aspectRatio],
    );

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);

    return (
        <BackgroundGradient insetHeader={false} style={styles.container}>
            <TouchableHighlight
                // hasTVPreferredFocus
                underlayColor={appColors.primary}
                activeOpacity={0.5}
                onPress={() => {
                    focusSearch();
                }}
                onFocus={() => setShouldApplyFocusStyle(true)}
                onBlur={() => setShouldApplyFocusStyle(false)}>
                <SearchBar
                    // platform={'def'}
                    cancelIcon={!isAndroidTV}
                    clearIcon={!isAndroidTV}
                    searchIcon={!isAndroidTV}
                    // containerStyle={[defaultSearchStyle]}
                    accessibilityLabel={'Search Bar'}
                    placeholder={strings['search.placeholder']}
                    lightTheme={false}
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={[focusStyle]}
                    onChangeText={handleOnChangeText}
                    showLoading={loading}
                    value={searchTerm}
                    ref={searchBarRef}
                />
            </TouchableHighlight>

            {loading && <AppLoadingIndicator />}
            {!loading && searchTerm !== '' && error && <AppErrorComponent />}

            {!loading && !error && (
                <FlatList<ResourceVm>
                    testID={'resourceListView'}
                    horizontal={false}
                    numColumns={5}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={resources}
                    renderItem={renderResource}
                    keyExtractor={resourcesKeyExtractor}
                    removeClippedSubviews={false}
                    onEndReached={onEndReached}
                    contentContainerStyle={{ marginHorizontal: appPadding.sm(true) }}
                />
            )}
        </BackgroundGradient>
    );
};

export default SearchScreen;

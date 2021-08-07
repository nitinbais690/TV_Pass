import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, Platform, TabBarIOS } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useDimensions } from '@react-native-community/hooks';
import { useDiscoverySearch, ResourceVm, ResizableImage, ContainerVm } from 'qp-discovery-ui';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import AppErrorComponent from 'utils/AppErrorComponent';
import { AppEvents, ErrorEvents, condenseSearchData, condenseErrorObject } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { SearchBox } from './components/SearchBox';
import { Pill } from './components/Pill';
import { RecommendedSearchView } from './RecommendedSearchView';
import BackgroundGradient from './components/BackgroundGradient';
import AppLoadingIndicator from './components/AppLoadingIndicator';
import { NAVIGATION_TYPE } from './Navigation/NavigationConstants';
import { appFonts, appPadding } from '../../AppStyles';
import CloseIcon from '../../assets/images/close.svg';
import CreditsIcon from '../../assets/images/credits_small.svg';
import { requireNativeComponent } from 'react-native';
import ResourceCardViewSearchTV, {
    ResourceCardViewBaseProps,
} from '../components/qp-discovery-ui/src/views/ResourceCardViewSearchTV';
import Menu from '../TV/components/Menu';

const Search = requireNativeComponent('TVPassSearchComponent');

const ResourceListView = ({
    resources,
    onPress,
    onEndReached,
    onEndReachedThreshold,
    hasMore,
    searchTerm,
}: {
    resources: ResourceVm[];
    onPress: (_: ResourceVm, _position: number) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    hasMore?: boolean;
    searchTerm?: string;
}): JSX.Element => {
    const insets = useSafeArea();
    const { appLanguage, strings } = useLocalization();
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                listContainer: {
                    paddingBottom: insets.bottom,
                },
                container: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 16, // We want same vertical spacing on tablets, so this shld be hard-coded
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: appColors.border,
                },
                tvOSContainer: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 25,
                    margin: 0,
                    borderColor: appColors.primary,
                    borderRadius: 25,
                    borderWidth: 0,
                    width: '94%',
                    alignSelf: 'center',
                },
                imageWrapper: {
                    width: Platform.isTV ? '14%' : '40%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: !Platform.isTV ? 5 : 15,
                    overflow: 'hidden',
                },
                image: {
                    flex: 1,
                    backgroundColor: appColors.primaryVariant2,
                    borderRadius: 5,
                },
                textContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginHorizontal: !Platform.isTV ? appPadding.sm(true) : appPadding.xs(true),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: Platform.isTV ? appFonts.md : appFonts.xs,
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: Platform.isTV ? appFonts.md : appFonts.xs,
                    color: Platform.isTV ? appColors.tertiary : appColors.caption,
                    textTransform: 'none',
                },
                pillOverlay: {
                    position: 'absolute',
                    bottom: 6,
                    left: 6,
                },
                pillWrapper: {
                    flex: 1,
                    flexDirection: 'row',
                    marginHorizontal: 4,
                    marginVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                pillText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xxs,
                    fontWeight: '500',
                    marginLeft: 2,
                },
                emptySearch: {
                    flex: 1,
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    height: '30%',
                    fontSize: 35,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginTop: 100,
                },
            }),
        [
            appColors.border,
            appColors.caption,
            appColors.primary,
            appColors.primaryVariant2,
            appColors.secondary,
            appColors.tertiary,
            insets.bottom,
        ],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const cardStyle = {
        wrapperStyle: {
            width: 80,
            height: 50,
            backgroundColor: 'red',
        },
    };
    const cardProps: ResourceCardViewBaseProps<ResourceVm> = {
        cardStyle: cardStyle,
        onResourcePress: (res: ResourceVm, index: number) => {
            onPress(res, index);
        },
    };
    const defaultRenderResourceTV = ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
        return <ResourceCardViewSearchTV index={index} resource={item} {...cardProps} cardStyle={{}} />;
    };
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            const genres = (item.contentGenre && item.contentGenre[appLanguage]) || [];
            const genreString = genres.join(', ');
            const metaInfo = [];
            if (item.releaseYear) {
                metaInfo.push(item.releaseYear);
            }
            if (genreString) {
                metaInfo.push(genreString);
            }
            if (item.formattedRunningTime) {
                metaInfo.push(item.formattedRunningTime);
            }
            const metaInfoString = metaInfo.join(' \u2022 ');
            return (
                <BorderlessButton onPress={() => onPress(item, index)}>
                    <View style={styles.container}>
                        <View style={styles.imageWrapper}>
                            <ResizableImage
                                keyId={item.id}
                                aspectRatioKey={AspectRatio._16by9}
                                imageType={ImageType.Poster}
                                style={styles.image}
                            />
                            {item.credits && (
                                <View style={styles.pillOverlay}>
                                    <Pill>
                                        <View style={styles.pillWrapper}>
                                            <CreditsIcon />
                                            <Text style={styles.pillText}>{item.credits}</Text>
                                        </View>
                                    </Pill>
                                </View>
                            )}
                        </View>
                        <View style={styles.textContainer}>
                            <View>
                                <Text style={[styles.titleTypography, styles.title]}>{item.name}</Text>
                                <Text style={[styles.captionTypography]}>{metaInfoString}</Text>
                            </View>
                            <Text style={[styles.captionTypography]}>{item.providerName}</Text>
                        </View>
                    </View>
                </BorderlessButton>
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isPortrait],
    );

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            horizontal={false}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            data={resources}
            renderItem={Platform.isTV ? defaultRenderResourceTV : defaultRenderResource}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListEmptyComponent={() => {
                if (Platform.isTV && resources.length == 0) {
                    return (
                        <Text style={styles.emptySearch}>
                            {strings['tv.searchEmpty_msg']} "{searchTerm}".
                        </Text>
                    );
                } else {
                    return <></>;
                }
            }}
            ListFooterComponent={hasMore ? LoadingComponent : null}
        />
    );
};

export enum SearchMode {
    Recommended = 'recommended',
    Default = 'default',
}

const SearchScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const insets = useSafeArea();
    const [searchTerm, setSearchTerm] = useState('');
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const prefs = useAppPreferencesState();
    const { strings } = useLocalization();
    const { appTheme, appConfig } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
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
                tvOSContainer: {
                    flex: 1,
                    maxHeight: 100,
                },
                tvOSSearchContainer: {
                    backgroundColor: 'transparent',
                    marginTop: 40,
                },
                tvOSSearchResultContainer: {
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
                headerContainerTV: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.xs(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 10),
                    paddingTop: selectDeviceType({ Handset: appPadding.md(true) }, appPadding.xs(true)) + insets.top,
                    marginBottom: 2,
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
                resultListContainer: {
                    flex: 1,
                    minHeight: 300,
                },
            }),
        [appColors.primaryVariant2, appColors.tertiary, insets.top],
    );

    const [showRecommendedOverlay, setShowRecommendedOverlay] = useState(true);
    const [searchMode, setSearchMode] = useState(SearchMode.Default);
    const [recommendedSearchUrl, setRecommendedSearchUrl] = useState('');
    const [recommendedSearchWord, setRecommendedSearchWord] = useState('');
    const pageSize = (appConfig && appConfig.searchPageSize) || 12;

    const { resources, noSearchResources, error, errorObject, hasMore, loading, loadMore } = useDiscoverySearch(
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

    const onHandlePress = React.useCallback(
        (resource: ResourceVm, position: number) => {
            recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length, position + 1));
            resource.storeFrontId = storefrontId;
            resource.tabId = tabId;
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: resource,
                title: resource.name,
                resourceId: resource.id,
                resourceType: resource.type,
                searchPosition: position + 1,
                recommendedSearchWord: recommendedSearchWord ? recommendedSearchWord : searchTerm,
            });
        },
        [navigation, recommendedSearchWord, recordEvent, resources.length, searchTerm, storefrontId, tabId],
    );

    useEffect(() => {
        recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resources.length, searchTerm, recommendedSearchWord]);

    const handleOnChangeText = (value: string) => {
        setSearchTerm(value);
        setRecommendedSearchWord(value);

        if (value.length > 0) {
            setShowRecommendedOverlay(false);
        } else {
            setShowRecommendedOverlay(true);
            setSearchMode(SearchMode.Default);
        }
    };

    const handleOnChangeTextTVOS = (event: any) => {
        const value = event.nativeEvent.text;
        setSearchTerm(value);
        setSearchMode(SearchMode.Default);
        setRecommendedSearchWord(value);
    };

    const handleOnItemSelect = (container: ContainerVm) => {
        setSearchMode(SearchMode.Recommended);
        setShowRecommendedOverlay(false);
        setRecommendedSearchWord(container.name);
        if (container && container.contentUrl) {
            setRecommendedSearchUrl(container.contentUrl);
        }
    };

    //Render for Search in tvOS
    const renderSearchTv = () => {
        return (
            <View style={{ flex: 1, width: '90%', paddingLeft: 100, alignSelf: 'center', marginTop: -200 }}>
                <TabBarIOS
                    unselectedTintColor="transparent"
                    tintColor="transparent"
                    unselectedItemTintColor="transparent"
                    barTintColor="transparent">
                    <TabBarIOS.Item style={styles.tvOSSearchContainer} selected={true}>
                        {/* Native Search View controller */}
                        <Search style={styles.tvOSSearchResultContainer} onChangeText={handleOnChangeTextTVOS}>
                            {/* recommended search for tv OS */}
                            <View style={styles.tvOSContainer}>
                                <RecommendedSearchView
                                    searchWord={recommendedSearchWord}
                                    onRecommendedItemSelect={handleOnItemSelect}
                                />
                            </View>
                            {/* Loading State */}
                            {loading && <AppLoadingIndicator />}
                            {/* Results State for iOS */}
                            {!loading && !error && recommendedSearchWord !== '' && (
                                <View style={styles.resultListContainer}>
                                    <ResourceListView
                                        resources={resources.length > 0 ? resources : noSearchResources}
                                        onPress={onHandlePress}
                                        onEndReached={onEndReached}
                                        onEndReachedThreshold={0.7}
                                        searchTerm={searchTerm}
                                        hasMore={hasMore}
                                    />
                                </View>
                            )}
                        </Search>
                    </TabBarIOS.Item>
                </TabBarIOS>
            </View>
        );
    };

    return (
        <BackgroundGradient insetHeader={false} style={styles.container}>
            {Platform.isTV && Platform.OS == 'ios' && <Menu />}

            {/* Render searchBox for iOS */}
            <View style={Platform.isTV && Platform.OS == 'ios' ? styles.headerContainerTV : styles.headerContainer}>
                {!Platform.isTV && Platform.OS == 'ios' && (
                    <SearchBox onChangeText={handleOnChangeText} searchWord={recommendedSearchWord} />
                )}
                {!Platform.isTV && Platform.OS == 'ios' && (
                    <BorderlessButton onPress={() => navigation.pop()} style={styles.doneButton}>
                        <CloseIcon />
                    </BorderlessButton>
                )}
            </View>

            {/* Render for tvOS */}
            {Platform.isTV && Platform.OS == 'ios' && renderSearchTv()}

            {/* recommended search for iOS */}
            {!Platform.isTV && showRecommendedOverlay && (
                <View style={styles.container}>
                    <RecommendedSearchView
                        searchWord={recommendedSearchWord}
                        onRecommendedItemSelect={handleOnItemSelect}
                    />
                </View>
            )}
            <>
                {/* Loading State */}
                {loading && !Platform.isTV && <AppLoadingIndicator />}
                {/* Error State */}
                {!loading && searchTerm !== '' && error && <AppErrorComponent />}
                {!loading && searchTerm !== '' && resources.length === 0 && noSearchResources.length > 0 && (
                    <View style={styles.emptyResultContainer}>
                        <Text style={styles.emptyResultText}>
                            {strings.formatString(strings.no_search_results_msg, searchTerm)}
                        </Text>
                    </View>
                )}

                {/* Results State for iOS */}
                {!loading && !error && recommendedSearchWord !== '' && !Platform.isTV && (
                    <>
                        <ResourceListView
                            resources={resources.length > 0 ? resources : noSearchResources}
                            onPress={onHandlePress}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.7}
                            hasMore={hasMore}
                        />
                    </>
                )}
                {Platform.isTV && <Menu />}
            </>
        </BackgroundGradient>
    );
};

export default SearchScreen;

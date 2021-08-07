import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList } from 'react-native';
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

const ResourceListView = ({
    resources,
    onPress,
    onEndReached,
    onEndReachedThreshold,
    hasMore,
}: {
    resources: ResourceVm[];
    onPress: (_: ResourceVm, _position: number) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    hasMore?: boolean;
}): JSX.Element => {
    const insets = useSafeArea();
    const { appLanguage } = useLocalization();
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
                imageWrapper: {
                    width: '40%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: 5,
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
                    marginHorizontal: appPadding.sm(true),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xs,
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xxs,
                    color: appColors.caption,
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
            }),
        [appColors.border, appColors.caption, appColors.primaryVariant2, appColors.secondary, insets.bottom],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);
    // const channelsImageType =
    //     appConfig && appConfig.channelsImageType ? appConfig.channelsImageType : ImageType.LogoHeader;

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
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
                            <Text style={[styles.captionTypography]}>{item.network}</Text>
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
            renderItem={defaultRenderResource}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListFooterComponent={hasMore ? LoadingComponent : null}
            disableVirtualization={true}
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
                headerContainer: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 20),
                    paddingTop: selectDeviceType({ Handset: appPadding.md(true) }, appPadding.xs(true)) + insets.top,
                    marginBottom: 10,
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
            let screenName = NAVIGATION_TYPE.CONTENT_DETAILS;
            if (resource.type === 'Collection') {
                screenName =
                    resource.collectionLayout === 'grid'
                        ? NAVIGATION_TYPE.COLLECTIONS_GRID
                        : NAVIGATION_TYPE.COLLECTIONS;
            }
            navigation.navigate(screenName, {
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
    }, [resources.length, searchTerm]);

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

    const handleOnItemSelect = (container: ContainerVm) => {
        setSearchMode(SearchMode.Recommended);
        setShowRecommendedOverlay(false);
        setRecommendedSearchWord(container.name);
        if (container && container.contentUrl) {
            setRecommendedSearchUrl(container.contentUrl);
        }
    };

    return (
        <BackgroundGradient insetHeader={false} style={styles.container}>
            <View style={styles.headerContainer}>
                <SearchBox onChangeText={handleOnChangeText} searchWord={recommendedSearchWord} />
                <BorderlessButton onPress={() => navigation.pop()} style={styles.doneButton}>
                    <CloseIcon accessible accessibilityLabel={'Close'} />
                </BorderlessButton>
            </View>
            {showRecommendedOverlay && (
                <View style={styles.container}>
                    <RecommendedSearchView onRecommendedItemSelect={handleOnItemSelect} />
                </View>
            )}
            <>
                {/* Loading State */}
                {loading && <AppLoadingIndicator />}
                {/* Error State */}
                {!loading && searchTerm !== '' && error && <AppErrorComponent />}
                {!loading && searchTerm !== '' && resources.length === 0 && noSearchResources.length > 0 && (
                    <View style={styles.emptyResultContainer}>
                        <Text style={styles.emptyResultText}>
                            {strings.formatString(strings.no_search_results_msg, searchTerm)}
                        </Text>
                    </View>
                )}

                {/* Results State */}
                {!loading && !error && recommendedSearchWord !== '' && (
                    <>
                        <ResourceListView
                            resources={resources.length > 0 ? resources : noSearchResources}
                            onPress={onHandlePress}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.4}
                            hasMore={hasMore}
                        />
                    </>
                )}
            </>
        </BackgroundGradient>
    );
};

export default SearchScreen;

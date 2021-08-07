import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text,
    FlatList,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    findNodeHandle,
    TouchableHighlight,
    useTVEventHandler,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import {
    useDiscoverySearch,
    ResourceVm,
    ResizableImage,
    useFetchRecommendedSearchQuery,
    ContainerVm,
} from 'qp-discovery-ui';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import AppErrorComponent from 'utils/AppErrorComponent';
import { AppEvents, ErrorEvents, condenseSearchData, condenseErrorObject } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { SearchBox } from './components/SearchBox';
import { AlphabetFilter } from './components/AlphabetFilter';
import { KeywordsFilter } from './components/KeywordsFilter';
import { Pill } from '../screens/components/Pill';
import BackgroundGradient from '../screens/components/BackgroundGradient';
import AppLoadingIndicator from '../screens/components/AppLoadingIndicator';
import { NAVIGATION_TYPE } from '../screens/Navigation/NavigationConstants';
import { appFonts, appPadding } from '../../AppStyles';
import SearchIcon from '../../assets/images/tv-icons/search_tv.svg';
import CreditsIcon from '../../assets/images/credits_small.svg';
import Menu from '../TV/components/Menu';
// import Keywords from './constants/filterKeywords';

interface CardViewProps {
    onPress?: any;
    styles?: any;
    item?: any;
    metaInfoString?: string;
    index?: number;
}

const CardView = ({ onPress, styles, item, metaInfoString, index }: CardViewProps) => {
    const [cardFocused, setCardFocused] = useState(false);
    return (
        <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => onPress(item, index)}
            onFocus={() => setCardFocused(true)}
            onBlur={() => setCardFocused(false)}>
            <View style={[styles.container, cardFocused && styles.cardContainerShadow]}>
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
                        <Text style={[styles.captionTypography]}>{item.providerName}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
};

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
    const { appLanguage } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                listContainer: {
                    paddingBottom: appPadding.md(true),
                },
                container: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 16, // We want same vertical spacing on tablets, so this shld be hard-coded
                },
                cardContainerShadow: {
                    borderColor: appColors.secondary,
                    borderWidth: 2,
                    backgroundColor: appColors.primaryVariant1,
                    borderRadius: 20,
                    width: '95%',
                    marginLeft: 10,
                },
                imageWrapper: {
                    width: '20%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: 10,
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
                    marginHorizontal: appPadding.xs(true),
                },
                titleTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xxs,
                    color: appColors.secondary,
                },
                title: {
                    marginBottom: 2,
                },
                captionTypography: {
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.xxs,
                    color: appColors.tertiary,
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
        [appColors.primaryVariant1, appColors.primaryVariant2, appColors.secondary, appColors.tertiary],
    );

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);
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
            if (item.rating) {
                metaInfo.push(item.rating);
            }
            if (item.formattedRunningTime) {
                metaInfo.push(item.formattedRunningTime);
            }
            const metaInfoString = metaInfo.join(' \u2022 ');

            return (
                <CardView onPress={onPress} styles={styles} item={item} metaInfoString={metaInfoString} index={index} />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appLanguage, onPress, styles],
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
        />
    );
};

export enum SearchMode {
    Recommended = 'recommended',
    Default = 'default',
}

const SearchScreenTV = ({ navigation }: { navigation: any }): JSX.Element => {
    const insets = useSafeArea();
    const [searchTerm, setSearchTerm] = useState('');
    const { recordEvent, recordErrorEvent } = useAnalytics();
    const { isInternetReachable } = useNetworkStatus();
    const prefs = useAppPreferencesState();
    const { strings } = useLocalization();
    const { appTheme, appConfig } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const storefrontId = appConfig && appConfig.recommendSearchStorefrontId;
    const tabId = appConfig && appConfig.recommendSearchStorefrontTabId;
    const noSearchResultsURL = appConfig && appConfig.noSearchResultsURL;

    const { containers } = useFetchRecommendedSearchQuery(storefrontId, tabId, 5, isInternetReachable);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    flexDirection: 'column',
                },
                headerContainerTV: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.md(true),
                    paddingBottom: selectDeviceType({ Handset: 12 }, 10),
                    paddingTop: selectDeviceType({ Handset: appPadding.md(true) }, appPadding.xs(true)) + insets.top,
                    marginBottom: 2,
                    marginLeft: 5,
                    paddingLeft: appPadding.xl(true),
                },
                doneButton: {
                    justifyContent: 'center',
                    padding: 5,
                    alignSelf: 'center',
                },
                doneButtonFocused: {
                    borderWidth: 1,
                    borderColor: 'white',
                },
                doneButtonText: { color: appColors.tertiary, fontFamily: appFonts.semibold, fontSize: appFonts.xs },
                emptyResultContainer: {
                    // margin: 10,
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: appColors.primaryVariant2,
                    marginLeft: appPadding.xxl(true),
                    marginTop: 15,
                    marginRight: appPadding.md(true),
                    flexWrap: 'wrap',
                },
                emptyResultText: {
                    color: appColors.tertiary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xs,
                },
                errorView: {
                    marginLeft: 90,
                    marginTop: -20,
                },
                resultListContainer: {
                    flex: 1,
                },
                listView: {
                    marginLeft: 100,
                    flex: 1,
                },
                horizontalLine: {
                    backgroundColor: appColors.primaryMoreLight,
                    height: 0.7,
                    width: '80%',
                    alignSelf: 'flex-end',
                    marginHorizontal: appPadding.md(true),
                    marginVertical: appPadding.xs(true),
                },
                keywordContainer: {
                    flexDirection: 'row',
                    width: '92%',
                    alignSelf: 'flex-end',
                    paddingHorizontal: appPadding.md(true),
                    paddingBottom: appPadding.xxs(true),
                    justifyContent: 'space-between',
                },
                clearButtonContainer: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    marginTop: appPadding.xxs(true),
                },
                clearButtonContainerFocused: {
                    flex: 1,
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    marginTop: appPadding.xxs(true),
                },
                clearButtonText: {
                    color: appColors.caption,
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.regular_tv,
                    fontWeight: '600',
                    marginLeft: 10,
                    alignSelf: 'center',
                },
                loadingView: {
                    marginTop: 60,
                },
            }),
        [insets.top, appColors.tertiary, appColors.primaryVariant2, appColors.primaryMoreLight, appColors.caption],
    );
    const [recommendedSearchWord, setRecommendedSearchWord] = useState('');
    const [recommendedSearchUrl, setRecommendedSearchUrl] = useState('');
    const [searchMode, setSearchMode] = useState(SearchMode.Default);
    const [selectedAlpha, setSelectedAlpha] = useState('');
    const [selectedKeyword, setSelectedKeyword] = useState('');
    const [isNumber, setIsNumber] = useState(false);
    const [selectedNum, setSelectedNum] = useState(0);
    const [iconFocus, setIconFocus] = useState(true);
    const [isFocus, setIsFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        Keyboard.dismiss();
        setSearchTerm(value);
        setRecommendedSearchWord(value);
        setSearchMode(SearchMode.Default);
    };

    const onClickAlpha = (value: string) => {
        let tempValue = recommendedSearchWord + value;
        setSelectedAlpha(value);
        setRecommendedSearchWord(tempValue);
        setSearchTerm(tempValue);
        setSearchMode(SearchMode.Default);
    };

    const onClickNumber = (value: number) => {
        let tempValue = searchTerm + value;
        setSelectedNum(value);
        setRecommendedSearchWord(tempValue);
        setSearchTerm(tempValue);
        setSearchMode(SearchMode.Default);
    };

    const onClickKeyword = (container: ContainerVm) => {
        setSelectedKeyword(container.name);
        setRecommendedSearchWord(container.name);
        setSearchMode(SearchMode.Recommended);
        if (container && container.contentUrl) {
            setRecommendedSearchUrl(container.contentUrl);
        }
    };

    const onSearchClick = () => {
        recordEvent(AppEvents.SEARCH, condenseSearchData(searchTerm, resources.length));
    };

    const onChangeNumber = () => {
        setIsNumber(!isNumber);
    };

    const onPressSpace = () => {
        let tempString = recommendedSearchWord;
        setRecommendedSearchWord(tempString + ' ');
        setSearchTerm(tempString + ' ');
    };

    const onBackPress = () => {
        let tempString = recommendedSearchWord;
        if (tempString.length > 0) {
            const editedText = tempString.slice(0, -1);
            setSelectedAlpha(editedText.charAt(editedText.length - 1));
            setRecommendedSearchWord(editedText);
            setSearchTerm(editedText);
        }
    };

    const audioRecogniseRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            audioRecogniseRef.current = ref;
        }
    }, []);

    const searchIconRef = useRef(null);

    const searchRef = useCallback(ref => {
        if (ref) {
            searchIconRef.current = ref;
        }
    }, []);

    const myTVEventHandler = (evt: { eventType: React.SetStateAction<string> }) => {
        if (evt.eventType === 'down' && !iconFocus && !isFocus) {
            setIsLoading(false);
        }
    };

    useTVEventHandler(myTVEventHandler);

    return (
        <TouchableWithoutFeedback
            onFocus={() => {
                setIconFocus(true);
            }}
            onBlur={() => {
                setIconFocus(false);
            }}>
            <BackgroundGradient insetHeader={false} style={styles.container}>
                {/* Render searchBox */}
                <View style={styles.headerContainerTV}>
                    <View style={[styles.doneButton]}>
                        <TouchableOpacity
                            hasTVPreferredFocus={iconFocus}
                            onFocus={() => setIsLoading(false)}
                            onBlur={() => {
                                setIconFocus(false);
                                setIsLoading(true);
                            }}
                            nextFocusRight={findNodeHandle(audioRecogniseRef.current)}
                            ref={searchRef}>
                            <SearchIcon onPress={onSearchClick} height={35} width={35} />
                        </TouchableOpacity>
                    </View>

                    <SearchBox
                        onChangeText={handleOnChangeText}
                        searchWord={recommendedSearchWord}
                        keyboardHide={true}
                    />
                    <TouchableOpacity
                        style={isFocus ? styles.clearButtonContainerFocused : styles.clearButtonContainer}
                        onFocus={() => {
                            setIsFocus(true);
                            setIsLoading(false);
                        }}
                        onBlur={() => {
                            setIsFocus(false);
                            setIsLoading(true);
                        }}
                        ref={onRef}
                        nextFocusLeft={findNodeHandle(searchIconRef.current)}>
                        <Text style={styles.clearButtonText}>{strings['tv.search.hold_text']}</Text>
                        <Text style={styles.clearButtonText}>{strings['tv.search.to_dictate']}</Text>
                    </TouchableOpacity>
                </View>
                {/* Render Alphabets and Numbers view */}

                <View>
                    <AlphabetFilter
                        selectedAlpha={selectedAlpha}
                        onClick={onClickAlpha}
                        onClickNumber={onClickNumber}
                        onBackPress={onBackPress}
                        onChangeNumber={onChangeNumber}
                        onPressSpace={onPressSpace}
                        isNumber={isNumber}
                        selectedNum={selectedNum}
                        isLoading={isLoading}
                        setIsLoading={(value: boolean | ((prevState: boolean) => boolean)) => {
                            setIsLoading(value);
                        }}
                    />

                    <View style={styles.horizontalLine} />
                    {/* Render keywords tab view */}
                    <View style={styles.keywordContainer}>
                        {containers.map((keyword, index) => {
                            return (
                                <KeywordsFilter
                                    selectedKeyword={selectedKeyword}
                                    onClick={onClickKeyword}
                                    keyword={keyword.name}
                                    container={keyword}
                                    index={index}
                                    setLoading={(value: boolean | ((prevState: boolean) => boolean)) =>
                                        setIsLoading(value)
                                    }
                                />
                            );
                        })}
                    </View>
                </View>
                <>
                    {/* Loading State */}
                    {loading && Platform.isTV && (
                        <View style={styles.loadingView}>
                            <AppLoadingIndicator />
                        </View>
                    )}
                    {/* Error State */}
                    {!loading && searchTerm !== '' && error && (
                        <View style={styles.errorView}>
                            <AppErrorComponent />
                        </View>
                    )}

                    {!loading && searchTerm !== '' && resources.length === 0 && (
                        <View style={styles.emptyResultContainer}>
                            <Text style={styles.emptyResultText}>
                                {strings.formatString(strings.no_search_results_msg, searchTerm)}
                            </Text>
                        </View>
                    )}

                    {/* Results List */}
                    {!loading && !error && recommendedSearchWord !== '' && (
                        <View style={styles.listView}>
                            <ResourceListView
                                resources={resources.length > 0 ? resources : noSearchResources}
                                onPress={onHandlePress}
                                onEndReached={onEndReached}
                                onEndReachedThreshold={0.7}
                                hasMore={hasMore}
                            />
                        </View>
                    )}
                    <Menu isTransparentGradient={true} />
                </>
            </BackgroundGradient>
        </TouchableWithoutFeedback>
    );
};

export default SearchScreenTV;

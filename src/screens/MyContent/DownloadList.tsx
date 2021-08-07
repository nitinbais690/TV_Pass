import React, { useState, useRef, useEffect } from 'react';
import { Animated, ListRenderItemInfo, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { BlurView } from '@react-native-community/blur';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts, appPadding } from '../../../AppStyles';
import { Download, downloadManager } from 'rn-qp-nxg-player';
import { Category, ResourceVm, useConfig } from 'qp-discovery-ui';
import { OfflineImage } from '../components/OfflineImage';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { PlayerProps } from '../hooks/usePlayerConfig';
import RightArrow from '../../../assets/images/RightArrow.svg';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { BorderlessButton } from 'react-native-gesture-handler';
import DownloadButton from 'screens/components/DownloadButton';
import { useDownloads } from 'platform/hooks/useDownloads';
import { formatSizeBytes } from 'utils/DownloadUtils';
import { useAlert } from 'contexts/AlertContext';
import { AppEvents, condenseDownloadData } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { useDownloadsContext } from 'utils/DownloadsContextProvider';
import { getDownloadsBookmark } from 'utils/DownloadBookmarkUtils';

export type DownloadWithMetadata = ResourceVm & Download;

interface DownloadListProps {
    downloads: DownloadWithMetadata[];
}

const DownloadList = ({ downloads }: DownloadListProps): JSX.Element => {
    const { downloads: originalDownloads } = useDownloads(downloadManager);
    const rowTranslateAnimatedValues: { [key: string]: Animated.Value } = {};
    const rowSwipeAnimatedValues: { [key: string]: Animated.Value } = {};
    const navigation = useNavigation();
    const animationIsRunning = useRef(false);
    const { strings, appLanguage } = useLocalization();
    const { width } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { Alert } = useAlert();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const imageWidth = (width * 40) / 100; // 40% width of the screen
    const rowHeight = imageWidth / AspectRatio._16by9 + 40;
    const { recordEvent } = useAnalytics();
    const { downloadOverWifiOnly } = useDownloadsContext();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                listContainer: {},
                container: {
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 20, // We want same vertical spacing on tablets, so this shld be hard-coded
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: appColors.border,
                },
                imageWrapper: {
                    width: '40%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: 5,
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
                accessoryView: { justifyContent: 'center' },
                backTextWhite: {
                    color: appColors.secondary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xs,
                },
                deleteBtn: {
                    flex: 1,
                    justifyContent: 'center',
                },
                progressText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xs,
                    fontWeight: '500',
                },
                rowFront: {
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderBottomColor: appColors.primaryVariant1,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    justifyContent: 'center',
                    height: rowHeight,
                },
                rowBack: {
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 15,
                },
                backRightBtn: {
                    alignItems: 'center',
                    bottom: 0,
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    width: 0,
                },
                backRightBtnRight: {
                    backgroundColor: '#ff453a',
                    right: 0,
                },
            }),
        [
            appColors.border,
            appColors.caption,
            appColors.primaryVariant1,
            appColors.primaryVariant2,
            appColors.secondary,
            rowHeight,
        ],
    );

    const [listData, setListData] = useState(downloads || []);

    useEffect(() => {
        setListData(downloads || []);
    }, [downloads]);

    listData.forEach(data => {
        rowTranslateAnimatedValues[data.id] = new Animated.Value(1);
        rowSwipeAnimatedValues[data.id] = new Animated.Value(0);
    });
    listData.sort((a: DownloadWithMetadata, b: DownloadWithMetadata): number => {
        return a.episodeNumber < b.episodeNumber! ? -1 : a.episodeNumber! > b.episodeNumber ? 1 : 0;
    });

    const config = useConfig();
    const resizerEndpoint = (config && config.imageResizeURL) || undefined;
    const resizerPath = /*(config && config.imageResizerPath)*/ 'image' || undefined;

    const getDownloadExpiry = (expiryTime: number) => {
        var downloadExpiryDate = new Date(expiryTime).valueOf();
        var epocDate = new Date().valueOf();
        //For finding the date difference between expiry date and epoc date
        var result = Math.abs((epocDate - downloadExpiryDate) / 1000);
        // For converting the expiry to number of days
        var downloadExpiryTime: any = Math.ceil(result / 86400);
        if (downloadExpiryTime === 0) {
            //For converting the expiry to number of hours
            downloadExpiryTime = Math.ceil((result / 3600) % 24);
            downloadExpiryTime = strings.formatString(
                strings['my_content.download_availability_hours'],
                downloadExpiryTime,
            );
        } else if (downloadExpiryTime > 1) {
            downloadExpiryTime = strings.formatString(
                strings['my_content.download_availability_days'],
                downloadExpiryTime,
            );
        } else {
            downloadExpiryTime = strings.formatString(
                strings['my_content.download_availability_day'],
                downloadExpiryTime,
            );
        }
        return downloadExpiryTime;
    };

    const deleteItem = async (downloadItem: DownloadWithMetadata) => {
        animationIsRunning.current = true;
        Animated.timing(rowTranslateAnimatedValues[downloadItem.id], {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start(async () => {
            const newData = [...listData];
            const prevIndex = listData.findIndex(d => d.id === downloadItem.id);
            newData.splice(prevIndex, 1);
            setListData(newData);
            animationIsRunning.current = false;
            await downloadManager.purgeDownload(downloadItem.id);
            recordEvent(AppEvents.DOWNLOAD_DELETED, condenseDownloadData(downloadItem));
        });
    };

    const showDownloadError = () => {
        Alert.alert(
            strings['download.error.general_error_msg'],
            undefined,
            [
                {
                    text: strings['global.okay'],
                },
            ],
            {
                cancelable: false,
            },
        );
    };

    const showSettingsDownload = () => {
        Alert.alert(
            strings['download.error.wifi_only'],
            undefined,
            [
                {
                    text: strings['global.okay'],
                },
            ],
            {
                cancelable: false,
            },
        );
    };

    const _onPress = async (item: DownloadWithMetadata, index: number) => {
        console.log(`gonna launch player for ${item.id} at index ${index}`);
        if (!item) {
            return;
        }

        if (item.type === Category.TVSeries) {
            navigation.navigate(NAVIGATION_TYPE.SERIES_DOWNLOAD, item);
            return;
        }

        const originalItem = originalDownloads.find(d => d.id === item.id);
        if (!originalItem) {
            return;
        }

        switch (originalItem.state) {
            case 'DOWNLOADING':
                downloadManager.pauseDownload(item.id);
                break;
            case 'FAILED':
                showDownloadError();
                break;
            case 'QUEUED':
                if (!downloadOverWifiOnly) {
                    downloadManager.resumeDownload(item.id);
                } else {
                    showSettingsDownload();
                }
                recordEvent(AppEvents.DOWNLOAD_RESUMED, condenseDownloadData(item));
                break;
            case 'REMOVING':
            case 'STALE':
                deleteItem(item);
                break;
            case 'COMPLETED':
                item.watchedOffset = await getDownloadsBookmark(item.skd);
                let playerProps: PlayerProps = {
                    tvodToken: '',
                    resource: item,
                    platformDownload: originalItem,
                };
                navigation.navigate('Player', playerProps);
                break;
        }
    };

    const renderItem = (data: ListRenderItemInfo<DownloadWithMetadata>) => {
        const { item, index } = data;
        const originalItem = originalDownloads.find(d => d.id === item.id);

        const isTVSeries = item.type === Category.TVSeries;
        const showTitleEnabled = (originalItem && originalItem.state === 'COMPLETED') || isTVSeries;

        const genres = (item.contentGenre && item.contentGenre[appLanguage]) || [];
        const genreString = genres.join(', ');
        const metaInfo = [];
        if (item.releaseYear) {
            metaInfo.push(item.releaseYear);
        }
        if (genreString) {
            metaInfo.push(genreString);
        }
        if (item.providerName) {
            metaInfo.push(item.network);
        }
        const metaInfoString = metaInfo.join(' \u2022 ');
        const default_thumbnail = require('../../../assets/images/default_thumbnail.png');
        const posterImageURI = imageResizerUri(
            resizerEndpoint || '',
            resizerPath,
            item.id,
            AspectRatio._16by9,
            ImageType.Poster,
            imageWidth,
        );
        const title =
            item.type === Category.TVEpisode ? `S${item.seasonNumber} E${item.episodeNumber}: ${item.name}` : item.name;

        var downloadExpiryTime;
        var sizeOnDisk;
        if (originalItem) {
            downloadExpiryTime = getDownloadExpiry(originalItem.expiration ? originalItem.expiration : 0);
            sizeOnDisk = formatSizeBytes(originalItem.sizeOnDisk);
        }

        return (
            <SwipeRow
                disableRightSwipe={true}
                disableLeftSwipe={isTVSeries}
                useNativeDriver={false}
                rightOpenValue={-75}
                onSwipeValueChange={async ({ value }: { value: number }) => {
                    rowSwipeAnimatedValues[item.id].setValue(Math.abs(value));
                    if (value < -width && !animationIsRunning.current) {
                        await deleteItem(item);
                    }
                }}
                item={item}>
                <View style={styles.rowBack}>
                    <Animated.View
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                            {
                                width: rowSwipeAnimatedValues[item.id].interpolate({
                                    inputRange: [0, width],
                                    outputRange: [0, width],
                                }),
                            },
                        ]}>
                        <BorderlessButton style={styles.deleteBtn} onPress={() => deleteItem(item)}>
                            <Text numberOfLines={1} style={styles.backTextWhite}>
                                {strings['my_content.download_delete_cta']}
                            </Text>
                        </BorderlessButton>
                    </Animated.View>
                </View>
                <Animated.View
                    style={[
                        {
                            height: rowTranslateAnimatedValues[item.id].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, rowHeight],
                            }),
                        },
                    ]}>
                    <TouchableHighlight
                        onPress={() => _onPress(item, index)}
                        style={styles.rowFront}
                        underlayColor={appColors.primaryVariant1}>
                        <View style={styles.container}>
                            <View style={styles.imageWrapper}>
                                <OfflineImage
                                    style={styles.image}
                                    resizeMode="contain"
                                    imageURI={posterImageURI}
                                    offlineID={item.id}
                                    fallbackSource={default_thumbnail}
                                />
                                {originalItem && originalItem.state !== 'COMPLETED' && (
                                    <BlurView
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <DownloadButton fetchingAuthorization={false} download={originalItem} />
                                    </BlurView>
                                )}
                            </View>
                            <View style={styles.textContainer}>
                                <View>
                                    <Text
                                        style={[
                                            styles.titleTypography,
                                            styles.title,
                                            showTitleEnabled ? {} : { color: appColors.caption },
                                        ]}>
                                        {title}
                                    </Text>
                                    <Text style={[styles.captionTypography]}>{metaInfoString}</Text>
                                </View>
                                {isTVSeries && (
                                    <View>
                                        <Text style={[styles.captionTypography]}>{item.subtitle}</Text>
                                    </View>
                                )}
                                {originalItem &&
                                    originalItem.state === 'COMPLETED' &&
                                    downloadExpiryTime &&
                                    sizeOnDisk && (
                                        <View>
                                            <Text style={[styles.captionTypography, { color: appColors.brandTint }]}>
                                                {strings.formatString(
                                                    strings['my_content.download_availability'],
                                                    downloadExpiryTime,
                                                )}
                                            </Text>
                                            <Text style={[styles.captionTypography]}>{sizeOnDisk}</Text>
                                        </View>
                                    )}
                            </View>
                            {isTVSeries && (
                                <View style={styles.accessoryView}>
                                    <RightArrow />
                                </View>
                            )}
                        </View>
                    </TouchableHighlight>
                </Animated.View>
            </SwipeRow>
        );
    };

    return (
        <>
            {listData.length > 0 && (
                <SwipeListView
                    data={listData}
                    renderItem={renderItem}
                    useNativeDriver={false}
                    closeOnRowPress={true}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </>
    );
};

const propsAreEqual = (prevProps: DownloadListProps, nextProps: DownloadListProps): boolean => {
    return prevProps.downloads.map(r => r.id).join(',') === nextProps.downloads.map(r => r.id).join(',');
};

export default React.memo(DownloadList, propsAreEqual);

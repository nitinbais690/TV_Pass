import React, { useRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StyleProp,
    ViewStyle,
    TextStyle,
    TouchableHighlight,
    Platform,
    ProgressViewIOS,
    ProgressBarAndroid,
    ActivityIndicator,
} from 'react-native';
import { fonts, colors, padding, percentage, typography } from 'qp-common-ui';
import { ResourceVm } from '../models/ViewModels';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import { getEpochTime } from '../utils/DateUtils';

const largeScreen = DeviceInfo.getDeviceType() !== 'Handset';
const scheduleHeight = largeScreen ? percentage(12, true) : percentage(22, true);

const defaultEpgViewStyle = StyleSheet.create({
    rootContainerStyle: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.primary,
    },
    timeBarContainerStyle: {
        // flex: 1,
        flexDirection: 'row',
        height: 40,
        alignItems: 'flex-end',
        paddingBottom: 5,
        backgroundColor: colors.primary,
        zIndex: 10,
        borderColor: colors.backgroundInactiveSelected,
        borderBottomWidth: 1,
    },
    channelViewStyle: {
        // flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: scheduleHeight,
        // borderColor: 'red',//colors.backgroundInactiveSelected,
        marginTop: 0,
        borderRightWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 1,
    },
    scheduleConatainerStyle: {
        // flex: 1,
    },
    scheduleViewStyle: {
        // flex: 4,
        flexDirection: 'column',
    },
    scheduleStyle: {
        backgroundColor: colors.primary,
    },
    scheduleItemStyle: {
        backgroundColor: colors.backgroundInactive,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        height: scheduleHeight,
        // padding: percentage(2, true),
        marginTop: 0,
        marginRight: 0,
        marginLeft: 0,
        marginBottom: 0,
        borderColor: colors.backgroundInactiveSelected,
        borderRightWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 1,
    },
    scheduleActiveItemStyle: {
        backgroundColor: colors.backgroundActive,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        height: scheduleHeight,
        color: 'white', //colors.primary,
        // padding: percentage(2, true),
        marginTop: 0,
        marginRight: 0,
        marginLeft: 0,
        marginBottom: 0,
        borderColor: '#0A0A0A', //colors.backgroundInactiveSelected,
        borderRightWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 1,
    },
    scheduleItemTextStyle: {
        ...typography.sectionHeader,
        color: 'white', //colors.primary,
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: padding.xs(true),
        paddingRight: padding.xs(true),
        paddingTop: padding.xs(true),
    },
    scheduleItemSubtitleTextStyle: {
        ...typography.caption1,
        color: 'white', //colors.primary,
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: padding.xs(true),
        paddingRight: padding.xs(true),
        paddingTop: padding.xxs(true),
    },
    channelItemStyle: {
        justifyContent: 'center',
        width: largeScreen ? percentage(15, true) : percentage(20, true),
        height: largeScreen ? percentage(10, true) : percentage(22, true),
        // backgroundColor: colors.primary,
    },
    channelImageStyle: {
        aspectRatio: 16 / 9,
        margin: 2,
    },
    timeBarItemStyle: {
        width: 100,
        fontSize: fonts.xxs,
        color: colors.brandTint,
    },
    progressStyle: {
        bottom: padding.md(),
        left: padding.xs(true),
        right: padding.xs(true),
        position: 'absolute',
        transform: [{ scaleX: 1.0 }, { scaleY: 0.5 }],
    },
    nowTimelineIndicator: {
        left: -1,
        zIndex: 10,
        width: 1,
        height: 37,
        backgroundColor: colors.brandTint,
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
});

export interface EpgGuideViewStyle {
    /**
     * The Style of the root container(View)
     */
    rootContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the time bar container(View)
     */
    timeBarContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the Channel container(View)
     */
    channelViewStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the schedule container(View)
     */
    scheduleViewStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of schedule list row(FlatList)
     */
    scheduleStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the schedule item(View)
     */
    scheduleItemStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the active schedule item(View)
     */
    scheduleActiveItemStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the schedule text item(Text)
     */
    scheduleItemTextStyle?: StyleProp<TextStyle>;
    /**
     * The Style of the schedule subtitle text item (Text)
     */
    scheduleItemSubtitleTextStyle?: StyleProp<TextStyle>;
    /**
     * The Style of the Channel Logo wrapper (View)
     */
    channelItemStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the Channel Logo (Image)
     */
    channelImageStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the time bar text item(Text)
     */
    timeBarItemStyle?: StyleProp<TextStyle>;
    /**
     * The Style of the time bar text item(Text)
     */
    progressStyle?: StyleProp<TextStyle>;
    /**
     * The Style of the time bar text item(Text)
     */
    nowTimelineIndicator?: StyleProp<TextStyle>;
}

export interface EpgGuideViewProps<T> {
    /**
     * The start time for the EPG schedule
     */
    dayStartTime: number;
    /**
     * The end time for the EPG schedule
     */
    dayEndTime: number;
    /**
     * Controls whether to scroll to the active program. Default is true.
     */
    scrollToActiveProgram?: boolean;
    /**
     * An array representing time slots on the EPG schedule
     */
    timeSlotData: string[];
    /**
     * An array of channels to show in the EPG grid
     */
    channels: T[];
    /**
     * An array representing programs for all channels
     */
    schedules: T[][];
    /**
     * The style of the epg view container
     */
    epgGuideViewStyle?: EpgGuideViewStyle;
    /**
     * Called when the touch is released,
     * but not if cancelled (e.g. by a scroll that steals the responder lock).
     */
    onResourcePress: (resource: T) => void;
    /**
     * How many channel schedule rows to render in the initial batch. This should be enough to fill the screen but not much more.
     * Note these items will never be unmounted as part of the windowed rendering
     * in order to improve perceived performance of scroll-to-top actions.
     */
    initialNumOfChannelsToRender?: number;
    /**
     * The tint color to apply on the channel logo
     */
    channelTintColor?: string;
    /**
     * The color to be used for the progress indicator
     */
    progressColor?: string;
    /**
     * The color to be used for the progress background indicator
     */
    progressBackgroundColor?: string;
    /**
     * The color to use when selecting the program tile
     */
    scheduleUnderlayColor?: string;
    /**
     * Determines whether to show the current time indicator on top if the EPG.
     * Default is true.
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * Determines whether to show the the current progress for the active program.
     * Default is true.
     */
    showActiveProgramProgressIndicator?: boolean;
    /**
     * Indicates whether data is currently being loaded
     */
    loading: boolean;
    /**
     * Called once when the scroll position gets within onEndReachedThreshold of the rendered content.
     */
    onEndReached?: () => void;
    /**
     * How far from the end (in units of visible length of the list) the bottom edge of the
     * list must be from the end of the content to trigger the `onEndReached` callback.
     * Thus a value of 0.5 will trigger `onEndReached` when the end of the content is
     * within half the visible length of the list.
     */
    onEndReachedThreshold?: number;
}

export const EpgGuideView = (props: EpgGuideViewProps<ResourceVm>): JSX.Element => {
    const {
        dayStartTime,
        dayEndTime,
        scrollToActiveProgram = true,
        onResourcePress,
        epgGuideViewStyle = {},
        timeSlotData,
        channels,
        schedules,
        scheduleUnderlayColor,
        progressColor,
        progressBackgroundColor,
        showCurrentTimeIndicator = true,
        showActiveProgramProgressIndicator = true,
        onEndReached,
        onEndReachedThreshold = 1,
        loading,
    } = props;
    const timeBarSlotListArr: JSX.Element[] = [];
    const scrollRef = useRef<ScrollView>(null);
    const [nowIndicatorOffset, setNowIndicatorOffset] = useState(0);

    const relativeWidth = (start: number, end: number): number => {
        const relativeHourWidth = 200;
        const duration = (end - start) / 1000;
        const durationFactor = duration / 3600;
        return Math.floor(relativeHourWidth * durationFactor);
    };

    const triggerEndReached = (totalContentHeight: number, actualViewHeight: number, offset: number) => {
        if (!onEndReached) {
            return;
        }

        const endThresold = totalContentHeight * onEndReachedThreshold;
        const endReached = endThresold - (actualViewHeight + offset) < 0;

        if (!loading && endReached) {
            onEndReached();
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (scrollRef.current && scrollToActiveProgram && schedules.length > 0) {
                const validSchedule = schedules.filter(programs => programs.length > 0)[0];
                const activePrograms = validSchedule.filter(s => s.isProgramActive);
                if (activePrograms.length > 0 && activePrograms[0].startTime) {
                    scrollRef.current.scrollTo({
                        x: relativeWidth(dayStartTime, Date.now()) - 100,
                        y: 0,
                        animated: false,
                    });

                    if (showCurrentTimeIndicator) {
                        setNowIndicatorOffset(relativeWidth(dayStartTime, Date.now()));
                    }
                }
            }
        }, 100);
        return () => {};
    }, [dayStartTime, scrollToActiveProgram, showCurrentTimeIndicator, schedules]);

    timeSlotData.forEach(value => {
        timeBarSlotListArr.push(
            <View key={value}>
                <Text style={[defaultEpgViewStyle.timeBarItemStyle, epgGuideViewStyle.timeBarItemStyle]}>
                    {' '}
                    {value}{' '}
                </Text>
            </View>,
        );
    });

    const ChannelInfo = ({ item }: { item: ResourceVm }): JSX.Element => {
        return (
            <View style={[defaultEpgViewStyle.channelItemStyle, epgGuideViewStyle.channelItemStyle]}>
                {item.colorLogo && (
                    <FastImage
                        key={item.id}
                        //  tintColor={channelTintColor ? channelTintColor : colors.caption}
                        // tintColor={'white'}
                        style={[defaultEpgViewStyle.channelImageStyle]}
                        resizeMode={FastImage.resizeMode.contain}
                        source={{ uri: `https://${item.colorLogo}` }}
                    />
                )}
            </View>
        );
    };

    const Progress = ({ progress }: { progress: number }): JSX.Element => {
        return Platform.OS === 'ios' ? (
            <ProgressViewIOS
                style={[defaultEpgViewStyle.progressStyle, epgGuideViewStyle.progressStyle]}
                progress={progress}
                progressTintColor={progressColor ? progressColor : colors.brandTint}
                trackTintColor={progressBackgroundColor ? progressBackgroundColor : colors.brandTintLight}
            />
        ) : (
            <ProgressBarAndroid
                progress={progress}
                styleAttr="Horizontal"
                style={[defaultEpgViewStyle.progressStyle, epgGuideViewStyle.progressStyle]}
                indeterminate={false}
                color={progressColor ? progressColor : colors.brandTint}
            />
        );
    };

    const renderScheduleItem = (item: ResourceVm): JSX.Element => {
        const airingStartTimeInEpoch = getEpochTime(item.startTime);
        const airingEndTimeInEpoch = getEpochTime(item.endTime);

        const actualStartTime = Math.max(airingStartTimeInEpoch, dayStartTime);
        const actualEndTime = Math.min(airingEndTimeInEpoch, dayEndTime);

        const activeProgram = item.isProgramActive;
        const showProgress = showActiveProgramProgressIndicator && activeProgram;

        const inactiveTileStyle = [defaultEpgViewStyle.scheduleItemStyle, epgGuideViewStyle.scheduleItemStyle];
        const activeTileStyle = [
            defaultEpgViewStyle.scheduleActiveItemStyle,
            epgGuideViewStyle.scheduleActiveItemStyle,
        ];
        const tileStyle = [
            ...(activeProgram ? activeTileStyle : inactiveTileStyle),
            { width: relativeWidth(actualStartTime, actualEndTime) },
        ];

        return (
            <TouchableHighlight
                accessibilityLabel={'Schedule Item'}
                testID={'ScheduleItem'}
                key={item.id}
                activeOpacity={0.5}
                underlayColor={scheduleUnderlayColor ? scheduleUnderlayColor : colors.tertiary}
                onPress={() => onResourcePress(item)}>
                <View style={tileStyle}>
                    <Text
                        numberOfLines={2}
                        style={[
                            defaultEpgViewStyle.scheduleItemTextStyle,
                            epgGuideViewStyle.scheduleItemTextStyle,
                            activeProgram ? {} : { opacity: 0.5 },
                        ]}>
                        {item.name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode={'head'}
                        style={[
                            defaultEpgViewStyle.scheduleItemSubtitleTextStyle,
                            epgGuideViewStyle.scheduleItemSubtitleTextStyle,
                        ]}>
                        {item.programHumanSchedule}
                    </Text>
                    {showProgress && <Progress progress={item.currentProgramProgress!} />}
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            onLayout={e => {
                const height = e.nativeEvent.layout.height;
                triggerEndReached(height, height, 0);
            }}
            scrollEventThrottle={0}
            onScroll={e => {
                if (!onEndReached) {
                    return;
                }

                const totalContentHeight = e.nativeEvent.contentSize.height;
                const actualViewHeight = e.nativeEvent.layoutMeasurement.height;
                const offset = e.nativeEvent.contentOffset.y;
                triggerEndReached(totalContentHeight, actualViewHeight, offset);
            }}>
            <View style={[defaultEpgViewStyle.rootContainerStyle, epgGuideViewStyle.rootContainerStyle]}>
                <View testID={'ChannelsView'} accessibilityLabel={'Channels View'}>
                    <View
                        style={[defaultEpgViewStyle.timeBarContainerStyle, epgGuideViewStyle.timeBarContainerStyle]}
                    />
                    {channels.map((channel, index) => {
                        return (
                            <View
                                key={`channel_${index}`}
                                style={[defaultEpgViewStyle.channelViewStyle, epgGuideViewStyle.channelViewStyle]}>
                                <ChannelInfo item={channel} />
                            </View>
                        );
                    })}
                </View>
                <View style={[defaultEpgViewStyle.scheduleViewStyle, epgGuideViewStyle.scheduleViewStyle]}>
                    <ScrollView ref={scrollRef} horizontal removeClippedSubviews showsHorizontalScrollIndicator={false}>
                        <View style={defaultEpgViewStyle.scheduleConatainerStyle}>
                            <View
                                testID={'TimeBarView'}
                                accessibilityLabel={'TimeBar View'}
                                style={[
                                    defaultEpgViewStyle.timeBarContainerStyle,
                                    epgGuideViewStyle.timeBarContainerStyle,
                                ]}>
                                {timeBarSlotListArr}
                            </View>
                            <View
                                testID={'SchedulesView'}
                                accessibilityLabel={'Schedules View'}
                                style={[defaultEpgViewStyle.scheduleStyle, epgGuideViewStyle.scheduleStyle]}>
                                {schedules.map((schedule, index) => {
                                    return (
                                        <ScrollView
                                            key={`scroll_${index}`}
                                            showsHorizontalScrollIndicator={false}
                                            pagingEnabled
                                            horizontal>
                                            {schedule.map(item => renderScheduleItem(item))}
                                        </ScrollView>
                                    );
                                })}
                            </View>
                        </View>
                        {showCurrentTimeIndicator && (
                            <View
                                style={[
                                    defaultEpgViewStyle.nowTimelineIndicator,
                                    epgGuideViewStyle.nowTimelineIndicator,
                                    { left: nowIndicatorOffset },
                                ]}
                            />
                        )}
                    </ScrollView>
                </View>
            </View>
            {loading && <ActivityIndicator style={{ padding: padding.sm() }} />}
        </ScrollView>
    );
};

import React, { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { EpgGuideView, DropDownMenuView, useFetchEpgQuery, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from '../utils/AppPreferencesContext';
import AppErrorComponent from 'utils/AppErrorComponent';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';

//TODO: send epgConfiguration through props
import { getDateList } from 'qp-discovery-ui';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

const dateList = getDateList();

const epgConfiguration = {
    pageSize: 12,
    noOfDays: 3,
    totalPages: 45,
    epgGridStartHour: 0,
};

const calculateEpgTimeBarSlots = (): string[] => {
    const epgTimelineHours: number = 24;
    const epgTimelineInterval = 30; //in minutes
    let epgTimelineStartHours: number = 0 * 60; //in minutes
    let timeBarSlotListArr: string[] = [];
    for (var i = 0; epgTimelineStartHours < (epgTimelineHours + 0) * 60; i++) {
        let time: string;
        var hh = Math.floor(epgTimelineStartHours / 60); // getting hours of day in 0-24 format
        var mm = epgTimelineStartHours % 60; // getting minutes of the hour in 0-55 format
        let hours = ('' + (hh % 12)).slice(-2);
        hours = hours === '0' ? '12' : hours;
        time = hours + ':' + ('0' + mm).slice(-2) + (hh < 12 ? 'am' : 'pm');
        epgTimelineStartHours = epgTimelineStartHours + epgTimelineInterval;
        timeBarSlotListArr.push(time);
    }
    return timeBarSlotListArr;
};

const timeSlotData = calculateEpgTimeBarSlots();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useReloadEPG = (reload: () => {}, reloadFrequency: number): void => {
    useEffect(() => {
        let refreshInterval: NodeJS.Timeout | number | null = null;

        if (!Platform.isTV) {
            refreshInterval = setInterval(() => {
                reload();
            }, reloadFrequency);
        }

        // clear timeout when component unmounts
        return () => {
            if (refreshInterval) {
                clearTimeout(refreshInterval as number);
            }
        };
    });
};

const EpgGuideScreen = (route: any): JSX.Element => {
    let LoadingComponent, ErrorComponent;

    // if (Platform.isTV) {
    //     LoadingComponent = AppLoadingIndicator;//route.LoadingComponent;
    //     ErrorComponent = AppErrorComponent; //route.ErrorComponent;
    // } else {
    //     LoadingComponent = route.route.params.LoadingComponent;
    //     ErrorComponent = route.route.params.ErrorComponent;
    // }

    LoadingComponent = <AppLoadingIndicator />;
    ErrorComponent = <AppErrorComponent />;

    const prefs = useAppPreferencesState();
    const { appTheme, useDefaultStyle } = prefs;
    let { appContainerStyle, epgGuideViewStyle, appColors, dropDownMenuStyle } = appTheme && appTheme(prefs);
    let selectedIndex = useRef(-1);
    const [dateIndex, setDateIndex] = useState(epgConfiguration.noOfDays);
    const [startDate, setStartDate] = useState(dateList[dateIndex].startDate);
    const [endDate, setEndDate] = useState(dateList[dateIndex].endDate);

    const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

    const startDate1 = new Date(startDate);
    startDate1.setHours(0, 0, 0, 0);

    const dayStartTime = startDate1.getTime();
    const dayEndDate = new Date(dayStartTime);
    const pageSize = 10;
    const dayEndTime = dayEndDate.setDate(dayEndDate.getDate() + 1);
    const scheduleHumanDates = dateList.map(d => (d.name === 'Today' ? 'Today' : d.name));

    if (dateList) {
        if (dateIndex > -1 && selectedIndex.current === -1) {
            selectedIndex.current = dateIndex;
            setStartDate(dateList[dateIndex].startDate);
            setEndDate(dateList[dateIndex].endDate);
        }
    }

    const { loading, error, containers, channels, hasMore, loadMore } = useFetchEpgQuery(startDate, endDate, pageSize);
    let schedules: ResourceVm[][] = [];
    containers &&
        containers.forEach((value: ResourceVm[]) => {
            schedules.push(value);
        });

    return (
        <BackgroundGradient style={appContainerStyle.container} insetHeader={false} insetTabBar>
            {loading && channels.length === 0 && LoadingComponent && LoadingComponent}
            {channels.length !== 0 && !error && (
                <>
                    <DropDownMenuView
                        tintColor={appColors.secondary}
                        activeTintColor={appColors.secondary}
                        selectionColor={appColors.brandTint}
                        // maxHeight={appDimensions.fullHeight - 300}
                        selectIndex={selectedIndex.current}
                        dropDownMenuStyle={dropDownMenuStyle}
                        onMenuItemPress={index => {
                            selectedIndex.current = index;
                            setStartDate(dateList[index].startDate);
                            setEndDate(dateList[index].endDate);
                            setDateIndex(index);
                        }}
                        //  itemHeight={listItemHeight}
                        data={[scheduleHumanDates]}
                    />
                    <EpgGuideView
                        dayStartTime={dayStartTime}
                        dayEndTime={dayEndTime}
                        scrollToActiveProgram={today === dayStartTime}
                        showCurrentTimeIndicator={today === dayStartTime}
                        timeSlotData={timeSlotData}
                        channels={channels}
                        schedules={schedules}
                        channelTintColor={useDefaultStyle ? undefined : appColors.tertiary}
                        epgGuideViewStyle={epgGuideViewStyle}
                        scheduleUnderlayColor={appColors.backgroundInactiveSelected}
                        progressColor={appColors.brandTint}
                        progressBackgroundColor={appColors.captionLight}
                        showActiveProgramProgressIndicator
                        onResourcePress={selectedResource =>
                            route.navigation.navigate('Details', {
                                resource: selectedResource,
                                resourceId: selectedResource.programId,
                                resourceType: selectedResource.type,
                                title: selectedResource.name,
                            })
                        }
                        loading={loading && channels.length !== 0}
                        onEndReachedThreshold={0.8}
                        onEndReached={() => hasMore && loadMore()}
                    />
                </>
            )}
            {loading && channels.length === 0 && LoadingComponent && LoadingComponent}
            {error && ErrorComponent && ErrorComponent}
        </BackgroundGradient>
    );
};

export default EpgGuideScreen;

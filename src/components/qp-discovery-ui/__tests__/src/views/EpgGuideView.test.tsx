import React from 'react';
// import { Text } from 'react-native';
// import * as useCustomHook from '../../../src/hooks/useFetchEpgQuery';
import { render, fireEvent, getByTestId, getAllByTestId, waitForElement } from '@testing-library/react-native';
import { ClientContextProvider, createAPIClient } from '../../../index';
import { EpgGuideView } from '../../../src/views/EpgGuideView';
import { ResourceVm } from '../../../src/models/ViewModels';

jest.mock('../../../src/hooks/useFetchEpgQuery');

describe('EpgGuideView', () => {
    it('renders correctly with default styles', async () => {
        const vms = [createMockResourceVm()];
        const cms = createMockContainers();
        const tms = createMockTimeBarSlots();
        const dayStartTime = Math.random();
        const dayEndTime = Math.random();
        const loading = false;
        const pressHandler = jest.fn();

        const { container } = render(jsx(pressHandler, vms, cms, tms, dayStartTime, dayEndTime, loading));
        await waitForElement(() => getByTestId(container, 'ChannelsView'));
        await waitForElement(() => getByTestId(container, 'TimeBarView'));
        await waitForElement(() => getByTestId(container, 'SchedulesView'));
    });

    it('renders correctly and invokes onResourcePress', async () => {
        const vms = [createMockResourceVm()];
        const cms = createMockContainers();
        const tms = createMockTimeBarSlots();
        const dayStartTime = Math.random();
        const dayEndTime = Math.random();
        const loading = false;
        let schedules: ResourceVm[][] = [];
        cms.forEach((value: ResourceVm[]) => {
            schedules.push(value);
        });

        const pressHandler = jest.fn();
        const { container } = render(
            <EpgGuideView
                onResourcePress={pressHandler}
                channels={vms}
                schedules={schedules}
                timeSlotData={tms}
                dayStartTime={dayStartTime}
                dayEndTime={dayEndTime}
                loading={loading}
            />,
        );

        const wrapper = getAllByTestId(container, 'ScheduleItem');
        fireEvent.press(wrapper[0]);
        expect(pressHandler).toHaveBeenCalled();
    });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////-------SETUP MOCKS-------///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const jsx = (
    pressHandler: any,
    channels: ResourceVm[],
    containers: Map<string, ResourceVm[]>,
    timeSlotData: string[],
    dayStartTime: any,
    dayEndTime: any,
    loading: any,
) => {
    const Client = createAPIClient({
        discovery: { host: 'https://mockHost', basePath: 'mockPath', defaultQueryParams: {} },
    });
    let schedules: ResourceVm[][] = [];
    containers &&
        containers.forEach((value: ResourceVm[]) => {
            schedules.push(value);
        });
    return (
        <ClientContextProvider client={Client}>
            <EpgGuideView
                timeSlotData={timeSlotData}
                channels={channels}
                schedules={schedules}
                epgGuideViewStyle={{}}
                onResourcePress={pressHandler}
                dayStartTime={dayStartTime}
                dayEndTime={dayEndTime}
                loading={loading}
            />
        </ClientContextProvider>
    );
};

const createMockResourceVm = (): ResourceVm => {
    const vm: ResourceVm = {
        name: `Resource_Title_${Math.random()}`,
        id: `${Math.random()}`,
        colorLogo: 'http://example.com/images/test_1by1.png',
        type: 'airing',
    };
    return vm;
};

const createMockContainers = (): Map<string, ResourceVm[]> => {
    const containers: Map<string, ResourceVm[]> = new Map<string, ResourceVm[]>();
    const vm = (): ResourceVm => ({
        endTime: Math.random(),
        startTime: Math.random(),
        name: `Schedule_Title_${Math.random()}`,
        id: `id_${Math.random()}`,
        type: 'airing',
        isProgramActive: true,
    });
    containers.set(`${Math.random()}`, [vm(), vm()]);
    return containers;
};

const createMockTimeBarSlots = (): string[] => {
    const EPG_TIMELINE_HRS: number = 24;
    const EPG_TIMELINE_GAP_INTERVAL = 30;
    let EpgTimelineStartHrs: number = 6 * 60;
    const timeBarSlotListArr: string[] = [];

    for (var i = 6; EpgTimelineStartHrs < (EPG_TIMELINE_HRS + 6) * 60; i++) {
        let time: string;
        var hh = Math.floor(EpgTimelineStartHrs / 60);
        var mm = EpgTimelineStartHrs % 60;
        time = ('0' + (hh % 24)).slice(-2) + ':' + ('0' + mm).slice(-2);
        EpgTimelineStartHrs = EpgTimelineStartHrs + EPG_TIMELINE_GAP_INTERVAL;
        timeBarSlotListArr.push(time);
    }
    return timeBarSlotListArr;
};

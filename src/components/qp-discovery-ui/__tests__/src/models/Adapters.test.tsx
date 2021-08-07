import {
    tabAdapter,
    containerAdapter,
    catalogResourceAdapter,
    epgChannelAdapter,
    epgAiringAdapter,
    epgProgramAdapter,
    metaDataResourceAdapter,
} from '../../../src/models/Adapters';
import * as rootContainerResponse from '../__mocks__/home_container_success.json';
import * as rootNavigationSuccess from '../__mocks__/root_navigation_success.json';
import * as epgGridSuccess from '../__mocks__/epgGrid_success.json';
import * as epgChannelSuccess from '../__mocks__/epg_channel_success.json';
import * as epgProgramSuccess from '../__mocks__/epg_program_success.json';
import * as resourceSuccess from '../__mocks__/resource_success.json';

describe('CarouselView', () => {
    it('renders tabAdapter', () => {
        const tabAdapterResponse = tabAdapter(rootNavigationSuccess.data[0]);
        expect(tabAdapterResponse.id).toBe('0CAF7A15-6A9F-433E-AFA3-02E1E0829736');
        expect(tabAdapterResponse.name).toBe('Home');
    });

    it('renders containerAdapter', () => {
        const containerResponse = rootContainerResponse.data[0];
        let containerAdapterResponse = containerAdapter(containerResponse);
        expect(containerAdapterResponse.id).toBe('C2F99F1B-58E6-4F00-8902-BD4FF7778F63');
        expect(containerAdapterResponse.layout).toBe('carousel');
        expect(containerAdapterResponse.name).toBeDefined();
        // containerResponse.iar = '1-1x1';
        // containerAdapterResponse = containerAdapter(containerResponse);
        // containerResponse.iar = '2-4x3';
        // containerAdapterResponse = containerAdapter(containerResponse);
        // containerResponse.iar = '3-16x9';
        // containerAdapterResponse = containerAdapter(containerResponse);
        // containerResponse.iar = '';
        // containerAdapterResponse = containerAdapter(containerResponse);
    });

    it('renders catalogResourceAdapter', () => {
        const containerAdapterResponse = containerAdapter(rootContainerResponse.data[0]);
        const catalogResourceAdapterResponse = catalogResourceAdapter(
            epgChannelSuccess.data[0],
            containerAdapterResponse,
        );
        expect(catalogResourceAdapterResponse.id).toBe('498bf15c-a7ce-4db0-a0c1-bb3e37a26fab');
        expect(catalogResourceAdapterResponse.name).toBe('Sun Network');
    });

    it('renders epgChannelAdapter', () => {
        const epgChannelAdapterResponse = epgChannelAdapter(epgGridSuccess.data[0]);
        expect(epgChannelAdapterResponse.id).toBe('11705');
        expect(epgChannelAdapterResponse.type).toBe('channel');
    });

    it('renders epgAiringAdapter', () => {
        const epgAiringAdapterResponse = epgAiringAdapter(epgGridSuccess.data[0].airings[0]);
        expect(epgAiringAdapterResponse.id).toBe('airing_11705_2020-05-11T18:00Z_2020-05-11T19:00Z');
        expect(epgAiringAdapterResponse.type).toBe('airing');
        expect(epgAiringAdapterResponse.isProgramActive).toBeDefined();
        expect(epgAiringAdapterResponse.currentProgramProgress).toBeDefined();
        expect(epgAiringAdapterResponse.programHumanSchedule).toBeDefined();
    });

    it('renders epgProgramAdapter', () => {
        const epgProgramAdapterResponse = epgProgramAdapter(epgProgramSuccess);
        expect(epgProgramAdapterResponse.id).toBe('SH033328620000');
        expect(epgProgramAdapterResponse.name).toBe('Car Repair Secrets!');
        expect(epgProgramAdapterResponse.rating).toBeDefined();
        expect(epgProgramAdapterResponse.shortDescription).toBeDefined();
    });

    it('renders metaDataResourceAdapter', () => {
        const metaDataResourceAdapterResponse = metaDataResourceAdapter(resourceSuccess.data);
        expect(metaDataResourceAdapterResponse.id).toBe('9352E2E9-D046-4541-B798-79BCE8648A8F');
        expect(metaDataResourceAdapterResponse.type).toBe('movie');
        expect(metaDataResourceAdapterResponse.rating).toBeDefined();
        expect(metaDataResourceAdapterResponse.shortDescription).toBeDefined();
    });
});

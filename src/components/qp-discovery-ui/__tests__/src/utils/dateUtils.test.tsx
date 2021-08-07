import {
    epgConfiguration,
    humanReadableTime,
    getDateFromIsoString,
    getDateList,
    prettyTime,
} from '../../../src/utils/DateUtils';

describe('dateUtils', () => {
    xit('Date is formtted to human readable time', () => {
        const dateTime = '2020-05-05T05:38:00+05:30';
        const readableTime = humanReadableTime(dateTime);
        expect(readableTime).toEqual('05:38');
    });

    it('Get date from iso string', () => {
        const date = getDateFromIsoString('2020-05-05T05:38:00+05:30');
        expect(date).toEqual('2020-05-05');
    });

    it('Get date list', () => {
        const dateList = getDateList();
        const totalDays = epgConfiguration.noOfDays * 2;
        expect(dateList.length).toEqual(totalDays);
    });

    xit('Pretty time', () => {
        const epochTime = '1589344513000';
        const time = prettyTime(epochTime);
        expect(time).toEqual('10:05');
    });
});

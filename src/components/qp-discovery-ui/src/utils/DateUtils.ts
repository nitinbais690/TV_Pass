import moment from 'moment';

//TODO: Refactor to accept from app
export const epgConfiguration = {
    pageSize: 12,
    noOfDays: 3,
    totalPages: 45,
    epgGridStartHour: 0,
};

export const humanReadableTime = (date: any) => {
    return moment(date).format('HH:mm');
};

export const getDateFromIsoString = (isoDate: any) => {
    return isoDate.split('T')[0];
};

export const getCurrentTimeInEpoch = () => moment().valueOf();

export const getEpochTime = (isoDate: any) => {
    return moment(isoDate).valueOf();
};

export const getDateList = () => {
    const dateList = [];
    let index = 0;

    for (let i = -epgConfiguration.noOfDays; i < epgConfiguration.noOfDays; i++) {
        let name = moment()
            .add(i, 'days')
            .format('YYYY-MMM-DD - ddd');
        if (i === 0) {
            name = 'Today';
        }

        dateList.push({
            name: name,
            index: index,
            startDate: moment()
                .add(i, 'days')
                .startOf('day')
                .add(epgConfiguration.epgGridStartHour, 'hours')
                .format(),
            endDate: moment()
                .add(i, 'days')
                .endOf('day')
                .add(epgConfiguration.epgGridStartHour, 'hours')
                .format(),
        });
        index++;
    }
    return dateList;
};

export const prettyTime = (time: string): string => {
    const date = new Date(parseInt(time, 10));
    let hours = date.getHours();
    const minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr}`;
};

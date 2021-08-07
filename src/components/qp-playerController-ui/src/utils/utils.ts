export const visualizeVideoDuration = (duration: number): string => {
    let seconds: any = (duration / 1000).toFixed(0);
    let minutes: any = Math.floor(seconds / 60);
    let hours: any = '';
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : '0' + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    if (hours !== '') {
        return hours + ':' + minutes + ':' + seconds;
    }
    return minutes + ':' + seconds;
};

export const noop = (): void => {};

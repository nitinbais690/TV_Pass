import moment from 'moment';
import { AccountProfile } from './EvergentAPIUtil';

export function getRedeemExpiringIn(validDayTill: number, accountProfile?: AccountProfile): number {
    const days = getDaysCount(validDayTill);
    if (!accountProfile || !accountProfile.hasSubCancelled) {
        return days;
    }
    const subscriptionEndDays = getDaysCount(accountProfile!.prevSubExpDateTime);
    return Math.min(days, subscriptionEndDays);
}

export function getDaysCount(validDayTill: number) {
    const end = moment(validDayTill);
    const now = moment();
    const expiresInHours = end.diff(now, 'hours');
    const expiresInDays = expiresInHours / 24;
    const days = Math.max(Math.ceil(expiresInDays), 1);
    return days;
}

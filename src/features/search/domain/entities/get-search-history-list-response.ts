import { FLHeader } from 'core/config/domain/entities/fl-header';

export interface GetSearchHistoryListResponse {
    header: FLHeader;
    data: GetSearchHistoryListItem[];
}

export interface GetSearchHistoryListItem {
    itemId: string;
    text: string;
    ut: Date;
}

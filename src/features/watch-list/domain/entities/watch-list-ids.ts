export interface WatchListIdsResponse {
    data: WatchListId[];
}

export interface WatchListId {
    itemId: string;
    updatedTimestamp: number;
}

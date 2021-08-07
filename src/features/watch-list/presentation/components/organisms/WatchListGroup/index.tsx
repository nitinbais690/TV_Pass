import { ResourceVm } from 'qp-discovery-ui';
import React from 'react';
import { FlatList } from 'react-native';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import WatchListCard from '../WatchListCard';

export default function WatchListGroup(props: WatchListGroupProps): JSX.Element {
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            return <WatchListCard item={item} index={index} removeSingleResource={props.removeSingleResource} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.removeSingleResource],
    );
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            horizontal={false}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            data={props.resources}
            renderItem={defaultRenderResource}
            contentContainerStyle={{}}
            onEndReached={() => props.hasMore && props.loadMoreResources()}
            onEndReachedThreshold={props.onEndReachedThreshold}
            ListFooterComponent={props.hasMore ? AppLoadingIndicator : null}
        />
    );
}

export interface WatchListGroupProps {
    resources: ResourceVm[];
    hasMore: boolean;
    loadMoreResources: () => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    removeSingleResource: (id: string) => void;
}

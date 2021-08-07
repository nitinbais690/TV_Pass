import React from 'react';
import { FlatList, StyleProp, ViewStyle } from 'react-native';
import { ResourceVm } from '../models/ViewModels';
import ResourceCardView, { cardViewDimensions, ResourceCardViewBaseProps } from './ResourceCardView';
import { cardStyles } from './ResourceCardView';
import _ from 'lodash';
import { dimensions, padding } from 'qp-common-ui';
import deepMerge from '../utils/deepMerge';

const SearchResults = ({
    resources,
    cardsPerRow = 2,
    cardProps = {},
    contentContainerStyle = {},
    onEndReached,
    onEndReachedThreshold,
    ListFooterComponent,
}: {
    resources: ResourceVm[];
    cardsPerRow?: number;
    cardProps?: ResourceCardViewBaseProps<ResourceVm>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    ListFooterComponent?: JSX.Element;
}): JSX.Element => {
    const searchStyle = {
        wrapperStyle: {
            width: (dimensions.fullWidth - (cardsPerRow + 1) * padding.xs(true)) / cardsPerRow,
        },
    };

    const originalCardStyle = _.cloneDeep(cardProps.cardStyle || cardStyles);
    const searchCardStyle = deepMerge(originalCardStyle, searchStyle);
    const [, cardViewHeight] = cardViewDimensions(searchCardStyle);

    const cardViewLayout = (_data: any, index: number): { length: number; offset: number; index: number } => ({
        length: cardViewHeight,
        offset: cardViewHeight * index,
        index,
    });

    const defaultRenderResource = ({ item }: { item: ResourceVm }): JSX.Element => {
        return <ResourceCardView resource={item} {...cardProps} cardStyle={originalCardStyle} />;
    };

    return (
        <FlatList<ResourceVm>
            accessibilityLabel={'Search Results'}
            keyExtractor={listItem => listItem.id || ''}
            horizontal={false}
            numColumns={cardsPerRow}
            showsHorizontalScrollIndicator={false}
            data={resources}
            renderItem={defaultRenderResource}
            removeClippedSubviews
            windowSize={11}
            getItemLayout={cardViewLayout}
            contentContainerStyle={contentContainerStyle}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListFooterComponent={ListFooterComponent}
        />
    );
};

export default SearchResults;

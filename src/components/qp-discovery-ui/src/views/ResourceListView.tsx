import React from 'react';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import ResourceCardView, { ResourceCardViewBaseProps } from './ResourceCardView';
import { ResourceVm } from '../models/ViewModels';

export interface ResourceListViewProps {
    /**
     * Allows the ability to provide a custom rendering of `ResourceVm`.
     * When none is provided, the default rendering would apply.
     */
    renderItem?: ListRenderItem<ResourceVm>;
    /**
     * Styles for list's card props
     */
    cardProps: ResourceCardViewBaseProps<ResourceVm>;
    /**
     *List of resources
     */
    resources: ResourceVm[];
    /**
     * Multiple columns can only be rendered with `horizontal={false}` and will zig-zag like a `flexWrap` layout.
     * Items should all be the same height - masonry layouts are not supported.
     */
    numColumns?: number;
    /**
     * These styles will be applied to the scroll view content container which
     * wraps all of the child views. Example:
     *
     *   return (
     *     <ScrollView contentContainerStyle={styles.contentContainer}>
     *     </ScrollView>
     *   );
     *   ...
     *   const styles = StyleSheet.create({
     *     contentContainer: {
     *       paddingVertical: 20
     *     }
     *   });
     */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /**
     * FlatLists' property
     */
    removeClippedSubviews?: boolean;
}

export const ResourceListView = (props: ResourceListViewProps): JSX.Element => {
    const {
        cardProps = {},
        resources,
        renderItem,
        numColumns = 1,
        contentContainerStyle = {},
        removeClippedSubviews = false,
    } = props;

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);

    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return <ResourceCardView resource={item} {...cardProps} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <FlatList<ResourceVm>
            testID={'resourceListView'}
            horizontal={!(numColumns && numColumns > 1)}
            numColumns={numColumns}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={resources}
            renderItem={renderItem ? renderItem : defaultRenderResource}
            keyExtractor={resourcesKeyExtractor}
            removeClippedSubviews={removeClippedSubviews}
            // initialNumToRender={3}
            // windowSize={5}
            // getItemLayout={cardViewLayout}
            contentContainerStyle={contentContainerStyle}
        />
    );
};

export default React.memo(ResourceListView);

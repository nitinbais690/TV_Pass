import React from 'react';
import { ResourceVm } from '../models/ViewModels';
import { Text, StyleProp, ViewStyle, TextStyle, StyleSheet, FlatList } from 'react-native';
import { padding, colors, typography } from 'qp-common-ui';
import { useFetchRelatedItemsQuery } from '../api/index';
import ResourceCardView, { ResourceCardViewBaseProps } from './ResourceCardView';

const defaultRelatedInfoViewStyle = StyleSheet.create({
    containerStyle: {
        paddingLeft: padding.xs(),
        paddingRight: padding.xs(),
    },
    sectionHeader: {
        ...typography.sectionHeader,
        alignSelf: 'flex-start',
        marginTop: padding.sm(),
        marginLeft: padding.sm(),
        marginRight: padding.xs(),
        color: colors.secondary,
    },
});

export interface RelatedInfoViewStyle {
    /**
     * The style of the related items container.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the section header.
     */
    sectionHeader?: StyleProp<TextStyle>;
}

export interface RelatedItemsViewBaseProps {
    /**
     * The style of the related items view
     */
    relatedInfoViewStyle?: RelatedInfoViewStyle;
}

export interface RelatedItemsViewProps extends RelatedItemsViewBaseProps {
    /**
     * Url link for related items
     */
    relatedContentLink: string;
    /**
     * Rendered when the list is loading.
     */
    ListLoadingComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Props for default `ResourceCardView` component
     */
    cardProps: ResourceCardViewBaseProps<ResourceVm>;
    /**
     * String for title
     */
    title: string;
}

export const RelatedItemsView = (props: RelatedItemsViewProps): JSX.Element => {
    const { relatedContentLink, cardProps, title, ListLoadingComponent, relatedInfoViewStyle = {} } = props;
    const { loading, error, relatedItems } = useFetchRelatedItemsQuery(relatedContentLink);
    return (
        <>
            {/* Loading State */}
            {loading && ListLoadingComponent}

            {!loading && !error && relatedItems && (
                <>
                    <Text
                        testID={title}
                        style={[defaultRelatedInfoViewStyle.sectionHeader, relatedInfoViewStyle.sectionHeader]}>
                        {title}
                    </Text>
                    <FlatList<ResourceVm>
                        testID="relatedItemsView"
                        keyExtractor={item => item.id || ''}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={relatedItems}
                        contentContainerStyle={[
                            defaultRelatedInfoViewStyle.containerStyle,
                            relatedInfoViewStyle.containerStyle,
                        ]}
                        renderItem={({ item }) => <ResourceCardView resource={item} {...cardProps} />}
                    />
                </>
            )}
        </>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.relatedContentLink === nextProps.relatedContentLink;
};

export default React.memo(RelatedItemsView, propsAreEqual);

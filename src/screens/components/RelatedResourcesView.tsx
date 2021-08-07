import React from 'react';
import { ListRenderItem, Text, StyleSheet, FlatList, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { ResourceCardViewBaseProps, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useContentLookup } from 'qp-discovery-ui/src/api';
import { AspectRatio, selectDeviceType, percentage } from 'qp-common-ui';
import StorefrontCardView from './StorefrontCardView';
import SkeletonCatalogContainer from 'screens/components/loading/SkeletonCatalogContainer';
import { RelatedType, relatedQuery } from 'utils/RelatedUtils';
import { useLocalization } from 'contexts/LocalizationContext';

export { RelatedType };

export interface RelatedResourcesViewProps {
    /**
     * The resource instance whose related items are to be displayed
     */
    resource: ResourceVm;
    /**
     * The type of related items
     */
    type: RelatedType;
    /**
     * Allows the ability to provide a custom rendering of `ResourceVm`.
     * When none is provided, the default rendering would apply.
     */
    renderItem?: ListRenderItem<ResourceVm>;
    /**
     * Styles for list's card props
     */
    cardProps: ResourceCardViewBaseProps<ResourceVm>;
}

export const RelatedResourcesView = (props: RelatedResourcesViewProps): JSX.Element => {
    const { resource, type, cardProps = {} } = props;
    const { width, height } = useDimensions().window;
    const { strings, appLanguage } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appConfig, appTheme } = prefs;
    let { appBaseStyles, appPadding } = appTheme!(prefs);

    const query = relatedQuery(appConfig, type, resource, appLanguage);
    const { resources, loading, error } = useContentLookup(query, 1, 25);

    // TODO: refactor to simplify
    const isPortrait = height > width;
    const mh = selectDeviceType({ Tablet: isPortrait ? 40 : percentage<true>(15, true) }, 0);
    const containerW = width - 2 * mh;
    const containerH = height - 2 * selectDeviceType({ Tablet: 40 }, 0);
    const containerSize = { width: containerW, height: containerH };

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                },
                listContainer: {
                    paddingBottom: 10,
                    paddingLeft: appPadding.sm(true),
                    paddingRight: appPadding.xs(true),
                },
            }),
        [appPadding],
    );

    let title: string | string[] = '';
    if (type === RelatedType.RelatedTypeService) {
        title = strings.formatString(strings['content_detail.related_service'], resource.providerName || '');
    } else {
        const [genre] = (resource.contentGenre && resource.contentGenre[appLanguage]) || [];
        title = strings.formatString(strings['content_detail.recommended'], genre || '');
    }

    const aspectRatio = AspectRatio._16by9;
    const cardsPreview = selectDeviceType<number>({ Tv: 5.2, Tablet: 4.2 }, 3.15);

    const renderResource = React.useCallback(
        ({ item }: { item: ResourceVm }) => (
            <StorefrontCardView
                resource={item}
                isPortrait={height > width}
                onResourcePress={cardProps.onResourcePress}
                fallbackAspectRatio={aspectRatio}
                containerSize={containerSize}
                cardsPreview={cardsPreview}
            />
        ),
        [height, width, cardProps.onResourcePress, aspectRatio, containerSize, cardsPreview],
    );

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);

    return (
        <View style={styles.container}>
            {loading && (
                <SkeletonCatalogContainer
                    aspectRatio={aspectRatio}
                    showFooter
                    showContainerLabel
                    count={8}
                    containerSize={containerSize}
                    cardsPreview={cardsPreview}
                />
            )}

            {!loading && !error && resources.length > 0 && (
                <>
                    <Text style={appBaseStyles.sectionHeader}>{title}</Text>
                    <FlatList<ResourceVm>
                        testID={'resourceListView'}
                        horizontal={true}
                        numColumns={1}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={resources}
                        renderItem={renderResource}
                        keyExtractor={resourcesKeyExtractor}
                        removeClippedSubviews={false}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            )}
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource.id === nextProps.resource.id && prevProps.type === nextProps.type;
};

export default React.memo(RelatedResourcesView, propsAreEqual);

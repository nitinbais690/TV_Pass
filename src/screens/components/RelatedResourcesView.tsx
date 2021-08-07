import React from 'react';
import { ListRenderItem, Text, StyleSheet, FlatList, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { Category, ResourceCardViewBaseProps, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AspectRatio, selectDeviceType, percentage } from 'qp-common-ui';
import StorefrontCardView from './StorefrontCardView';
import SkeletonCatalogContainer from 'screens/components/loading/SkeletonCatalogContainer';
import { RelatedType, relatedQuery } from 'utils/RelatedUtils';
import { useLocalization } from 'contexts/LocalizationContext';
import { useRelatedResources } from 'screens/hooks/useRelatedResources';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

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
    /**
     * Show empty card
     */
    cardType?: string;
    /**
     * Track if reported
     */
    setIsReported?: any;
}

export const RelatedResourcesView = (props: RelatedResourcesViewProps): JSX.Element => {
    const { resource, type, cardType = '', setIsReported } = props;
    const navigation = useNavigation();
    const { width, height } = useDimensions().window;
    const { strings, appLanguage } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appConfig, appTheme } = prefs;
    let { appBaseStyles, appPadding } = appTheme!(prefs);
    const query = relatedQuery(appConfig, type, resource, appLanguage);
    const { resources, loading, error } = useRelatedResources(
        query,
        1,
        25,
        type === RelatedType.RelatedTypeRecommended || type === RelatedType.RelatedTypeRecommendedFromService,
    );

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
    switch (type) {
        case RelatedType.RelatedTypeService:
        case RelatedType.RelatedTypeRecommendedFromService:
            title = strings.formatString(strings['content_detail.related_service'], resource.providerName || '');
            break;
        case RelatedType.RelatedTypeRecommended:
        case RelatedType.RelatedTypeGenre: {
            switch (resource.type) {
                case Category.Movie:
                    title = strings['content_detail.recommended_movies'];
                    break;
                case Category.Short:
                    title = strings['content_detail.recommended_shorts'];
                    break;
                case Category.TVEpisode:
                case Category.TVSeason:
                case Category.TVSeries:
                    title = strings['content_detail.recommended_shows'];
                    break;
            }
            break;
        }
    }

    const cardsPreview = selectDeviceType<number>({ Tv: 6.2, Tablet: 4.2 }, 3.15);

    const renderResource = React.useCallback(
        ({ item }: { item: ResourceVm }) => (
            <StorefrontCardView
                resource={item}
                isPortrait={height > width}
                onResourcePress={onResourcePress}
                fallbackAspectRatio={AspectRatio._16by9}
                containerSize={containerSize}
                cardsPreview={cardsPreview}
                cardType={cardType || ''}
            />
        ),
        [height, width, onResourcePress, containerSize, cardsPreview, cardType],
    );

    const onResourcePress = React.useCallback(
        (tappedResource: ResourceVm) => {
            tappedResource.containerName = title;
            setIsReported(false);

            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
            });
        },
        [navigation, setIsReported, title],
    );

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);

    return (
        <View style={styles.container}>
            {loading && (
                <SkeletonCatalogContainer
                    aspectRatio={AspectRatio._16by9}
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

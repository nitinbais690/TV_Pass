import React, { useRef } from 'react';
import { ListRenderItem, Text, StyleSheet, FlatList, View, Platform } from 'react-native';
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
     * Styles for title
     */
    relatedSectionHeader?: any;
    /**
     * Styles for list
     */
    listStyle?: any;
    /**
     * down focus block on tv
     */
    blockFocusDown?: boolean;
    /**
     * right focus block on tv
     */
    blockFocusRight?: boolean;

    /**
     * left focus block on tv
     */
    blockFocusLeft?: boolean;

    /**
     * give some custom margin padding according to Tv details
     */
    isDetailsTvLayout?: boolean;
}

export const RelatedResourcesView = (props: RelatedResourcesViewProps): JSX.Element => {
    const {
        resource,
        type,
        relatedSectionHeader,
        listStyle,
        blockFocusDown,
        blockFocusLeft,
        blockFocusRight,
        isDetailsTvLayout,
    } = props;
    const navigation = useNavigation();
    const { width, height } = useDimensions().window;
    const { strings, appLanguage } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appConfig, appTheme } = prefs;
    let { appBaseStyles, appPadding } = appTheme!(prefs);
    const query = relatedQuery(appConfig, type, resource, appLanguage);
    let flatListRef = useRef<any>(undefined);
    const { resources, loading, error } = useRelatedResources(
        query,
        1,
        isDetailsTvLayout ? 30 : 25,
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
        ({ item, index }: { item: ResourceVm; index: number }) => (
            <StorefrontCardView
                resource={item}
                isPortrait={height > width}
                blockFocusDown={blockFocusDown}
                blockFocusLeft={blockFocusLeft ? index === 0 : false}
                blockFocusRight={blockFocusRight ? index === resources.length - 1 : false}
                onResourcePress={onResourcePress}
                fallbackAspectRatio={AspectRatio._16by9}
                containerSize={containerSize}
                cardsPreview={cardsPreview}
                isDetailsTvLayout={isDetailsTvLayout}
                shiftScrollToFocusIndex={
                    Platform.isTV
                        ? () => {
                              flatListRef.current.scrollToIndex({ animated: true, index });
                          }
                        : undefined
                }
            />
        ),
        [
            height,
            width,
            blockFocusDown,
            blockFocusLeft,
            blockFocusRight,
            resources.length,
            onResourcePress,
            containerSize,
            cardsPreview,
            isDetailsTvLayout,
        ],
    );

    const onResourcePress = React.useCallback(
        (tappedResource: ResourceVm) => {
            tappedResource.containerName = title;
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
            });
        },
        [navigation, title],
    );

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);

    return (
        <View style={styles.container}>
            {loading && (
                <View style={[listStyle && listStyle]}>
                    <SkeletonCatalogContainer
                        aspectRatio={AspectRatio._16by9}
                        showFooter
                        showContainerLabel
                        count={8}
                        containerSize={containerSize}
                        cardsPreview={cardsPreview}
                    />
                </View>
            )}

            {!loading && !error && resources.length > 0 && (
                <>
                    <Text style={[relatedSectionHeader ? relatedSectionHeader : appBaseStyles.sectionHeader]}>
                        {title}
                    </Text>
                    <View style={[listStyle ? listStyle : undefined]}>
                        <FlatList<ResourceVm>
                            testID={'resourceListView'}
                            horizontal={true}
                            numColumns={1}
                            ref={flatListRef}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={resources}
                            renderItem={renderResource}
                            keyExtractor={resourcesKeyExtractor}
                            removeClippedSubviews={false}
                            contentContainerStyle={[Platform.isTV ? undefined : styles.listContainer]}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource.id === nextProps.resource.id && prevProps.type === nextProps.type;
};

export default React.memo(RelatedResourcesView, propsAreEqual);

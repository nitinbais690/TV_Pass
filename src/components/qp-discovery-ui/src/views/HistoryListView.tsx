import React from 'react';
import { ListRenderItem, Text, StyleSheet, FlatList, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { ResourceCardViewBaseProps, ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AspectRatio, selectDeviceType, percentage } from 'qp-common-ui';
import StorefrontCardView from 'screens/components/StorefrontCardView';
import { RelatedType } from 'utils/RelatedUtils';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../../../AppStyles';
import SkeletonCatalogContainer from 'screens/components/loading/SkeletonCatalogContainer';

export { RelatedType };

export interface HistoryListViewProps {
    /**
     * items
     */
    historyList: any[];
    /**
     * items loading state
     */
    loading: boolean;
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

export const HistoryListView = (props: HistoryListViewProps): JSX.Element => {
    const { historyList, loading, cardProps = {} } = props;
    const { width, height } = useDimensions().window;
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
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
                    marginVertical: selectDeviceType({ Tablet: 10 }, 5),
                },
                listContainer: {
                    paddingBottom: 10,
                    paddingLeft: selectDeviceType({ Tablet: 40 }, 20),
                    paddingRight: appPadding.xs(true),
                },
                sectionHeader: {
                    marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
                    color: appColors.tertiary,
                    fontFamily: appFonts.primary,
                    fontSize: appFonts.xs,
                    paddingVertical: 10,
                },
            }),
        [appColors.tertiary, appPadding],
    );

    const renderResource = ({ item }: { item: ResourceVm }) => (
        <StorefrontCardView
            resource={item}
            isPortrait={height > width}
            onResourcePress={cardProps.onResourcePress}
            fallbackAspectRatio={AspectRatio._16by9}
            containerSize={containerSize}
            cardsPreview={selectDeviceType<number>({ Tv: 6.2, Tablet: 4.2 }, 3.15)}
        />
    );

    const resourcesKeyExtractor = React.useCallback((item: ResourceVm, index: number) => `r-${index}-${item.id}`, []);
    const cardsPreview = selectDeviceType<number>({ Tv: 6.2, Tablet: 4.2 }, 3.15);

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
            {!loading && historyList.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>{strings['content_usage.movie_view_history']}</Text>
                    <FlatList<ResourceVm>
                        testID={'historyListView'}
                        horizontal={true}
                        numColumns={1}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={historyList}
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

export default React.memo(HistoryListView);

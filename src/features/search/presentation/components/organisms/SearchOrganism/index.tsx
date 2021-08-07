import React from 'react';
import { AspectRatio, percentage, selectDeviceType } from 'qp-common-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { ResourceCardView, ResourceCardViewBaseProps, ResourceVm } from 'qp-discovery-ui';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { appPadding, isTablet } from 'core/styles/AppStyles';
import { searchCardStyles } from './style';
import ContentCardFooter from 'features/details/presentation/components/organisms/ContentCardFooter';
import CardTagsOverlay from 'features/discovery/presentation/components/molecules/CardTagsOverlay';

const ResourceListView = ({
    resources,
    onPress,
    onEndReached,
    onEndReachedThreshold,
    hasMore,
}: {
    resources: ResourceVm[];
    onPress: (_: ResourceVm, _position: number) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    hasMore?: boolean;
}): JSX.Element => {
    const { appLanguage } = useLocalization();
    const { width: w, height: h } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = h > w;

    const cardsPerRow = selectDeviceType({ Handset: 2 }, 2);
    const customPadding = isTablet ? 20 : 10;
    const listPadding = appPadding.sm(true) - customPadding / 2;
    const cellPadding = cardsPerRow * customPadding;

    const mh = selectDeviceType({ Tablet: isPortrait ? 0 : percentage<true>(15, true) }, 0);
    const width = w - 2 * mh - (cellPadding + 2 * listPadding);
    const fallbackAspectRatio = AspectRatio._16by9;

    const LoadingComponent = React.useMemo(() => <ActivityIndicator color={appColors.brandTint} size="small" />, [
        appColors.brandTint,
    ]);
    const containerStyles = StyleSheet.create({
        container: {
            paddingHorizontal: listPadding,
            paddingBottom: listPadding,
        },
    });
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item, index }: { item: ResourceVm; index: number }): JSX.Element => {
            const genres = (item.contentGenre && item.contentGenre[appLanguage]) || [];
            const genreString = genres.join(', ');
            const metaInfo = [];
            if (item.releaseYear) {
                metaInfo.push(item.releaseYear);
            }
            if (genreString) {
                metaInfo.push(genreString);
            }
            if (item.formattedRunningTime) {
                metaInfo.push(item.formattedRunningTime);
            }
            const aspectRatio = item.aspectRatio || fallbackAspectRatio;
            const cardStyle = searchCardStyles(width, cardsPerRow, customPadding, aspectRatio, appColors);
            const cardProps: ResourceCardViewBaseProps<ResourceVm> = {
                cardStyle: cardStyle,
                underlayColor: 'black',
                activeOpacity: 0.5,
            };
            return (
                <ResourceCardView
                    isPortrait={isPortrait}
                    resource={item}
                    hideGradient={true}
                    {...cardProps}
                    cardStyle={cardStyle}
                    onResourcePress={() => onPress(item, index)}
                    cardImageType={item.imageType}
                    cardAspectRatio={aspectRatio}
                    footerView={
                        <ContentCardFooter resource={item} rating={item.allRatings && Object.values(item.allRatings)} />
                    }
                    overlayView={<CardTagsOverlay isOriginals={item.isOriginals} isPremium={!item.isFreeContent} />}
                />
            );
        },
        [appLanguage, fallbackAspectRatio, width, cardsPerRow, customPadding, appColors, isPortrait, onPress],
    );

    return (
        <FlatList<ResourceVm>
            accessibilityLabel={'Collection'}
            keyExtractor={resourcesKeyExtractor}
            horizontal={false}
            numColumns={cardsPerRow}
            key={isPortrait ? 'p' : 'l'}
            showsHorizontalScrollIndicator={false}
            data={resources}
            renderItem={defaultRenderResource}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListFooterComponent={hasMore ? LoadingComponent : undefined}
            contentContainerStyle={containerStyles.container}
        />
    );
};

export default ResourceListView;

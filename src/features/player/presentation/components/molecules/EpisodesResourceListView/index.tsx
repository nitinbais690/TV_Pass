import React from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';

import { ResizableImage, ResourceVm } from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';
import LinearGradient from 'react-native-linear-gradient';
import PlayInline from 'assets/images/play_inline.svg';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { episodesResourceListStyle } from './style';

export const EpisodesResourceListView = ({
    resources,
    onResourcePress,
    onEndReached,
    onEndReachedThreshold,
}: {
    resources: ResourceVm[];
    onResourcePress: (resource: ResourceVm) => void;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    episodeNumber: number | undefined;
}): JSX.Element => {
    const appColors = useAppColors();

    const styles = episodesResourceListStyle(appColors);
    const OverlayView = () => {
        return (
            <View style={styles.overlayContainer}>
                <LinearGradient colors={['transparent', 'rgb(0, 0, 0)']} style={styles.gradient} />
            </View>
        );
    };
    const resourcesKeyExtractor = React.useCallback((item: ResourceVm) => `r-${item.id}`, []);
    const defaultRenderResource = React.useCallback(
        ({ item }: { item: ResourceVm }): JSX.Element => {
            return (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                        onResourcePress(item);
                    }}>
                    <View style={styles.container}>
                        <View style={styles.imageWrapper}>
                            <ResizableImage
                                keyId={item.id}
                                aspectRatioKey={AspectRatio._16by9}
                                imageType={ImageType.Poster}
                                style={styles.image}
                            />
                            <View style={[styles.overviewWrapperStyle]}>
                                <OverlayView />
                            </View>
                            <PlayInline style={styles.inlinePlay} />
                        </View>
                        <Text style={styles.episodesItemText}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <FlatList<ResourceVm>
            keyExtractor={resourcesKeyExtractor}
            showsVerticalScrollIndicator={false}
            data={resources}
            horizontal={true}
            renderItem={defaultRenderResource}
            contentContainerStyle={styles.listContainer}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
        />
    );
};

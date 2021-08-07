import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AspectRatio } from 'qp-common-ui';
import { CardSize, CardLayout } from 'qp-discovery-ui';
import { cardWidth, cardPadding } from 'screens/components/StorefrontCardView';

export interface SkeletonCardProps {
    aspectRatio: AspectRatio;
    showFooter?: boolean;
    layout?: CardLayout;
    size?: CardSize;
    footerLabelsCount?: number;
    cardWidth?: number;
    gridMode?: boolean;
    lastItemInRow?: boolean;
    containerSize?: { width: number; height: number };
    cardsPreview?: number;
    viewAllAspectRatio?: number;
}

const SkeletonCard = (props: SkeletonCardProps) => {
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    const { appTheme, catalogCardsPreview } = prefs;
    let { appColors } = appTheme!(prefs);
    const isPortait = height > width;
    const cardW = props.cardWidth
        ? props.cardWidth
        : cardWidth(
              isPortait,
              props.aspectRatio,
              props.cardsPreview ? props.cardsPreview : catalogCardsPreview,
              cardPadding(isPortait, props.layout),
              props.layout,
              props.size,
              props.containerSize,
          );
    let footerHeight = 0;
    if (props.showFooter) {
        footerHeight = props.viewAllAspectRatio
            ? 0
            : props.footerLabelsCount === 2
            ? 90
            : props.footerLabelsCount === 3
            ? 100
            : 43;
    }
    const aspectRatio = props.viewAllAspectRatio ? props.viewAllAspectRatio : props.aspectRatio;
    const cardH = cardW / aspectRatio + footerHeight;

    const styles = StyleSheet.create({
        container: {
            borderRadius: 22,
            overflow: 'hidden',
            width: cardW,
            height: cardH,
            marginRight: props.gridMode ? 10 / 2 : 10,
            marginLeft: props.gridMode ? 10 / 2 : 0,
        },
        card: {
            position: 'relative',
            width: cardW,
            height: cardH,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: 22,
        },
        footer: { position: 'absolute', left: 0, right: 0, bottom: 0, height: footerHeight },
        pillContainer: { position: 'absolute', left: 13, right: 13 },
        pill: { width: 28, height: 18, borderRadius: 12, position: 'absolute', backgroundColor: appColors.caption },
        title: {
            width: 100,
            height: 11,
            top: 15,
            position: 'absolute',
            borderRadius: 2,
            backgroundColor: appColors.caption,
        },
        caption: {
            width: 80,
            height: 8,
            position: 'absolute',
            borderRadius: 2,
            top: 32,
            backgroundColor: appColors.caption,
        },
    });
    return (
        <View style={styles.container}>
            <View style={styles.card} />
            {props.layout === 'banner' && (
                <View style={[styles.pillContainer, { bottom: 10 }]}>
                    <View style={[styles.pill, { left: 0, bottom: 0 }]} />
                    <View style={[styles.pill, { right: 0, bottom: 0 }]} />
                </View>
            )}
            {props.showFooter && props.viewAllAspectRatio === undefined && (
                <View style={styles.footer}>
                    <View style={[styles.pillContainer, { top: 30 }]}>
                        <View style={[styles.pill, { left: 0, bottom: 0 }]} />
                        <View style={[styles.pill, { right: 0, bottom: 0 }]} />
                    </View>
                    {props.footerLabelsCount && props.footerLabelsCount > 1 && (
                        <View style={[styles.pillContainer, { top: 30, bottom: 0 }]}>
                            <>
                                <View style={styles.title} />
                                <View style={[styles.caption, { top: 32 }]} />
                                {props.footerLabelsCount === 3 && (
                                    <View style={[styles.caption, { width: 60, top: 45 }]} />
                                )}
                            </>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default React.memo(SkeletonCard);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { AspectRatio } from 'qp-common-ui';
import { CardSize, CardLayout } from 'qp-discovery-ui';
import { appPadding } from '../../../../AppStyles';

export interface SkeletonSearchProps {
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
}

const SkeletonSearch = () => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme!(prefs);
    const skeletonStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    paddingHorizontal: appPadding.sm(true),
                    paddingVertical: 16, // We want same vertical spacing on tablets, so this shld be hard-coded
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: appColors.border,
                    backgroundColor: appColors.primaryVariant1,
                },
                imageWrapper: {
                    width: '40%',
                    aspectRatio: AspectRatio._16by9,
                    borderRadius: 5,
                    backgroundColor: appColors.caption,
                },
                textContainer: {
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginHorizontal: appPadding.sm(true),
                },
                pillContainer: { left: 6, right: 0, bottom: 6, position: 'absolute', margin: 2 },
                pill: {
                    width: 22,
                    height: 12,
                    borderRadius: 12,
                    position: 'absolute',
                    backgroundColor: appColors.caption,
                },
                titleTypography: {
                    backgroundColor: appColors.caption,
                    width: 100,
                    height: 10,
                },
                captionTypography: {
                    backgroundColor: appColors.caption,
                    width: 150,
                    height: 8,
                    marginTop: 5,
                    marginBottom: 50,
                },
                bottomTypography: {
                    backgroundColor: appColors.caption,
                    width: 100,
                    height: 8,
                },
            }),
        [appColors.border, appColors.caption, appColors.primaryVariant1],
    );

    return (
        <View style={skeletonStyle.container}>
            <View style={skeletonStyle.imageWrapper}>
                <View style={[skeletonStyle.pillContainer, { top: 30 }]}>
                    <View style={[skeletonStyle.pill, { left: 0, bottom: 0 }]} />
                </View>
            </View>
            <View style={skeletonStyle.textContainer}>
                <View>
                    <View style={[skeletonStyle.titleTypography]} />
                    <View style={[skeletonStyle.captionTypography]} />
                </View>
                <View style={[skeletonStyle.bottomTypography]} />
            </View>
        </View>
    );
};

export default React.memo(SkeletonSearch);

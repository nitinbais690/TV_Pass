import React, { useState } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { useFetchTVSeriesQuery } from '../hooks/useFetchTVSeriesQuery';
import { colors, padding, typography } from 'qp-common-ui';
import { ResourceVm } from '../models/ViewModels';
import MaterialTabs from 'react-native-material-tabs';

const defaultContainerStyle = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: colors.primary,
        marginTop: padding.xs(),
    },
    barWrapperStyle: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: colors.captionLight,
    },
    labelStyle: {
        ...typography.sectionHeader,
        color: colors.secondary,
        alignSelf: 'flex-start',
        paddingLeft: 0,
        width: 'auto',
    },
});

export interface SeasonsTabBarContainerStyle {
    /**
     * The style of the tab container
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the material tab bar wrapper
     */
    barWrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style of the tab label
     */
    labelStyle?: StyleProp<TextStyle>;
}
export interface TabBarStyle {
    /**
     * The color of the tab bar
     */
    barColor?: string;
    /**
     * The height of the tab bar
     */
    barHeight?: number;
    /**
     * The color of bottom indicator
     */
    indicatorColor?: string;
    /**
     * The color of the active text
     */
    activeTextColor?: string;
    /**
     * The color of the inactive text
     */
    inactiveTextColor?: string;
    /**
     * The style of the active text
     */
    activeTextStyle?: string;
}
export interface SeasonsTabViewProps {
    /**
     * Resource Id
     */
    resourceId: string;
    /**
     * Resource type
     */
    resourceType: string;
    /**
     * Page number
     */
    pageNumber?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Rendered when the list is loading.
     */
    ListLoadingComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Rendered when the list has an error.
     */
    ListErrorComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * The style of seasons tab view
     */
    containerStyle?: SeasonsTabBarContainerStyle;
    /**
     * The style of the tab bar
     */
    tabBarStyle: TabBarStyle;
    /**
     * The component to be rendered
     */
    renderPage: (resource: ResourceVm) => React.ReactNode;
}

export const SeasonsTabView = (props: SeasonsTabViewProps): JSX.Element => {
    const {
        resourceId,
        resourceType,
        pageSize,
        pageNumber,
        ListLoadingComponent,
        ListErrorComponent,
        containerStyle = {},
        renderPage,
        tabBarStyle,
    } = props;
    const { loading, error, seasons } = useFetchTVSeriesQuery(resourceId, resourceType, pageSize, pageNumber);
    const [selectedTab, setSelectedTab] = useState(0);
    const routes = seasons.map(season => {
        const seasonNumber = season.seasonNumber;
        return {
            key: seasonNumber,
            title: 'Season ' + seasonNumber,
            testID: seasonNumber,
            accessibilityLabel: 'Season ' + seasonNumber + ' Tab',
        };
    });

    const renderScene = (seasonNumber: number) => {
        const season = seasons[seasonNumber];
        return renderPage(season);
    };
    return (
        <>
            {loading && ListLoadingComponent}

            {error && ListErrorComponent}

            {!loading && !error && (
                <View style={[defaultContainerStyle.containerStyle, containerStyle.containerStyle]}>
                    <View style={[defaultContainerStyle.barWrapperStyle, containerStyle.barWrapperStyle]}>
                        <MaterialTabs
                            barHeight={tabBarStyle.barHeight}
                            allowFontScaling={false}
                            scrollable={true}
                            items={routes.map(i => i.title)}
                            selectedIndex={selectedTab}
                            onChange={setSelectedTab}
                            barColor={tabBarStyle.barColor}
                            indicatorColor={tabBarStyle.indicatorColor}
                            activeTextColor={tabBarStyle.activeTextColor}
                            inactiveTextColor={tabBarStyle.inactiveTextColor}
                            textStyle={[defaultContainerStyle.labelStyle, containerStyle.labelStyle]}
                        />
                    </View>
                    {renderScene(selectedTab)}
                </View>
            )}
        </>
    );
};
const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resourceId === nextProps.resourceId;
};

export default React.memo(SeasonsTabView, propsAreEqual);

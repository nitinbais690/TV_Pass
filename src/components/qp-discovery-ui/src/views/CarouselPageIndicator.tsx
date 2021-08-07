import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { scale } from 'qp-common-ui';

const defaultIndicator = StyleSheet.create({
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    pageStyle: {
        width: scale(16),
        height: scale(2),
        borderRadius: scale(5),
        backgroundColor: '#BDBDBD',
        marginHorizontal: scale(5),
    },
    activePageStyle: {
        width: scale(16),
        height: scale(2),
        borderRadius: scale(5),
        backgroundColor: '#333333',
        marginHorizontal: scale(5),
    },
});

export interface IndicatorPageBaseProps {
    /*
     * Active page to be indicated on the list of pages
     * default value is 0
     */
    activeIndexPage?: number;
    /*
     * Style of the container holding the pages
     * Default style is a flex below the highlights carousel
     */
    containerStyle?: StyleProp<ViewStyle>;
    /*
     * Style of the pages denoting the carousel elements
     * Default style is grey dots
     */
    pageStyle?: StyleProp<ViewStyle>;
    /*
     * Style of the active carousel in the list of carousel page
     */
    activePageStyle?: StyleProp<ViewStyle>;
}

export interface IndicatorPageProps extends IndicatorPageBaseProps {
    /*
     *   Number of pages to be indicated below the highlights carousel
     */
    numberOfPages: number;
}

export const CarouselPageIndicator = (props: IndicatorPageProps): JSX.Element | null => {
    const activeIndexPage = props.activeIndexPage || 0;
    const numberOfPages = props.numberOfPages || 0;
    const containerStyle = props.containerStyle || defaultIndicator.containerStyle;
    const pageStyle = props.pageStyle || defaultIndicator.pageStyle;
    const activePageStyle = props.activePageStyle || defaultIndicator.activePageStyle;

    if (numberOfPages === 0) {
        return null;
    }

    const activeIndex = activeIndexPage < numberOfPages ? activeIndexPage : activeIndexPage % numberOfPages;
    const pagesView = [...Array(numberOfPages).keys()].map(i => {
        return <View style={i === activeIndex ? activePageStyle : pageStyle} key={i} />;
    });

    return (
        <View testID={'pageIndicator'} style={[containerStyle]}>
            {pagesView}
        </View>
    );
};

import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Platform, View, useTVEventHandler } from 'react-native';
import { ResourceVm } from 'qp-discovery-ui';
import Carousel, { getInputRangeFromIndexes, Pagination } from 'react-native-snap-carousel';
import { useRoute } from '@react-navigation/native';
import HeroCarouselCardTV from './HeroCarouselCardTV';
import AppContant from '../../utils/AppContant';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
// const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const TRANSLATE_VALUE = Math.round((SLIDER_WIDTH * 1) / 1.2);

const StorefrontCarousel = ({
    resources,
    initialHasTVPreferredFocus,
}: {
    resources: ResourceVm[];
    // isPortrait: boolean;
    onResourcePress?: (resource: ResourceVm) => void;
    // fallbackAspectRatio?: AspectRatio;
    // containerSize?: { width: number; height: number };
    // cardsPreview?: number;
    // gridMode?: boolean;
    // handleFocusShift?: () => void;
    initialHasTVPreferredFocus?: boolean;
}): JSX.Element => {
    const { height } = Dimensions.get('window');
    const route = useRoute();
    const carouselRef = useRef(null);

    const [carouselIndex, setCarouselIndex] = useState(0);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    zIndex: -1,
                    width: '100%',
                    height: height,
                    marginBottom: -(height * 0.15),
                    position: 'relative',
                },
                paginationContainer: {
                    position: 'absolute',
                    alignSelf: 'center',
                    ...Platform.select({
                        ios: { bottom: 180 },
                        android: { bottom: 95 },
                    }),
                },
                dot: {
                    width: Platform.OS === 'ios' ? 20 : 15,
                    height: Platform.OS === 'ios' ? 20 : 15,
                    borderRadius: 10,
                    marginHorizontal: -5,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const myTVEventHandler = (evt: { eventType: string }) => {
        if (evt.eventType === AppContant.down) {
        } else if (evt.eventType === AppContant.left) {
            // setHasMenuFocus(true);
            // setInitialHasTVPreferredFocusOnCarousel(false);
            if (carouselIndex === 0) {
                // setHasMenuFocus(true);
            } else {
                // carouselRef.current.snapToPrev();
            }
        } else if (evt.eventType === AppContant.right) {
            // carouselRef.current.snapToNext();
        }
    };

    useTVEventHandler(myTVEventHandler);

    const scrollInterpolator = (index, carouselProps) => {
        const range = [1, 0, -1];
        const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
        const outputRange = range;

        return { inputRange, outputRange };
    };
    const animatedStyles = (index, animatedValue, carouselProps) => {
        const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';
        let animatedOpacity = {};
        let animatedTransform = {};

        if (carouselProps.inactiveSlideOpacity < 1) {
            animatedOpacity = {
                opacity: animatedValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0, 1, 0],
                }),
            };
        }

        if (carouselProps.inactiveSlideScale < 1) {
            animatedTransform = {
                transform: [
                    {
                        [translateProp]: animatedValue.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [
                                TRANSLATE_VALUE * carouselProps.inactiveSlideScale,
                                0,
                                -TRANSLATE_VALUE * carouselProps.inactiveSlideScale,
                            ],
                        }),
                    },
                ],
            };
        }

        return {
            ...animatedOpacity,
            ...animatedTransform,
        };
    };

    const renderItem = ({ item, index }: { item: ResourceVm; index: number }) => {
        return (
            <HeroCarouselCardTV
                itemKey={item.id}
                resource={item}
                index={index}
                route={route.name}
                hasTVPreferredFocus={initialHasTVPreferredFocus}
            />
        );
    };

    const pagination = slides => {
        return (
            <Pagination
                dotsLength={slides.length}
                activeDotIndex={carouselIndex}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.dot}
                inactiveDotStyle={
                    {
                        // Define styles for inactive dots here
                    }
                }
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                data={resources}
                renderItem={renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                slideStyle={{ width: ITEM_WIDTH }}
                loop={true}
                autoplay={true}
                // loopClonesPerSide={resources.length}
                lockScrollWhileSnapping={true}
                autoplayInterval={9800}
                inactiveSlideShift={0}
                onScrollIndexChanged={index => setCarouselIndex(index)}
                scrollInterpolator={scrollInterpolator}
                slideInterpolatedStyle={animatedStyles}
                removeClippedSubviews={true}
                useScrollView={true}
            />
            {pagination(resources)}
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resources === nextProps.resources;
};

export default React.memo(StorefrontCarousel, propsAreEqual);

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AspectRatio, ImageType, scale, selectDeviceType } from 'qp-common-ui';
import { ResizableImage, CarouselView } from 'qp-discovery-ui';
import { useDimensions } from '@react-native-community/hooks';
import { useAppState } from 'utils/AppContextProvider';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import Button from '../components/Button';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { appDimensions, appFonts } from '../../../AppStyles';
import { authHomeStyle } from '../../styles/AuthHome.style';
import {
    ActionEvents,
    Attributes,
    getPageEventFromPageNavigation,
    getPageIdsFromPageEvents,
} from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';

interface CarouselMetadata {
    id: number;
    title: string;
    url: string;
}

export const carouselMetadata = (appConfig: AppConfig | undefined) => {
    if (!(appConfig && appConfig.marketingCarousel)) {
        return [];
    }

    try {
        const carouselJsonString = global.Buffer.from(appConfig.marketingCarousel, 'base64').toString('ascii');
        const carouselJson = JSON.parse(carouselJsonString) as CarouselMetadata[];
        return carouselJson;
    } catch (e) {
        console.error('[Splash Carousel] Error parsing carousel meta-data: ', e);
    }
    return [];
};

const AuthHomeScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const [activeIndex, updateActiveIndex] = useState<number>(0);
    const { appNavigationState, previewApp } = useAppState();
    const { strings }: any = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    let { appColors, appPadding } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const formStyles = authHomeStyle({ appColors, isPortrait });
    const { recordEvent } = useAnalytics();

    const cardPadding = 20;
    const cardWidth = width - 2 * appPadding.sm(true);
    const cardSnapWidth = cardWidth + cardPadding / 2;
    const aspectRatio = selectDeviceType({ Handset: AspectRatio._16by9 }, AspectRatio._3by1);
    const cardRadius = 57;

    const style = StyleSheet.create({
        container: {
            height: '100%',
            marginVertical: 10,
            position: 'absolute',
            justifyContent: selectDeviceType({ Tablet: 'center' }, 'space-evenly'),
            paddingTop: selectDeviceType({ Tablet: 0 }, appPadding.sm(true)),
        },
        headerContentContainer: {
            marginHorizontal: selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
            minHeight: selectDeviceType({ Tablet: isPortrait ? 180 : 120 }, 160),
        },
        contentContainer: {
            justifyContent: selectDeviceType({ Tablet: isPortrait ? 'space-evenly' : 'center' }, 'space-evenly'),
            marginTop: selectDeviceType({ Tablet: isPortrait ? appPadding.md(true) : appPadding.xxs(true) }, 0),
            marginHorizontal: selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
            minHeight: selectDeviceType({ Tablet: isPortrait ? 180 : 120 }, 160),
        },
        serviceImageWrapper: {
            // width: '100%',
            // flexShrink: 1,
            // backgroundColor: 'transparent',
            marginVertical: 10,
        },
        carousel: {
            aspectRatio: aspectRatio,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: selectDeviceType({ Tablet: cardRadius }, appDimensions.cardRadius),
            marginVertical: 10,
            marginHorizontal: cardPadding / 4,
            width: cardWidth,
            shadowOffset: { width: 0, height: 2 },
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 2,
        },
        carouselImageWrapper: {
            overflow: 'hidden',
            borderRadius: selectDeviceType({ Tablet: cardRadius }, appDimensions.cardRadius),
        },
        carouselImage: {
            aspectRatio: aspectRatio,
            width: cardWidth,
        },
        footerStyle: {
            bottom: 0,
            paddingHorizontal: selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
        },
        clickableColor: {
            color: appColors.brandTint,
        },
        middleComponent: {
            marginTop: selectDeviceType({ Tablet: 5 }, 10),
        },
        caption: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            marginHorizontal: appPadding.xxs(true),
            fontSize: selectDeviceType({ Handset: scale(12, 0) }, scale(14, 0)),
        },
    });

    const openBrowser = (title: string) => {
        try {
            navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                type: title,
            });
        } catch (error) {
            console.log(`[InAppBrowser] Error loading url: ${title}`, error);
        }
    };

    const keyExtractor = React.useCallback((item, index) => item.id + '_' + index, []);

    const resourceItemLayout = React.useCallback(
        (_data: any, index: number): { length: number; offset: number; index: number } => ({
            length: cardSnapWidth,
            offset: cardSnapWidth * index,
            index,
        }),
        [cardSnapWidth],
    );
    const subscriptionCarouselMetadata = (appConfig: AppConfig | undefined) => {
        if (!(appConfig && appConfig.subscriptionCarousel)) {
            return [];
        }

        try {
            const subscriptionCarousel: string = appConfig.subscriptionCarousel;
            const imageList = subscriptionCarousel.split(',').map(function(item) {
                return item.trim();
            });
            return imageList;
        } catch (e) {
            console.error('[Splash Carousel] Error parsing carousel meta-data: ', e);
        }
        return [];
    };

    const pages = subscriptionCarouselMetadata(appConfig);

    useEffect(() => {
        let data: Attributes = {};

        let pageEvents = getPageEventFromPageNavigation(NAVIGATION_TYPE.AUTH_HOME);
        data.pageID = getPageIdsFromPageEvents(pageEvents);
        data.event = pageEvents;

        recordEvent(pageEvents, data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BackgroundGradient insetHeader={false}>
            <View style={style.container}>
                <View style={formStyles.mainTextContainer}>
                    <View style={style.headerContentContainer}>
                        <Text style={[formStyles.largeText, formStyles.titleText]}>
                            {strings['main.title.' + (activeIndex % pages.length)]}
                        </Text>
                        <Text style={[formStyles.largeText]}>
                            {strings['main.text.' + (activeIndex % pages.length)]}
                        </Text>
                    </View>
                </View>
                <View style={style.middleComponent}>
                    <View style={style.serviceImageWrapper}>
                        <CarouselView
                            keyExtractor={keyExtractor}
                            data={pages}
                            autoplay
                            loop
                            autoplayInterval={5000}
                            initialScrollIndex={0}
                            snapToInterval={cardSnapWidth}
                            getItemLayout={resourceItemLayout}
                            viewScrollOffset={appPadding.sm(true)}
                            isPortrait={isPortrait}
                            renderItem={({ item }) => (
                                <View style={style.carousel}>
                                    <View style={style.carouselImageWrapper}>
                                        <ResizableImage
                                            isPortrait={isPortrait}
                                            style={style.carouselImage}
                                            keyId={item}
                                            imageType={ImageType.Poster}
                                            aspectRatioKey={aspectRatio}
                                            width={cardWidth}
                                            height={cardWidth / aspectRatio}
                                        />
                                    </View>
                                </View>
                            )}
                            onIndexChange={updateActiveIndex}
                        />
                    </View>
                    <View style={style.contentContainer}>
                        <View style={formStyles.buttonWrapper}>
                            <Button
                                title={strings['main.signup']}
                                onPress={() => {
                                    navigation.navigate(NAVIGATION_TYPE.PLAN_INFO);
                                }}
                            />
                            {appNavigationState !== 'PREVIEW_APP' && (
                                <Button
                                    type={'clear'}
                                    title={strings['main.preview']}
                                    onPress={() => {
                                        let data: Attributes = {};
                                        data.event = ActionEvents.ACTION_PREVIEW_SCREEN;
                                        recordEvent(ActionEvents.ACTION_PREVIEW_SCREEN, data);
                                        previewApp();
                                    }}
                                    containerStyle={formStyles.previewButton}
                                />
                            )}
                        </View>
                    </View>
                </View>
                <View style={[formStyles.footer, style.footerStyle]}>
                    <Text style={style.caption}>
                        {strings['main.disclaimer.1']}
                        <Text
                            onPress={() => openBrowser('termsCondition')}
                            style={[style.caption, style.clickableColor]}>
                            {strings['main.terms']}
                        </Text>
                        <Text style={style.caption}>{strings['main.disclaimer.2']} </Text>
                        <Text
                            onPress={() => openBrowser('privacyPolicy')}
                            style={[style.caption, style.clickableColor]}>
                            {strings['main.privacy']}
                        </Text>
                        <Text style={style.caption}>{strings['main.disclaimer.3']} </Text>
                        <Text
                            onPress={() => navigation.navigate(NAVIGATION_TYPE.HELP)}
                            style={[style.caption, style.clickableColor]}>
                            {strings['main.help']}
                        </Text>
                        <Text style={style.caption}>{strings['main.disclaimer.4']} </Text>
                    </Text>
                </View>
            </View>
        </BackgroundGradient>
    );
};

export default AuthHomeScreen;

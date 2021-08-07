import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { AspectRatio, ImageType, scale, selectDeviceType } from 'qp-common-ui';
import { CarouselView, ResizableImage } from 'qp-discovery-ui';
import { useDimensions } from '@react-native-community/hooks';
import { useAppState } from 'utils/AppContextProvider';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import FocusButton from '../components/FocusButton';
import Button from '../components/Button';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { appDimensions, appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import { authHomeStyle } from '../../styles/AuthHome.style';
import { BrandLogoTV } from 'screens/components/BrandLogo';
import LoginBackground from '../../../assets/images/LoginBackground.svg';
import LinearGradient from 'react-native-linear-gradient';

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

    const cardPadding = 20;
    const cardWidth = width - 2 * appPadding.sm(true);
    const cardSnapWidth = cardWidth + cardPadding / 2;
    const aspectRatio = selectDeviceType({ Handset: AspectRatio._16by9 }, AspectRatio._3by1);
    const cardRadius = 57;

    const style = StyleSheet.create({
        container: {
            height: '100%',
            marginVertical: Platform.isTV ? 0 : 10,
            position: 'absolute',
            justifyContent: selectDeviceType({ Tablet: 'center', Tv: 'flex-start' }, 'space-evenly'),
            paddingTop: selectDeviceType({ Tablet: 0, Tv: tvPixelSizeForLayout(86) }, appPadding.sm(true)),
            paddingLeft: selectDeviceType({ Tv: tvPixelSizeForLayout(160) }, 0),
        },
        headerContentContainer: {
            marginHorizontal: selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
            ...Platform.select({
                ios: { minHeight: selectDeviceType({ Tablet: isPortrait ? 180 : 120 }, 160) },
                android: { minHeight: selectDeviceType({ Tablet: isPortrait ? 200 : 120 }, 190) },
            }),
        },
        logoContainer: {
            marginBottom: tvPixelSizeForLayout(88),
            width: 100,
        },
        contentContainer: {
            justifyContent: selectDeviceType({ Tablet: isPortrait ? 'space-evenly' : 'center' }, 'space-evenly'),
            marginTop: selectDeviceType({ Tablet: isPortrait ? appPadding.md(true) : appPadding.xxs(true) }, 0),
            marginHorizontal: Platform.isTV
                ? 0
                : selectDeviceType({ Tablet: appPadding.lg(true) }, appPadding.sm(true)),
            minHeight: selectDeviceType({ Tablet: isPortrait ? 180 : 120 }, 160),
            width: Platform.isTV ? tvPixelSizeForLayout(452) : undefined,
        },
        serviceImageWrapper: {
            // width: '100%',
            // flexShrink: 1,
            // backgroundColor: 'transparent',
            marginVertical: 10,
            backgroundColor: 'transparent',
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
            borderRadius: selectDeviceType({ Tv: 15 }, 0),
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
        tvImagesContainer: {
            width: tvPixelSizeForLayout(1200),
            flexShrink: 1,
            flexDirection: 'row',
            marginTop: tvPixelSizeForLayout(58),
        },
        tvImageWrapper: {
            overflow: 'hidden',
            backgroundColor: 'transparent',
            borderRadius: tvPixelSizeForLayout(24),
            marginRight: tvPixelSizeForLayout(20),
        },
        tvCarouselImage: {
            aspectRatio: AspectRatio._2by3,
            width: cardWidth,
            height: Platform.OS === 'ios' ? 300 : 150,
            borderRadius: selectDeviceType({ Tv: 20 }, 0),
            overflow: 'hidden',
            backgroundColor: 'transparent',
        },
        imageStyle: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            aspectRatio: AspectRatio._16by9,
            backgroundColor: appColors.primaryVariant2,
            position: 'absolute',
            right: 0,
            zIndex: -2,
        },
        linearGradientStyle: {
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        buttonContainer: {
            marginVertical: tvPixelSizeForLayout(30),
        },
    });

    const openBrowser = (title: string) => {
        if (!Platform.isTV) {
            try {
                navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                    type: title,
                });
            } catch (error) {
                console.log(`[InAppBrowser] Error loading url: ${title}`, error);
            }
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
    const channelImages: string[] = [
        require('../../../assets/images/Wonder.png'),
        require('../../../assets/images/GustoTV.png'),
        require('../../../assets/images/IndieFlix.png'),
        require('../../../assets/images/Kocowa.png'),
    ];

    //34897487-3192-465F-8CC8-3114AC473E5A
    //BE1E36D9-738D-4FD3-AE90-40184C9FEACF
    //3F6CAB61-AB79-410A-92DE-B1CD0EF7DEBD
    //5D5A47C9-2109-43C5-9947-C34A47B25674
    return (
        <BackgroundGradient insetHeader={false} horizontal={true} sideImageReveal={true}>
            {Platform.isTV && (
                <>
                    <View style={{ transform: [{ rotateY: '180deg' }] }}>
                        <LoginBackground height={'100%'} width={'100%'} />
                    </View>

                    <LinearGradient
                        colors={[appColors.primary, appColors.primaryVariant4]}
                        useAngle={true}
                        angle={90}
                        locations={[0.4, 0.6]}
                        style={[style.linearGradientStyle]}
                    />
                </>
            )}
            <View style={style.container}>
                {Platform.isTV ? (
                    <>
                        <View style={style.logoContainer}>
                            <BrandLogoTV height={tvPixelSizeForLayout(80)} width={tvPixelSizeForLayout(425)} />
                        </View>
                        <View style={formStyles.mainTextContainerTV}>
                            <Text style={[formStyles.largeText]}>
                                {strings['main.title_tv1']}
                                <Text style={[formStyles.largeText, formStyles.titleText]}>
                                    {strings['main.title_tv2']}
                                </Text>
                            </Text>
                        </View>
                        <View style={style.tvImagesContainer}>
                            <CarouselView
                                keyExtractor={keyExtractor}
                                data={channelImages}
                                autoplay
                                autoplayInterval={5000}
                                initialScrollIndex={0}
                                snapToInterval={cardSnapWidth}
                                getItemLayout={resourceItemLayout}
                                viewScrollOffset={appPadding.sm(true)}
                                isPortrait={isPortrait}
                                renderItem={({ item }) => (
                                    <View style={[style.tvImageWrapper]}>
                                        <Image
                                            style={{
                                                width: tvPixelSizeForLayout(168),
                                                height: tvPixelSizeForLayout(95),
                                            }}
                                            source={item}
                                        />
                                        {/* <ResizableImage
                                            isPortrait={isPortrait}
                                            style={style.tvCarouselImage}
                                            keyId={item}
                                            imageType={ImageType.Poster}
                                            aspectRatioKey={AspectRatio._16by9}
                                            width={cardWidth}
                                            height={cardWidth / aspectRatio}
                                        /> */}
                                    </View>
                                )}
                                onIndexChange={updateActiveIndex}
                            />
                        </View>
                        <View style={style.contentContainer}>
                            <View style={formStyles.buttonWrapper}>
                                <FocusButton
                                    title={strings['main.signupTv']}
                                    onPress={() => {
                                        navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_UP);
                                    }}
                                    blockFocusUp={true}
                                />
                                {Platform.isTV && (
                                    <View style={style.buttonContainer}>
                                        <FocusButton
                                            title={strings['main.login']}
                                            onPress={() => navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_IN_TV)}
                                        />
                                    </View>
                                )}
                                {Platform.isTV && Platform.OS === 'ios' && (
                                    <FocusButton
                                        title={strings['main.restorItunesTv']}
                                        onPress={() => {}}
                                        blockFocusDown={true}
                                    />
                                )}
                                {appNavigationState !== 'PREVIEW_APP' && !Platform.isTV && (
                                    <Button
                                        type={'clear'}
                                        title={strings['main.preview']}
                                        onPress={() => previewApp()}
                                        containerStyle={formStyles.previewButton}
                                    />
                                )}
                            </View>
                        </View>
                    </>
                ) : (
                    <>
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
                                        type={'solid'}
                                        title={strings['main.signup']}
                                        onPress={() => {
                                            navigation.navigate(NAVIGATION_TYPE.AUTH_SIGN_UP);
                                        }}
                                    />
                                    {appNavigationState !== 'PREVIEW_APP' && (
                                        <Button
                                            type={'clear'}
                                            title={strings['main.preview']}
                                            onPress={() => previewApp()}
                                            containerStyle={formStyles.previewButton}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </>
                )}
                {!Platform.isTV && (
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
                )}
            </View>
        </BackgroundGradient>
    );
};

export default AuthHomeScreen;

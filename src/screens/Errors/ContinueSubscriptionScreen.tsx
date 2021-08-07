import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { ResizableImage } from 'qp-discovery-ui';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useIAPState } from 'utils/IAPContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { routeToPurchaseConfirmation } from 'utils/NavigationUtils';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { appDimensions, appFonts } from '../../../AppStyles';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { authHomeStyle } from 'styles/AuthHome.style';
import { CarouselView } from '../../components/qp-discovery-ui/src/views/CarouselView';
import Button from 'screens/components/Button';

const ContinueSubscriptionScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const { product, transactionSuccess } = useIAPState();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme, appConfig } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
    const { accountProfile } = useAuth();
    const isPortrait = height > width;
    const formStyles = authHomeStyle({ appColors, isPortrait });
    const cardPadding = 20;
    const cardWidth = width - 2 * appPadding.sm(true);
    const cardSnapWidth = cardWidth + cardPadding / 2;
    const aspectRatio = isPortrait ? AspectRatio._16by9 : AspectRatio._3by1;

    const verticalPadding = 25;

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            marginVertical: isPortrait ? 10 : 0,
        },
        contentContainer: {
            marginHorizontal: selectDeviceType(
                { Tablet: isPortrait ? appPadding.md(true) : '25%' },
                appPadding.sm(true),
            ),
        },
        buttonWrapper: {
            alignSelf: selectDeviceType({ Tablet: 'auto' }, 'stretch'),
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? appPadding.xxl(true) : appPadding.sm(true) }, 0),
        },
        title: {
            color: appColors.secondary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            fontFamily: appFonts.light,
            width: '100%',
            marginBottom: 35,
        },
        serviceImageWrapper: {
            width: '100%',
            flexShrink: 1,
            backgroundColor: 'transparent',
            marginVertical: verticalPadding,
        },
        carousel: {
            aspectRatio: aspectRatio,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: appDimensions.cardRadius,
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
            borderRadius: appDimensions.cardRadius,
        },
        carouselImage: {
            aspectRatio: aspectRatio,
            width: cardWidth,
        },
        largeText: {
            color: appColors.secondary,
            fontSize: appFonts.xxlg,
            fontFamily: appFonts.light,
            textAlign: 'left',
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let message = strings['continue_sub.complete_sub_text'];
    // Note: If the user already had a subscription and if the subscrption has expired,
    // we want to message them to re-subscribe, this is needed until we go live,
    // since IAP is limited to 5 renewals in Sandbox/Prod Sandbox env
    if (accountProfile && accountProfile.neverSubscribed === false) {
        message = strings['continue_sub.existing_sub.err_msg'];
    }

    useEffect(() => {
        if (product !== undefined && transactionSuccess === true) {
            routeToPurchaseConfirmation({ subscription: product, navigation });
        }
    }, [navigation, product, transactionSuccess]);

    const openBrowser = async (title: string) => {
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
    return (
        <BackgroundGradient>
            <View style={style.container}>
                <View style={style.contentContainer}>
                    <Text style={[style.largeText]}>
                        {strings['continue_sub.text.1']}
                        <Text style={[style.largeText, formStyles.titleText]}>{strings['continue_sub.text.2']}</Text>
                    </Text>
                </View>
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
                        onIndexChange={() => {}}
                    />
                </View>
                <View style={style.contentContainer}>
                    <View style={style.buttonWrapper}>
                        <Text style={style.title}>{strings['continue_sub.complete_sub_text']}</Text>
                        <Button
                            type={'solid'}
                            title={strings['continue_sub.continue_btn_label']}
                            onPress={() => {
                                //Note: use push instead of navigation because in this scenario PurchaseSubscription screen
                                //would already be in route and using navigate simply moves along the same route.
                                //This causes the screen pick up from where left off, and no network cals are made
                                navigation.push(NAVIGATION_TYPE.PURCHASE_SUBSCRIPTION);
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={formStyles.footer}>
                <TouchableOpacity onPress={() => openBrowser('termsCondition')}>
                    <Text style={formStyles.caption}>{strings['main.terms']}</Text>
                </TouchableOpacity>
                <Text style={formStyles.caption}>•</Text>
                <TouchableOpacity onPress={() => openBrowser('privacyPolicy')}>
                    <Text style={formStyles.caption}>{strings['main.privacy']}</Text>
                </TouchableOpacity>
                <Text style={formStyles.caption}>•</Text>
                <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION_TYPE.HELP)}>
                    <Text style={formStyles.caption}>{strings['main.help']}</Text>
                </TouchableOpacity>
            </View>
        </BackgroundGradient>
    );
};

export default ContinueSubscriptionScreen;

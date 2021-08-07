import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useDimensions, useLayout } from '@react-native-community/hooks';
import { CarouselView } from 'qp-discovery-ui';
import { useAppState } from 'utils/AppContextProvider';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { useLocalization } from 'contexts/LocalizationContext';
import { authHomeStyle, carouselSlidePadding } from '../../styles/AuthHome.style';
import Button from '../components/Button';
import { openLink } from 'utils/InAppBrowserUtils';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

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
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const formStyles = authHomeStyle({ appColors, isPortrait });
    const { onLayout, ...layout } = useLayout();
    const cardWidth = layout.width + carouselSlidePadding * 2;

    const openBrowser = async (url: string) => {
        try {
            await openLink(url, appColors);
        } catch (error) {
            console.log(`[InAppBrowser] Error loading url: ${url}`, error);
        }
    };

    const resourceItemLayout = React.useCallback(
        (_data: any, index: number): { length: number; offset: number; index: number } => ({
            length: cardWidth,
            offset: cardWidth * index,
            index,
        }),
        [cardWidth],
    );

    const keyExtractor = React.useCallback((item, index) => item.id + '_' + index, []);

    const pages = carouselMetadata(appConfig);

    return (
        <BackgroundGradient insetHeader={false}>
            <View style={formStyles.container}>
                <View style={formStyles.mainTextContainer}>
                    <Text style={[formStyles.largeText, formStyles.titleText]}>
                        {strings['main.title.' + (activeIndex % pages.length)]}
                    </Text>
                    <Text style={[formStyles.largeText]}>{strings['main.text.' + (activeIndex % pages.length)]}</Text>
                </View>
                <View style={formStyles.carouselWrapper} onLayout={onLayout}>
                    <CarouselView<CarouselMetadata>
                        keyExtractor={keyExtractor}
                        data={pages}
                        autoplay={true}
                        loop={true}
                        autoplayInterval={3000}
                        initialScrollIndex={0}
                        snapToInterval={cardWidth}
                        getItemLayout={resourceItemLayout}
                        renderItem={({ item }) => (
                            <View key={item.id} style={formStyles.slide}>
                                <Image
                                    style={formStyles.carousal}
                                    source={{
                                        uri: item.url,
                                    }}
                                    width={layout.width}
                                />
                            </View>
                        )}
                        onIndexChange={updateActiveIndex}
                    />
                </View>
                <View style={formStyles.buttonWrapper}>
                    <Button
                        type={'solid'}
                        containerStyle={formStyles.button}
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
            <View style={formStyles.footer}>
                <TouchableOpacity onPress={() => openBrowser(appConfig && appConfig.privacyPolicyURL)}>
                    <Text style={formStyles.caption}>{strings['main.privacy']}</Text>
                </TouchableOpacity>
                <Text style={formStyles.caption}>•</Text>
                <TouchableOpacity onPress={() => openBrowser(appConfig && appConfig.termsAndConditionsURL)}>
                    <Text style={formStyles.caption}>{strings['main.terms']}</Text>
                </TouchableOpacity>
                <Text style={formStyles.caption}>•</Text>
                <TouchableOpacity onPress={() => openBrowser(appConfig && appConfig.helpCenterURL)}>
                    <Text style={formStyles.caption}>{strings['main.help']}</Text>
                </TouchableOpacity>
            </View>
        </BackgroundGradient>
    );
};

export default AuthHomeScreen;

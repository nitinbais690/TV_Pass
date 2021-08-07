import CarouselMetadata from 'features/onboarding/data/models/CarouselMetadata';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import OnboardTemplate from '../components/template/OnboardTemplate';
import { imageResizerUri } from 'qp-discovery-ui/src/utils/ImageUtils';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { Dimensions } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';

const carouselMetadata = (appConfig: AppConfig | undefined) => {
    if (!(appConfig && appConfig.marketingCarousel)) {
        return [];
    }
    try {
        const subscriptionCarousel: string = appConfig.marketingCarousel;
        const imageList = subscriptionCarousel.split(',').map(function(item) {
            return item.trim();
        });
        return imageList;
    } catch (e) {
        console.error('[Marketing Carousel] Error parsing carousel meta-data: ', e);
    }
    return [];
};

const MarketingOnboardScreen = ({ navigation }: { navigation: any }) => {
    const prefs = useAppPreferencesState();
    const { strings } = useLocalization();
    const { appConfig } = prefs;
    const pages = carouselMetadata(appConfig);
    const resizerEndpoint = (appConfig && appConfig.imageResizeURL) || undefined;
    const resizerPath = 'image' || undefined;

    var slideList = [];
    const win = Dimensions.get('window');
    var count = 0;
    for (const imageId of pages) {
        const slide = new CarouselMetadata();
        slide.id = count;
        slide.title = strings['main.title.' + count];
        slide.description = strings['main.text.' + count];
        const imageURI = imageResizerUri(
            resizerEndpoint || '',
            resizerPath,
            imageId,
            AspectRatio._2by3,
            ImageType.Poster,
            win.width,
        );
        slide.imageUrl = imageURI;

        slideList.push(slide);
        count++;
    }

    return <OnboardTemplate navigation={navigation} pages={slideList} />;
};

export default MarketingOnboardScreen;

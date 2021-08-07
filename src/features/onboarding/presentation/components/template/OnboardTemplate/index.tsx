import React, { useRef } from 'react';
import { View, StatusBar, Dimensions, BackHandler } from 'react-native';
import { CommonActions, StackActions, useFocusEffect } from '@react-navigation/native';
import CarouselMetadata from 'features/onboarding/data/models/CarouselMetadata';
import AppIntroSlider from 'react-native-app-intro-slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import OnBoardNavigation from '../../atoms/MarketingNavigation';
import RightArrowCircleButton from '../../atoms/RightArrow';
import MarketingContentView from '../../molecules/MarketingContentView';
import { marketingTemplateStyle } from './styles';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { setOnBoardCompleteStatus } from 'utils/UserPreferenceUtils';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { AUTOMATION_TEST_ID } from 'features/onboarding/presentation/automation-ids';

const OnboardTemplate = (props: OnboardTemplateProps) => {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const sliderRef = useRef<AppIntroSlider>(null);
    type Item = typeof props.pages[0];
    var pagePosition = 0;
    const win = Dimensions.get('window');

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                goBackLanguageSelection(props.navigation);
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [props.navigation]),
    );

    const renderMarketingView = ({ item }: { item: Item }) => {
        return <MarketingContentView title={item.title} description={item.description} imageUrl={item.imageUrl} />;
    };

    const renderIndicator = (activeIndex: number) => {
        return (
            <View style={marketingTemplateStyle(win, appColors).indicatiorContainer}>
                <View style={marketingTemplateStyle(win, appColors).paginationDots}>
                    {props.pages.length > 1 &&
                        props.pages.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    marketingTemplateStyle(win, appColors).dot,
                                    i === activeIndex
                                        ? marketingTemplateStyle(win, appColors).activeIndicator
                                        : marketingTemplateStyle(win, appColors).inActiveIndicator,
                                ]}
                            />
                        ))}
                </View>
                <TouchableOpacity
                    onPress={() => moveSlide()}
                    testID={AUTOMATION_TEST_ID.RIGHT_ARROW_BUTTON}
                    accessibilityLabel={AUTOMATION_TEST_ID.RIGHT_ARROW_BUTTON}>
                    <RightArrowCircleButton />
                </TouchableOpacity>
            </View>
        );
    };

    const moveSlide = () => {
        if (props.pages.length - 1 === pagePosition) {
            setOnBoardCompleteStatus(true);
            navigateToHome(props.navigation);
        } else if (sliderRef && sliderRef.current) {
            sliderRef.current.goToSlide(pagePosition + 1);
            pagePosition++;
        }
    };

    const keyExtractor = (item: Item) => item.title;

    return (
        <BackgroundGradient>
            <StatusBar translucent backgroundColor={appColors.transparent} />

            <AppIntroSlider
                keyExtractor={keyExtractor}
                renderItem={renderMarketingView}
                renderPagination={renderIndicator}
                onSlideChange={(current: number) => {
                    pagePosition = current;
                }}
                data={props.pages}
                ref={sliderRef}
            />

            <LinearGradient
                style={marketingTemplateStyle(win, appColors).overlay}
                colors={[appColors.black, appColors.transparent]}
            />
            <OnBoardNavigation
                onPressSkip={() => {
                    setOnBoardCompleteStatus(true);
                    navigateToHome(props.navigation);
                }}
                onPressBack={() => {
                    goBackLanguageSelection(props.navigation);
                }}
            />
        </BackgroundGradient>
    );
};

function navigateToHome(navigation: any) {
    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
        }),
    );
}

function goBackLanguageSelection(navigation: any) {
    const popAction = StackActions.pop(2);
    navigation.dispatch(popAction);
}

interface OnboardTemplateProps {
    pages: Array<CarouselMetadata>;
    navigation: any;
}

export default OnboardTemplate;

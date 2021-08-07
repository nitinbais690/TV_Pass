import { useLocalization } from 'contexts/LocalizationContext';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StatusBar, View } from 'react-native';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appLanguageTemplateStyle, contentLanguageTemplateStyle } from './styles';
import { setAppDisplayLanguage, setContentLanguage, setOnBoardCompleteStatus } from 'utils/UserPreferenceUtils';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import LanguageSelectionNavigations from '../../molecules/AppLanguageNavigations';
import { useContentLanguage } from '../../../hooks/use-content-language';
import HighlightableText from '../../atoms/ContentLanguageScreenTitle';
import { formAppLanguageList, getLocalizedKey } from 'features/language-selection/utils';
import { AUTOMATION_TEST_ID } from 'features/language-selection/presentation/automation-ids';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import LanguageSelectionCard from '../../molecules/LanguageSelectionCard';
import { CommonActions } from '@react-navigation/native';

const languageMetadata = (appConfig: AppConfig | undefined) => {
    if (!(appConfig && appConfig.catalogueLanguage)) {
        return [];
    }
    try {
        const catalogueLanguageData: string = appConfig.catalogueLanguage;
        const catalogueLanguageList = catalogueLanguageData.split(',').map(function(item) {
            return item.trim();
        });
        return catalogueLanguageList;
    } catch (e) {
        console.error('[Catalogue LanguageList ] Error parsing carousel meta-data: ', e);
    }
    return [];
};

const LanguageSelectionTemplate = (props: LanguageSelectionTemplateProps) => {
    const appPref = useAppPreferencesState();
    const { strings, setAppLanguage } = useLocalization();
    const { appTheme, appConfig } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const selectedContentLanguage = useContentLanguage();
    const [selectedId, setSelectedId] = useState('');

    const languageList = useMemo(() => {
        return props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
            ? languageMetadata(appConfig)
            : formAppLanguageList(selectedContentLanguage);
    }, [appConfig, props.screenType, selectedContentLanguage]);

    const style = appLanguageTemplateStyle();

    useEffect(() => {
        if (languageList && languageList.length > 0) {
            setSelectedId(languageList[0]);
        }
    }, [languageList]);

    const renderItem = ({ item, index }) => {
        return (
            <LanguageSelectionCard
                language={item}
                imageUrl={''}
                isSelected={item === selectedId}
                index={index}
                onPress={() => setSelectedId(item)}
                screenType={props.screenType}
            />
        );
    };

    const handlePrimaryButtonClick = () => {
        if (props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN) {
            setContentLanguage(selectedId);
            props.navigation.push(NAVIGATION_TYPE.CONTENT_LANGUAGE_SELECTION, {
                screenType: APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_SCREEN,
            });
        } else {
            setAppLanguage(getLocalizedKey(selectedId));
            setAppDisplayLanguage(selectedId);
            if (Platform.isTV) {
                setOnBoardCompleteStatus(true);
                navigateToHome(props.navigation);
            } else {
                props.navigation.push(NAVIGATION_TYPE.MARKETING_ONBOARD);
            }
        }
    };

    function navigateToHome(navigation: any) {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
            }),
        );
    }

    return (
        <BackgroundGradient>
            <StatusBar translucent backgroundColor={appColors.transparent} />
            <View style={contentLanguageTemplateStyle.parent}>
                {props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN && (
                    <HighlightableText
                        style={style.contentLanguageTitleStyle}
                        text={strings['calalogue.language_screen_title']}
                        highlightedText={[strings.hundared_percent]}
                    />
                )}

                <FlatList
                    data={languageList}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    extraData={selectedId}
                />

                {!Platform.isTV && (
                    <LanguageSelectionNavigations
                        screenType={props.screenType}
                        primaryButtonText={
                            props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
                                ? strings.next
                                : strings.proceed
                        }
                        onPressPrimary={() => handlePrimaryButtonClick()}
                        secondaryButtonText={
                            props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN ? '' : strings.back
                        }
                        onPressSecondary={() => {
                            props.navigation.goBack();
                        }}
                        primaryTestID={getPrimaryButtonTestId(props.screenType)}
                        primaryAccessibilityLabel={getPrimaryButtonTestId(props.screenType)}
                        secondaryTestID={AUTOMATION_TEST_ID.BACK_BUTTON}
                        secondaryAccessibilityLabel={AUTOMATION_TEST_ID.BACK_BUTTON}
                    />
                )}
            </View>
            {Platform.isTV && (
                <View style={contentLanguageTemplateStyle.buttonTV}>
                    <PrimaryButton
                        title={
                            props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
                                ? strings.next
                                : strings.save
                        }
                        containerStyle={contentLanguageTemplateStyle.nextButton}
                        onPress={() => handlePrimaryButtonClick()}
                        hasTVPreferredFocus={false}
                        primaryTestID={getPrimaryButtonTestId(props.screenType)}
                        primaryAccessibilityLabel={getPrimaryButtonTestId(props.screenType)}
                    />
                </View>
            )}
        </BackgroundGradient>
    );
};

function getPrimaryButtonTestId(screenType: string) {
    return screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
        ? AUTOMATION_TEST_ID.NEXT_BUTTON
        : AUTOMATION_TEST_ID.PROCEED_BUTTON;
}

interface LanguageSelectionTemplateProps {
    navigation: any;
    screenType: string;
}

export default LanguageSelectionTemplate;

import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StatusBar, TouchableOpacity, View } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { getLanguageDesc, formAppLanguageList } from 'features/language-selection/utils';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import HighlightableText from '../../atoms/ContentLanguageScreenTitle';
import { LanguageSelectionCardView } from '../../molecules/LanguageSelectionCardView';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import SwitchButton from 'core/presentation/components/atoms/SwitchButton';
import CloseIcon from 'assets/images/close_icon.svg';
import { switchLanguageTemplateStyle } from './styles';
import { useProfiles } from 'contexts/ProfilesContextProvider';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { getAppLanguage, getContentLanguage } from 'utils/UserPreferenceUtils';
import { getEnglishForReginolLanguage, getReginolLanguage } from 'features/profile/data/utils/ProfileUtils';
import { CommonActions } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { AUTOMATION_TEST_ID } from 'features/language-selection/presentation/automation-ids';

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

const SwitchLanguageTemplate = (props: SwitchLanguageTemplateProps) => {
    const { strings } = useLocalization();
    const appColors = useAppColors();
    const appPref = useAppPreferencesState();
    const { appConfig } = appPref;

    const [selectedContentLanguage, setSelectedContentLanguage] = useState(APP_LANGUAGE_CONSTANTS.TELUGU);
    const [previousAppLanguage, setPreviousAppLanguage] = useState(null);
    const [selectedAppLanguage, setSelectedAppLanguage] = useState(APP_LANGUAGE_CONSTANTS.ENGLISH);
    const { updateActiveAppLanguage, updateActiveContentLanguage } = useProfiles();
    const [isSubmitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchContentLanguage = async () => {
            const language = await getContentLanguage();
            setSelectedContentLanguage(language);
        };

        const fetcthAppLanguage = async () => {
            const language = await getAppLanguage();
            setPreviousAppLanguage(language);
            setSelectedAppLanguage(language);
        };

        fetchContentLanguage();
        fetcthAppLanguage();
    }, []);

    const contentLanguageList = useMemo(() => {
        return languageMetadata(appConfig);
    }, [appConfig]);

    const appLanguageList = useMemo(() => {
        return formAppLanguageList(selectedContentLanguage);
    }, [selectedContentLanguage]);

    const saveLanguagePreference = async () => {
        setSubmitLoading(true);
        await updateActiveAppLanguage(selectedAppLanguage);
        await updateActiveContentLanguage(selectedContentLanguage);
        setSubmitLoading(false);
        navigateToHome(props.navigation);
    };

    const renderItem = ({ item }) => {
        return (
            <Item
                language={item}
                imageUrl={''}
                isSelected={item === selectedContentLanguage}
                onPress={() => {
                    setSelectedContentLanguage(item);
                    setSelectedAppLanguage(item);
                }}
            />
        );
    };

    const getActiveSwitchSide = () => (previousAppLanguage === APP_LANGUAGE_CONSTANTS.ENGLISH ? 1 : 2);

    const Item = ({
        language,
        imageUrl,
        isSelected,
        onPress,
    }: {
        language: string;
        imageUrl: string;
        isSelected: boolean;
        onPress: () => {};
    }) => (
        <View style={switchLanguageTemplateStyle.item}>
            <TouchableOpacity onPress={onPress}>
                <LanguageSelectionCardView
                    isCardSelected={isSelected}
                    selectedLanguage={language}
                    actorImageUrl={imageUrl}
                    languageDesc={getLanguageDesc(APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN, language)}
                    screenType={APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <BackgroundGradient insetTabBar={false}>
            <StatusBar translucent backgroundColor={appColors.transparent} />
            <View style={switchLanguageTemplateStyle.parent}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack();
                    }}>
                    <CloseIcon
                        width={switchLanguageTemplateStyle.closeBtnStyle.width}
                        height={switchLanguageTemplateStyle.closeBtnStyle.height}
                        style={switchLanguageTemplateStyle.closeBtnStyle}
                        testID={AUTOMATION_TEST_ID.CLOSE_ICON}
                        accessibilityLabel={AUTOMATION_TEST_ID.CLOSE_ICON}
                    />
                </TouchableOpacity>

                <HighlightableText
                    style={switchLanguageTemplateStyle.contentLanguageTitle}
                    text={strings['calalogue.language_screen_title']}
                    highlightedText={[strings.hundared_percent]}
                />

                <FlatList
                    data={contentLanguageList}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    extraData={selectedContentLanguage}
                />

                <HighlightableText
                    style={switchLanguageTemplateStyle.appLanguageTitle}
                    text={strings.chooseDisplayLanguage}
                />

                {previousAppLanguage && (
                    <SwitchButton
                        style={switchLanguageTemplateStyle.appLanguageSwitch}
                        onValueChange={(value: string) => {
                            setSelectedAppLanguage(getEnglishForReginolLanguage(value));
                        }}
                        primaryButtonText={appLanguageList[0]}
                        secondaryButtonText={getReginolLanguage(appLanguageList[1])}
                        activeSwitch={getActiveSwitchSide()}
                    />
                )}

                <PrimaryButton
                    title={strings.save}
                    containerStyle={switchLanguageTemplateStyle.saveButton}
                    onPress={() => {
                        saveLanguagePreference();
                    }}
                />
            </View>
            {isSubmitLoading && <AppLoadingIndicator style={switchLanguageTemplateStyle.loaderStyle} />}
        </BackgroundGradient>
    );
};

interface SwitchLanguageTemplateProps {
    navigation: any;
}

export default SwitchLanguageTemplate;

function navigateToHome(navigation: any) {
    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [{ name: NAVIGATION_TYPE.APP_TABS }],
        }),
    );
}

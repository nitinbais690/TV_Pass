import React, { useMemo, useState } from 'react';
import { languageStyle } from './styles';
import { AppConfig, useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import PopUp from 'core/presentation/components/molecules/PopUp';
import { View, Text } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import { formAppLanguageList } from 'features/language-selection/utils';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import { LanguageRow } from '../../atoms/LanguageRow';
import { AUTOMATION_TEST_ID } from 'features/profile/presentation/automation-ids';

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

const PopupLanguageSelection = ({
    screenType,
    isVisible,
    onModelClose,
    onPrimaryAction,
    currentLanguage,
    languages,
}: PopupLanguageSelectionProps) => {
    const style = languageStyle(useAppColors());
    const { strings } = useLocalization();
    const appPref = useAppPreferencesState();
    const { appConfig } = appPref;
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

    const languageList = useMemo(() => {
        return screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
            ? languageMetadata(appConfig)
            : formAppLanguageList(languages.contentLanguage);
    }, [appConfig, screenType, languages.contentLanguage]);

    const getScreenTitle = (): string => {
        return screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN
            ? strings.chooseContentLanguage
            : strings.chooseDisplayLanguage;
    };

    const isMatched = (lan: string): boolean => {
        return lan === selectedLanguage;
    };

    const getLanguageRow = () => {
        return languageList.map((language: string) => {
            return (
                <LanguageRow
                    containerStyle={style.languageRow}
                    checked={isMatched(language)}
                    label={language}
                    onPress={(lan: string) => {
                        setSelectedLanguage(lan);
                    }}
                />
            );
        });
    };

    return (
        <PopUp isVisible={isVisible} onModelClosed={onModelClose}>
            <View style={style.container}>
                <Text style={style.headText}>{getScreenTitle()}</Text>

                {getLanguageRow()}

                <PrimaryButton
                    containerStyle={style.button}
                    title={strings.save}
                    onPress={() => {
                        onPrimaryAction(selectedLanguage);
                    }}
                    primaryTestID={AUTOMATION_TEST_ID.SAVE_BUTTON}
                    primaryAccessibilityLabel={AUTOMATION_TEST_ID.SAVE_BUTTON}
                />
            </View>
        </PopUp>
    );
};

interface PopupLanguageSelectionProps {
    screenType: string;
    isVisible: boolean;
    onModelClose: any;
    onPrimaryAction: any;
    languages: { contentLanguage: string; appLanguage: string };
    currentLanguage: string;
}

export default PopupLanguageSelection;

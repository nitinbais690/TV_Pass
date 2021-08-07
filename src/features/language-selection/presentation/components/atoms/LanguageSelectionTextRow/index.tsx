import React from 'react';
import { View, Text, Platform } from 'react-native';
import SelectedTick from 'assets/images/selected_tick.svg';
import SelectedTickTV from 'assets/images/selected_tick_tv.svg';
import UnSelectedTick from 'assets/images/unselected_tick.svg';
import UnSelectedTickTV from 'assets/images/unselected_tick_tv.svg';
import TamilLogo from 'assets/images/aha-tamil-logo.svg';
import EnglishLogo from 'assets/images/english-logo.svg';
import TeluguLogo from 'assets/images/telugu-logo.svg';
import {
    LanguageSelectionTextRowStyle,
    unselectedTickIconSize,
    selectedTickIconSize,
    langualgeLogoWidth,
    langualgeLogoHeight,
} from './style';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import useAppColors from 'core/presentation/hooks/use-app-colors';

export function LanguageSelectionTextRow(props: LanguageSelectionTextRowProps) {
    const appColors = useAppColors();
    const styles = LanguageSelectionTextRowStyle(appColors);

    return (
        <View style={styles.container}>
            {props.isCardSelected && (
                <View style={styles.tickIconStyle}>
                    {Platform.isTV ? (
                        <SelectedTickTV width={selectedTickIconSize} height={selectedTickIconSize} />
                    ) : (
                        <SelectedTick width={selectedTickIconSize} height={selectedTickIconSize} />
                    )}
                </View>
            )}
            {!props.isCardSelected && (
                <View style={styles.tickIconStyle}>
                    {Platform.isTV ? (
                        <UnSelectedTickTV width={unselectedTickIconSize} height={unselectedTickIconSize} />
                    ) : (
                        <UnSelectedTick width={unselectedTickIconSize} height={unselectedTickIconSize} />
                    )}
                </View>
            )}

            <Text style={styles.languageTextStyle}>{props.displayLanguage}</Text>
            {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.ENGLISH && (
                <EnglishLogo width={langualgeLogoWidth} height={langualgeLogoHeight} />
            )}
            {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TAMIL && (
                <TamilLogo width={langualgeLogoWidth} height={langualgeLogoHeight} />
            )}
            {props.selectedLanguage === APP_LANGUAGE_CONSTANTS.TELUGU && (
                <TeluguLogo width={langualgeLogoWidth} height={langualgeLogoHeight} />
            )}
        </View>
    );
}

interface LanguageSelectionTextRowProps {
    isCardSelected: boolean;
    selectedLanguage: string;
    displayLanguage: string;
}

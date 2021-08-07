import React from 'react';
import { CheckBox } from 'react-native-elements';
import { languageStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import TeluguText from 'assets/images/telugu_text.svg';
import EnglishText from 'assets/images/english_text.svg';
import TamilText from 'assets/images/tamil_text.svg';
import TeluguLetter from 'assets/images/telugu_letter.svg';
import EnglishLetter from 'assets/images/english_letter.svg';
import TamilLetter from 'assets/images/tamil_letter.svg';
import { AUTOMATION_TEST_ID } from 'features/profile/presentation/automation-ids';

export const LanguageRow = ({ checked, label, containerStyle, onPress }: LanguageRowProps) => {
    const styles = languageStyle(useAppColors());

    const getLanguageTextImage = () => {
        switch (label) {
            case APP_LANGUAGE_CONSTANTS.TELUGU:
                return <TeluguText />;
            case APP_LANGUAGE_CONSTANTS.TAMIL:
                return <TamilText />;
            default:
                return <EnglishText />;
        }
    };

    const getLanguageLetterImage = () => {
        switch (label) {
            case APP_LANGUAGE_CONSTANTS.TELUGU:
                return <TeluguLetter style={styles.letterImage} />;
            case APP_LANGUAGE_CONSTANTS.TAMIL:
                return <TamilLetter style={styles.letterImage} />;
            default:
                return <EnglishLetter style={styles.letterImage} />;
        }
    };

    return (
        <TouchableOpacity
            onPress={() => {
                onPress(label);
            }}
            style={[styles.container, containerStyle]}
            testID={AUTOMATION_TEST_ID.CHECKBOX + label}
            accessibilityLabel={AUTOMATION_TEST_ID.CHECKBOX + label}>
            <>
                <LinearGradient
                    style={styles.gradient}
                    colors={
                        checked
                            ? ['rgba(78, 67, 63, 0.5)', 'rgba(255, 110, 69, 0.5)']
                            : ['rgba(59, 64, 70, 0.5)', 'rgba(45, 48, 55, 0.5)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 0.5 }}
                />

                <CheckBox
                    containerStyle={[styles.radioContainer]}
                    textStyle={styles.text}
                    title={label}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={checked}
                    uncheckedColor={'#FFFFFF'}
                    checkedColor={'#FF6D2E'}
                    size={13}
                />
                {getLanguageTextImage()}

                {getLanguageLetterImage()}
            </>
        </TouchableOpacity>
    );
};

interface LanguageRowProps {
    containerStyle?: {};
    label: string;
    onPress: any;
    checked: boolean;
}

import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import FlexButtons from 'core/presentation/components/atoms/FlexButtons';
import React from 'react';
import { View } from 'react-native';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import { contentLanguageTemplateStyle } from '../../template/LanguageSelectionTemplate/styles';

export default function LanguageSelectionNavigations(props: LanguageSelectionNavigationsProps) {
    return (
        <View>
            {props.screenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN ? (
                <PrimaryButton
                    title={props.primaryButtonText}
                    containerStyle={contentLanguageTemplateStyle.nextButton}
                    onPress={props.onPressPrimary}
                    primaryTestID={props.primaryTestID}
                    primaryAccessibilityLabel={props.primaryAccessibilityLabel}
                />
            ) : (
                <FlexButtons
                    primryButtonText={props.primaryButtonText}
                    onPressPrimary={props.onPressPrimary}
                    secondaryButtonText={props.secondaryButtonText}
                    onPressSecondary={props.onPressSecondary}
                    primaryTestID={props.primaryTestID}
                    primaryAccessibilityLabel={props.primaryAccessibilityLabel}
                    secondaryTestID={props.secondaryTestID}
                    secondaryAccessibilityLabel={props.secondaryAccessibilityLabel}
                />
            )}
        </View>
    );
}

interface LanguageSelectionNavigationsProps {
    screenType: string;
    onPressPrimary: () => void;
    onPressSecondary: () => void;
    primaryButtonText: string;
    secondaryButtonText: string;
    primaryTestID?: string;
    primaryAccessibilityLabel?: string;
    secondaryTestID?: string;
    secondaryAccessibilityLabel?: string;
}

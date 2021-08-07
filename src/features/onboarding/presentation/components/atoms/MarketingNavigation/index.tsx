import { useLocalization } from 'contexts/LocalizationContext';
import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { onboardNavigationStyle } from './styles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import BackArrow from 'assets/images/back_arrow.svg';
import { AUTOMATION_TEST_ID } from 'features/onboarding/presentation/automation-ids';

export default function OnBoardNavigation(props: OnBoardNavigationProps) {
    const { strings } = useLocalization();
    const appColors = useAppColors();
    const styles = onboardNavigationStyle(appColors);
    return (
        <View style={styles.navigationContainer}>
            <TouchableHighlight underlayColor={appColors.transparent} onPress={() => props.onPressBack()}>
                <BackArrow />
            </TouchableHighlight>
            <Text
                style={[appFontStyle.menuText, styles.back]}
                onPress={() => props.onPressBack()}
                testID={AUTOMATION_TEST_ID.BACK}
                accessibilityLabel={AUTOMATION_TEST_ID.BACK}>
                {strings['onboard.back']}
            </Text>
            <Text
                style={[appFontStyle.menuText, styles.skip]}
                onPress={() => props.onPressSkip()}
                testID={AUTOMATION_TEST_ID.SKIP}
                accessibilityLabel={AUTOMATION_TEST_ID.SKIP}>
                {strings['onboard.skip']}
            </Text>
        </View>
    );
}

interface OnBoardNavigationProps {
    onPressSkip: () => void;
    onPressBack: () => void;
}

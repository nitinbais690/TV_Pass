import React from 'react';
import { View } from 'react-native';
import { backNavigationStyle } from './styles';
import { Text } from 'react-native-elements';
import BackArrow from 'assets/images/back_arrow.svg';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useSafeArea } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

export default function BackNavigation(props: BackNavigationProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = backNavigationStyle(appColors, props.isFullScreen, useSafeArea());
    return (
        <View style={[styles.containerStyle, props.containerStyle]}>
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={props.onPress}
                testID={AUTOMATION_TEST_ID.BACK_NAVIGATION}
                accessibilityLabel={AUTOMATION_TEST_ID.BACK_NAVIGATION}>
                <BackArrow />
            </TouchableOpacity>
            {props.navigationTitle && <Text style={styles.navigationTitleStyle}>{props.navigationTitle}</Text>}
        </View>
    );
}

interface BackNavigationProps {
    navigationTitle?: string;
    containerStyle?: {};
    onPress: () => void;
    isFullScreen: boolean;
}

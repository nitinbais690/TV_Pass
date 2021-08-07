import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { style } from './style';

export default function LearnMoreView(props: LearnMoreProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings }: any = useLocalization();

    const textStyles = style({ appColors });

    return (
        <View>
            <TouchableOpacity onPress={props.onPress}>
                <Text style={textStyles.textStyle}> {strings.learn_more} </Text>
            </TouchableOpacity>
        </View>
    );
}

interface LearnMoreProps {
    onPress: () => {};
}

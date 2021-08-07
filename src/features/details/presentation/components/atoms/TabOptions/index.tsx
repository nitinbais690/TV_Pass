import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { componentsStyles } from './style';

export default function TabOption(props: TabOptionProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = componentsStyles({ appColors });

    const handleOnPress = () => {
        props.onPress(props.id);
    };

    return (
        <TouchableOpacity key={props.id} onPress={handleOnPress}>
            <View style={styles.container}>
                <Text style={props.showSelectionLine ? styles.textStyle : styles.textUnSelectedStyle}>
                    {props.tabName}
                </Text>
            </View>

            <View>
                {props.showSelectionLine && (
                    <LinearGradient
                        colors={[appColors.brandTintDark, appColors.brandTintLight]}
                        style={styles.lineStyle}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}
export interface TabOptionProps {
    id: string;
    tabName: string;
    showSelectionLine: boolean;
    onPress: (id: string) => void;
}

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SettingsMenuRowStyles } from './style';
import RightArrowIcon from 'assets/images/right_arrow_icon.svg';
import useAppColors from 'core/presentation/hooks/use-app-colors';

const SettingsItemRow = (props: SettingsItemRowProps) => {
    const styles = SettingsMenuRowStyles(useAppColors());

    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                <View style={styles.divider} />
                <View style={styles.titleRowContainer}>
                    {props.image}
                    <Text style={styles.titleText}>{props.title}</Text>
                    <RightArrowIcon style={styles.arrowIcon} />
                </View>
                <Text style={styles.subTitleText}>{props.subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

interface SettingsItemRowProps {
    image: JSX.Element | undefined;
    title: string;
    subtitle: string;
    onPress?: () => void;
}

export default SettingsItemRow;

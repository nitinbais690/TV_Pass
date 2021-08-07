import React from 'react';
import { View, Text } from 'react-native';
import { MenuItemRowStyles } from './style';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';

/*
   Renders Menu item row
 */
export function MenuItemRow(props: MenuItemProps) {
    const style = MenuItemRowStyles(useAppColors());

    return (
        <TouchableOpacity
            onPress={props.onPress}
            testID={AUTOMATION_TEST_ID.MENU_ITEM + props.title}
            accessibilityLabel={AUTOMATION_TEST_ID.MENU_ITEM + props.title}>
            <View style={style.container}>
                <View style={style.imageAndTextContainer}>
                    {props.image && props.image}
                    <Text style={style.textStyle}> {props.title} </Text>
                </View>
                <View style={style.borderStyle} />
            </View>
        </TouchableOpacity>
    );
}

interface MenuItemProps {
    title: string;
    image: JSX.Element | undefined;
    onPress: () => void;
}

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { manageProfileItemStyle } from './styles';

const ManageProfileItem = (props: ManageProfileItemProps) => {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    const styles = manageProfileItemStyle(appColors);
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={styles.container}
            testID={props.testID}
            accessibilityLabel={props.accessibilityLabel}>
            <>
                {props.icon}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>{props.title}</Text>
                    <Text style={styles.descStyle}>{props.description}</Text>
                </View>
            </>
        </TouchableOpacity>
    );
};

interface ManageProfileItemProps {
    title: string;
    description: string;
    icon: any;
    onPress: any;
    testID?: string;
    accessibilityLabel?: string;
}

export default ManageProfileItem;

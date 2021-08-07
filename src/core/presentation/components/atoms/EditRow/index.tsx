import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { profileListItemStyle } from './styles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import EditIcon from 'assets/images/ic_edit.svg';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';

const EditRow = (props: EditRowProps) => {
    const styles = profileListItemStyle(useAppColors());
    const { strings } = useLocalization();

    return (
        <TouchableHighlight
            onPress={props.onPress}
            testID={AUTOMATION_TEST_ID.EDIT + props.testID}
            accessibilityLabel={AUTOMATION_TEST_ID.EDIT + props.accessibilityLabel}>
            <View style={[appFlexStyles.flexRow, appFlexStyles.rowVerticalAlignCenter]}>
                <EditIcon style={styles.icon} />
                {props.showText && (
                    <Text style={styles.editText}>{props.editText ? props.editText : strings.edit}</Text>
                )}
            </View>
        </TouchableHighlight>
    );
};

interface EditRowProps {
    showText: boolean;
    onPress: () => void;
    editText?: string;
    testID?: string;
    accessibilityLabel?: string;
}

export default EditRow;

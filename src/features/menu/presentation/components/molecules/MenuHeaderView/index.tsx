import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import { View } from 'react-native';
import PageTitle from '../../atoms/PageTitle';
import MenuHeaderViewStyle from './style';
import CloseIcon from 'assets/images/close_icon.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AUTOMATION_TEST_ID } from 'features/menu/presentation/automation-ids';

/*
   Renders Menu Header view - Page title with close button
 */
export default function MenuHeaderView(props: MenuHeaderProps) {
    const { strings } = useLocalization();

    const styles = MenuHeaderViewStyle();

    return (
        <View style={styles.container}>
            <PageTitle title={props.showTitle ? strings['tabs.menu'].toUpperCase() : ''} />
            <TouchableOpacity
                onPress={props.closeBtnAction}
                testID={AUTOMATION_TEST_ID.CLOSE_ICON}
                accessibilityLabel={AUTOMATION_TEST_ID.CLOSE_ICON}>
                <CloseIcon
                    width={styles.closeBtnStyle.width}
                    height={styles.closeBtnStyle.height}
                    style={styles.closeBtnStyle}
                />
            </TouchableOpacity>
        </View>
    );
}

interface MenuHeaderProps {
    showTitle: boolean;
    closeBtnAction: () => void;
}

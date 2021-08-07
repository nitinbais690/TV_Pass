import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import DetailsClose from 'assets/images/details_close.svg';
import DetailsBackground from 'features/details/presentation/components/atoms/DetailsBackground';
import { popupStyle } from './styles';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';
import { MenuProvider } from 'react-native-popup-menu';

const PopUp = ({ onModelClosed, children }: PopUpProps): JSX.Element => {
    const styles = popupStyle();
    const [showPopup, setPopupVisibility] = useState(true);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            statusBarTranslucent={true}
            visible={showPopup}
            onRequestClose={() => {
                onModelClosed();
                setPopupVisibility(false);
            }}>
            <MenuProvider skipInstanceCheck style={styles.menuProvider}>
                <View style={styles.container}>
                    <ScrollView style={styles.scrollViewContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                onModelClosed();
                                setPopupVisibility(false);
                            }}
                            testID={AUTOMATION_TEST_ID.CLOSE_ICON}
                            accessibilityLabel={AUTOMATION_TEST_ID.CLOSE_ICON}>
                            <DetailsClose width={'100%'} height={'100%'} />
                        </TouchableOpacity>

                        <DetailsBackground style={styles.gradientContainer}>{children}</DetailsBackground>
                    </ScrollView>
                </View>
            </MenuProvider>
        </Modal>
    );
};

interface PopUpProps {
    onModelClosed: any;
    children: React.ReactNode;
}

export default PopUp;

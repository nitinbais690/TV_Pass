import React from 'react';
import { Text, Modal, View } from 'react-native';
import { popupStyle } from './styles';
import FlexButtons, { FlexButtonsProps } from '../../atoms/FlexButtons';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import LinearGradient from 'react-native-linear-gradient';
import AlertIcon from 'assets/images/alert_icon.svg';

const AlertPopUp = (props: AlertPopUpProps): JSX.Element => {
    const styles = popupStyle(useAppColors());

    return (
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={props.isVisible}
            onRequestClose={() => {
                props.onModelClosed();
            }}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#3B4046', '#2D3037']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientContainer}>
                    <View style={styles.textContainer}>
                        <LinearGradient
                            colors={['rgba(78, 67, 63, 0.5)', 'rgba(255, 110, 69, 0.5)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.5, y: 0.5 }}
                            style={styles.iconContainer}>
                            <AlertIcon />
                        </LinearGradient>
                        <Text style={styles.textStyle}>{props.alertMessage}</Text>
                    </View>

                    <FlexButtons {...props} containerStyle={[props.containerStyle, styles.buttons]} />
                </LinearGradient>
            </View>
        </Modal>
    );
};

interface AlertPopUpProps extends FlexButtonsProps {
    isVisible: boolean;
    onModelClosed: any;
    showAlertIcon?: boolean;
    alertMessage: string;
}

export default AlertPopUp;

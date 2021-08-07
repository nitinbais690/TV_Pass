import { appFlexStyles } from 'qp-common-ui';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { messagePopupStyles } from './styles';

export default function MessagePopup(props: MessagePopupProps) {
    const styles = messagePopupStyles;
    return (
        <LinearGradient
            colors={['#3B4046', '#2D3037']}
            useAngle={true}
            angle={180}
            style={[styles.lockMessageContainer, props.style]}>
            <View style={appFlexStyles.flexRow}>
                {props.icon}
                <Text style={styles.messageText}>{props.message}</Text>
            </View>
        </LinearGradient>
    );
}

interface MessagePopupProps {
    message?: string;
    icon?: JSX.Element;
    style?: {};
}

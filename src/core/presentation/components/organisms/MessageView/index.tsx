import React from 'react';
import { View } from 'react-native';
import ImageAndTextContainer, { MessageStyle } from '../../atoms/ImageAndTextContainer';
import FooterAction, { FooterActionProps } from '../../molecules/FooterAction';
import { MessageViewStyle } from './style';

export default function MessageView(props: MessageViewProps) {
    const styles = MessageViewStyle();
    return (
        <View style={styles.container}>
            <ImageAndTextContainer
                imagePath={props.imagePath}
                text={props.infoText}
                messageStyle={props.messageStyle}
            />
            <FooterAction {...props.footer} />
        </View>
    );
}

export interface MessageViewProps {
    imagePath: string;
    infoText: string;
    footer: FooterActionProps;
    messageStyle: MessageStyle;
}

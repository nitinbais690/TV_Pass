import React from 'react';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { isTablet } from 'core/styles/AppStyles';
import { appFlexStyles } from 'core/styles/FlexStyles';
import MessageView, { MessageViewProps } from '../../organisms/MessageView';

export default function MessageViewTemplate(props: MessageViewProps) {
    return (
        <BackgroundGradient childContainerStyle={isTablet ? appFlexStyles.columnAlignCenter : appFlexStyles.flexColumn}>
            <MessageView {...props} />
        </BackgroundGradient>
    );
}

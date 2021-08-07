import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useNetworkStatus } from '../../contexts/NetworkContextProvider';
import MessageViewTemplate from 'core/presentation/components/templates/MessageViewTemplate';
import { FooterActionProps, FooterButtonProps } from 'core/presentation/components/molecules/FooterAction';
import { MessageStyle } from 'core/presentation/components/atoms/ImageAndTextContainer';
import { MessageViewProps } from 'core/presentation/components/organisms/MessageView';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';

const OfflineScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const navigation = useNavigation();
    const { retry, isInternetReachable } = useNetworkStatus();

    const goToDownloadsButton: FooterButtonProps = {
        label: strings['offline.go_to_downloads'],
        testId: 'DownloadsButton',
        accessibilityLabel: strings['tabs.downloads'],
        onPress: () => {
            navigation.navigate(NAVIGATION_TYPE.DOWNLOADS);
        },
    };

    const retryButton: FooterButtonProps = {
        label: strings['global.retry_btn'],
        testId: 'RetryButton',
        accessibilityLabel: strings['global.retry_btn'],
        onPress: () => {
            retry();
        },
    };

    const footerAction: FooterActionProps = {
        primartButton: goToDownloadsButton,
        secondryButton: retryButton,
    };

    const messageStyle: MessageStyle = {
        paddingLeft: 16,
        paddingRight: 16,
    };

    const messageView: MessageViewProps = {
        imagePath: 'assets/images/empty_state_image.png',
        infoText: strings['global.offline_msg'],
        messageStyle: messageStyle,
        footer: footerAction,
    };

    return <>{!isInternetReachable && <MessageViewTemplate {...messageView} />}</>;
};

export default OfflineScreen;

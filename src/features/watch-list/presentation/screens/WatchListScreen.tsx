import { useNavigation } from '@react-navigation/native';
import { MessageStyle } from 'core/presentation/components/atoms/ImageAndTextContainer';
import { FooterActionProps, FooterButtonProps } from 'core/presentation/components/molecules/FooterAction';
import React from 'react';
import MessageViewTemplate from 'core/presentation/components/templates/MessageViewTemplate';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { MessageViewProps } from 'core/presentation/components/organisms/MessageView';
import { useFetchWatchList } from '../hooks/use-fetch-watchlist';
import WatchListTemplate from '../components/templates/WatchListTeamplate';
import { useAuth } from 'contexts/AuthContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { scale, selectDeviceType } from 'qp-common-ui';

const WatchListScreen = (): JSX.Element => {
    const { strings } = useLocalization();
    const navigation = useNavigation();
    const { userType } = useAuth();
    const isLoggedIn = userType === 'LOGGED_IN' || userType === 'SUBSCRIBED';
    const {
        hasMore,
        loading,
        resources,
        loadMoreResources,
        removeAllResource,
        removeSingleResource,
    } = useFetchWatchList();

    const primartButton: FooterButtonProps = {
        label: strings['watchList.btn.addNow'],
        testId: 'PrimaryButton',
        accessibilityLabel: 'Bookmark',
        onPress: () => {
            navigation.goBack();
        },
    };
    const footerAction: FooterActionProps = {
        primartButton: primartButton,
    };

    const messageStyle: MessageStyle = {
        paddingLeft: selectDeviceType({ Handset: scale(16) }, scale(30)),
        paddingRight: selectDeviceType({ Handset: scale(16) }, scale(30)),
    };

    const messageView: MessageViewProps = {
        imagePath: 'assets/images/empty_state_image.png',
        infoText: strings['watchList.emptyMsg'],
        messageStyle: messageStyle,
        footer: footerAction,
    };
    return (
        <>
            {!isLoggedIn && <MessageViewTemplate {...messageView} />}
            {isLoggedIn && (
                <>
                    {loading && <AppLoadingIndicator />}
                    {!loading && resources && resources.length === 0 && <MessageViewTemplate {...messageView} />}
                    {!loading && resources && resources.length > 0 && (
                        <WatchListTemplate
                            resources={resources}
                            hasMore={hasMore}
                            loadMoreResources={loadMoreResources}
                            removeAllResource={removeAllResource}
                            goToHomeNavigation={() => navigation.goBack()}
                            removeSingleResource={removeSingleResource}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default WatchListScreen;

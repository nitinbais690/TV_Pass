import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

export const openLink = async (url: string, appColors?: any) => {
    try {
        const isAvailable = await InAppBrowser.isAvailable();
        if (!isAvailable) {
            Linking.openURL(url);
            return;
        }

        await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: appColors.primary,
            preferredControlTintColor: appColors.secondary,
            readerMode: true,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: appColors.primary,
            secondaryToolbarColor: appColors.primaryEnd,
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
        });
    } catch (error) {
        console.error('[InAppBrowser] Failed to load url', url);
    }
};

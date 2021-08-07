import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { WebView } from 'react-native-webview';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents } from 'utils/ReportingUtils';

const BrowseWebView = ({ route }: { route: any }) => {
    const prefs = useAppPreferencesState();
    const { appConfig } = prefs;
    const { type }: { type: BROWSE_TYPE } = route.params;
    const { width, height } = useDimensions().window;
    const { recordEvent } = useAnalytics();
    const [url, setUrl] = useState('');
    type BROWSE_TYPE = 'faq' | 'privacyPolicy' | 'termsCondition' | 'contentAvailability' | 'contact';
    interface UrlList {
        privacyPolicy: string;
        termsCondition: string;
        faq: string;
        contentAvailability: string;
        contact: string;
    }

    useEffect(() => {
        if (urlList[type]) {
            setUrl(urlList[type]);
        }
        if (type === 'termsCondition') {
            recordEvent(AppEvents.TNC);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    if (!type || !appConfig) {
        return null;
    }

    const urlList: UrlList = {
        privacyPolicy: appConfig.privacyPolicyURL,
        termsCondition: appConfig.termsAndConditionsURL,
        faq: appConfig.faqURL,
        contentAvailability: appConfig.contentAvailabilityURL,
        contact: appConfig.contactURL,
    };

    if (!url) {
        return null;
    }
    return (
        <BackgroundGradient insetTabBar={true} insetHeader={false}>
            <WebView
                startInLoadingState={true}
                renderLoading={() => (
                    <BackgroundGradient style={{ ...StyleSheet.absoluteFillObject }}>
                        <AppLoadingIndicator />
                    </BackgroundGradient>
                )}
                source={{ uri: url }}
                style={{ width, height, backgroundColor: 'transparent' }}
                // Do not load any inline links
                onShouldStartLoadWithRequest={req => url === req.url}
            />
        </BackgroundGradient>
    );
};

export default BrowseWebView;

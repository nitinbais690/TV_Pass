import React, { createContext, useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import moment from 'moment';
import { useAuth } from 'contexts/AuthContextProvider';
import FreeTrialModalContext from 'screens/FreeTrialModalContext';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { ErrorEvents } from 'utils/ReportingUtils';

const FREE_TRIAL_ACKNOWLEDGED_KEY = 'freeTrialNotificationAcknowledged';

export const FreeTrialNotificationContext = createContext({
    isModalVisible: false,
});

/**
 * AppPreviewContextProvider manages localization/i18n strings for the app. It allows switching the app language
 * on the fly and allows overriding the localized strings via server configuration.
 */
export const FreeTrialNotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { accountProfile, setString } = useAuth();
    const [trialEnded, setTrialEnded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const { recordErrorEvent } = useAnalytics();

    const setAcknowledgementOnAccount = async () => {
        try {
            await setString({
                attributeName: FREE_TRIAL_ACKNOWLEDGED_KEY,
                attributeValue: 'Yes',
                objectTypeName: 'Account',
            });
        } catch (e) {
            recordErrorEvent(ErrorEvents.ACKNOWLEDGEMENT_FAILURE, { error: e });
            console.error('[FreeTrialNotificationContext] Failed to set acknowledgement', e);
        }
    };

    const acknowledgeNotification = async () => {
        setModalVisible(!isModalVisible);

        setAcknowledgementOnAccount();
    };

    useEffect(() => {
        if (!accountProfile) {
            return;
        }

        const hasAcknowledged =
            accountProfile.stringAttribute &&
            accountProfile.stringAttribute.filter(
                attribute => attribute.attributeType.attributeName === FREE_TRIAL_ACKNOWLEDGED_KEY,
            ).length > 0;

        if (hasAcknowledged) {
            return;
        }

        const inFreeTrail = accountProfile.isUserFreeTrial === 'Y';
        const freeTrailEndDate = accountProfile.freeTrialEndDate;
        const startOfDay = moment()
            .startOf('day')
            .valueOf();
        const endOfDay = moment()
            .endOf('day')
            .valueOf();
        const doesFreeTrailEndsToday = freeTrailEndDate >= startOfDay && freeTrailEndDate <= endOfDay;

        // Ensure user had
        // - a free trial
        // - free trial has ended
        // - Now has a valid subscription
        const freeTrialHasEndedAndSubscriptionStarted =
            !inFreeTrail && freeTrailEndDate > 0 && freeTrailEndDate <= endOfDay && accountProfile.subscriptionStatus;

        if (inFreeTrail && doesFreeTrailEndsToday) {
            setTrialEnded(false);
            setModalVisible(true);
        } else if (freeTrialHasEndedAndSubscriptionStarted) {
            setTrialEnded(true);
            setModalVisible(true);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FreeTrialNotificationContext.Provider
            value={{
                isModalVisible,
            }}>
            <>
                {children}
                <Modal
                    isVisible={isModalVisible}
                    useNativeDriver={true}
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape-left', 'landscape-right']}>
                    <FreeTrialModalContext trialEnd={trialEnded} onPress={acknowledgeNotification} />
                </Modal>
            </>
        </FreeTrialNotificationContext.Provider>
    );
};

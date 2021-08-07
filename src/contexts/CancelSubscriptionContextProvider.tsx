import React, { useEffect, createContext, useContext } from 'react';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useAuth } from 'contexts/AuthContextProvider';
import moment from 'moment';

interface AlertState {
    onCancelSubscription: () => void;
}

export const CancelSubscriptionContext = createContext<AlertState>({
    onCancelSubscription: () => {},
});

export const CancelSubscriptionContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { Alert, dismiss } = useAlert();
    const { strings } = useLocalization();
    const userAction = useAuth();
    const { setString, accountProfile } = userAction;
    const ACK_SUB_CANCEL_REMAINDER = 'acknowledgeSubCancelRemainder';
    const ACK_SUB_CANCEL_REMAINDER_DATE = 'acknowledgeSubCancelRemainderDate';

    useEffect(() => {
        handleCancelSubscription();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountProfile]);

    const handleCancelSubscription = async () => {
        if (!accountProfile) {
            return;
        }

        const acknowledgeSubCancelRemainder =
            accountProfile.stringAttribute &&
            accountProfile.stringAttribute.filter(
                attribute => attribute.attributeType.attributeName === ACK_SUB_CANCEL_REMAINDER,
            ).length > 0;
        const acknowledgeSubCancelRemainderDate =
            accountProfile.stringAttribute &&
            accountProfile.stringAttribute.filter(
                attribute => attribute.attributeType.attributeName === ACK_SUB_CANCEL_REMAINDER_DATE,
            ).length > 0;
        const acknowledgeSubCancelRemainderDateVal =
            (accountProfile.stringAttribute &&
                accountProfile.stringAttribute
                    .filter(attribute => attribute.attributeType.attributeName === ACK_SUB_CANCEL_REMAINDER_DATE)
                    .map(val => val.value)[0]) ||
            '0';
        if (accountProfile.hasSubCancelled && accountProfile.subscriptionStatus) {
            if (acknowledgeSubCancelRemainder && acknowledgeSubCancelRemainderDate) {
                if (accountProfile.prevSubExpDateTime !== parseInt(acknowledgeSubCancelRemainderDateVal)) {
                    onCancelSubscription();
                }
            } else {
                onCancelSubscription();
            }
        }
    };

    const onCancelSubscription = () => {
        const expDate =
            accountProfile && accountProfile.subscriptionExpDateTime
                ? moment(accountProfile.subscriptionExpDateTime).format('MMMM Do,YYYY')
                : '';
        const cancelMsg = strings.formatString(strings['subscription.cancel_subscription_msg'], expDate);
        Alert.alert(strings['subscription.cancel_subscription_title'], cancelMsg.toString(), [
            {
                text: strings['subscription.cancel_subscription_btn'],
                onPress: () => {
                    dismiss();
                    handleSetString();
                },
            },
        ]);
    };

    const handleSetString = () => {
        setString({
            attributeName: ACK_SUB_CANCEL_REMAINDER,
            attributeValue: true,
            objectTypeName: 'Account',
        }).catch((err: any) => {
            console.debug('[CancelSubscription] Error set string:', err);
        });
        setString({
            attributeName: ACK_SUB_CANCEL_REMAINDER_DATE,
            attributeValue: accountProfile && accountProfile.prevSubExpDateTime,
            objectTypeName: 'Account',
        }).catch((err: any) => {
            console.debug('[CancelSubscription] Error set string:', err);
        });
    };

    return (
        <CancelSubscriptionContext.Provider
            value={{
                onCancelSubscription,
            }}>
            {children}
        </CancelSubscriptionContext.Provider>
    );
};

export const useCancelSubscription = () => {
    const context = useContext(CancelSubscriptionContext);
    if (context === undefined) {
        throw new Error('useCancelSubscription must be used within a CancelSubscriptionContext');
    }
    return context;
};

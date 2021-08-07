import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useIAPState, ErrorCodes } from 'utils/IAPContextProvider';
import { useGetProducts } from './hooks/useGetProducts';
import AppLoadingIndicator from './components/AppLoadingIndicator';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { routeToPurchaseConfirmation, routeToContinueSubscription } from 'utils/NavigationUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, condenseSubscriptionData } from 'utils/ReportingUtils';
import { useAuth } from 'contexts/AuthContextProvider';

//This screen is to trigger automatics free trial/subscription
const PurchaseSubscribtionScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const isMounted = useRef(true);
    const { logout } = useAuth();
    const { Alert } = useAlert();
    const { strings } = useLocalization();
    const { recordEvent } = useAnalytics();
    const { loading: purchaseInProgress, purchaseSubscription, transactionSuccess, errorObject } = useIAPState();
    const {
        loading: loadingSubscriptions,
        response: subscriptions,
        error: subscriptionFetchError,
        reload,
        reset,
    } = useGetProducts(true);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    useEffect(() => {
        isMounted.current = true;

        if (subscriptionFetchError === true) {
            recordEvent(AppEvents.PURCHASE_FAILURE, condenseErrorObject(errorObject));
            Alert.alert(
                strings['global.general_error_msg'],
                undefined,
                [
                    {
                        text: strings['global.retry_btn'],
                        onPress: () => {
                            reset();
                            reload();
                        },
                    },
                ],
                {
                    cancelable: false,
                },
            );
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriptionFetchError]);

    useEffect(() => {
        if (subscriptions !== undefined && purchaseInProgress === undefined) {
            purchaseSubscription(subscriptions[0]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseInProgress, loadingSubscriptions]);

    useEffect(() => {
        if (!subscriptions || !isMounted.current) {
            return;
        }

        const promptCancelConfirmation = () => {
            Alert.alert(
                strings['subscription.cancel_err_title'],
                strings['subscription.cancel_err_msg'],
                [
                    {
                        text: strings['subscription.resume_btn'],
                        onPress: () => {
                            purchaseSubscription(subscriptions[0]);
                        },
                        style: 'cancel',
                    },
                    {
                        text: strings['subscription.finish_later_btn'],
                        onPress: () => {
                            routeToContinueSubscription({ navigation });
                        },
                    },
                ],
                { cancelable: false },
            );
        };

        const noAccessPrompt = () => {
            Alert.alert(
                strings['subscription.err_msg'],
                undefined,
                [
                    {
                        text: strings['subscription.retry_btn'],
                        onPress: () => {
                            purchaseSubscription(subscriptions[0]);
                        },
                        style: 'cancel',
                    },
                    {
                        text: strings['global.okay'],
                        onPress: () => {
                            routeToContinueSubscription({ navigation });
                        },
                    },
                ],
                { cancelable: false },
            );
        };

        const underlyingErrorCode = (error: any) => {
            if (error && error.userInfo && error.userInfo.NSUnderlyingError) {
                return error.userInfo.NSUnderlyingError.code;
            }
        };

        const subcriptionFailurePrompt = (msg: string, shouldLogout: boolean = false) => {
            Alert.alert(
                msg,
                undefined,
                [
                    {
                        text: strings['global.okay'],
                        onPress: async () => {
                            if (shouldLogout) {
                                await logout();
                            } else {
                                routeToContinueSubscription({ navigation });
                            }
                        },
                    },
                ],
                { cancelable: false },
            );
        };

        if (transactionSuccess === true && subscriptions.length > 0 && subscriptions[0] !== undefined) {
            recordEvent(AppEvents.PURCHASE_SUBSCRIPTION, condenseSubscriptionData(subscriptions[0]));
            routeToPurchaseConfirmation({ subscription: subscriptions[0], navigation });
        } else if (transactionSuccess === false) {
            recordEvent(AppEvents.PURCHASE_FAILURE, condenseErrorObject(errorObject));
            console.debug('[PurchaseSubscription] >>> IAP transaction failed with error ', errorObject);
            if (!isMounted.current) {
                return;
            }

            if (errorObject && errorObject.code === 'E_USER_CANCELLED') {
                promptCancelConfirmation();
            } else if (errorObject && errorObject.code === 'E_USER_ERROR') {
                // Do nothing: This can trigger when attempting to make a purchase
                // when RNIAP.initConnection has failed
                // See here: https://developer.apple.com/documentation/storekit/skpaymentqueue/1506139-canmakepayments
            } else {
                // read here for more info: https://developer.apple.com/forums/thread/664977
                const underlyingError = underlyingErrorCode(errorObject);
                const errCode = underlyingError ? underlyingError : errorObject && errorObject.errorCode;
                const msg = strings['subscription.err.' + errCode];
                if (msg) {
                    subcriptionFailurePrompt(
                        msg,
                        [
                            ErrorCodes.ERROR_CODE_SUBSCRIPTION_TIED_DIFF_ACCOUNT,
                            ErrorCodes.ERROR_CODE_ALREADY_SUBSCRIBED,
                        ].includes(errCode),
                    );
                } else {
                    noAccessPrompt();
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionSuccess, errorObject]);

    return (
        <BackgroundGradient style={style.container}>
            <AppLoadingIndicator />
        </BackgroundGradient>
    );
};

export default PurchaseSubscribtionScreen;

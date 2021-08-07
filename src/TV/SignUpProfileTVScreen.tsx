import React, { useCallback, useContext, useState } from 'react';
import { useTVEventHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupValidate } from 'helper/validateRules';
import useForm from 'helper/useForm';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
// import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { authAction } from 'contexts/AuthContextProvider';
import { ClientContext } from 'qp-discovery-ui';
import { requestBody, isSuccess, errorCode, responsePayload, EvergentEndpoints } from 'utils/EvergentAPIUtil';
import SignUpScreenStepFour_UserName from './SignUpScreenStepFour_UserName';
import SignUpScreenStepFive_Age from './SignUpScreenStepFive_Age';
import { ErrorMessage } from 'screens/components/ErrorMessageBox';
import { useAppState } from 'utils/AppContextProvider';

const initialValues = {
    name: '',
    month: '',
    day: '',
};

const SignUpProfileTVScreen = (): JSX.Element => {
    const navigation = useNavigation();
    const { values, handleChange } = useForm(initialValues, handleSubmitCB, signupValidate);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [lastRemoteKeyEvent, setLastRemoteKeyEvent] = useState('');
    const [tvSignUpStep, setTvSignUpStep] = useState(4);
    const { triggerSubscribedFlow } = useAppState();
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });
    const [submitError] = useState<ErrorMessage>({
        displayError: false,
        message: '',
    });

    const userAction = useAuth();
    const { accessToken, updatedAccountProfile } = userAction;
    const updateProfileEndpoint = EvergentEndpoints.UpdateProfile;
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);

    async function userProfile({ firstName, dateOfBirth }: { firstName: string; dateOfBirth: string | null }) {
        const body = requestBody(updateProfileEndpoint, appConfig, { firstName, dateOfBirth });

        let action = authAction({
            method: 'POST',
            endpoint: updateProfileEndpoint,
            body: body,
            accessToken,
        });
        const { payload } = await query(action);
        if (isSuccess(updateProfileEndpoint, payload)) {
            return responsePayload(updateProfileEndpoint, payload);
        } else {
            throw errorCode(updateProfileEndpoint, payload);
        }
    }

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        userProfile({
            firstName: values.name,
            dateOfBirth: values.day !== '' ? values.day + '/' + values.month : null,
        })
            .then(async () => {
                setIsSubmitLoading(false);
                try {
                    if (values.day && values.month && tvSignUpStep === 5) {
                        await updatedAccountProfile();
                        triggerSubscribedFlow();
                    } else {
                        setTvSignUpStep(5);
                        // navigation.navigate(NAVIGATION_TYPE.BROWSE);
                        // recordEvent(AppEvents.SIGN_UP);
                    }
                    await updatedAccountProfile();
                    triggerSubscribedFlow();
                } catch (e) {
                    console.error('[UserProfile] error updating user profile', e);
                }
            })
            .catch(e => {
                console.error('[UserProfile] error updating user profile', e);
                setIsSubmitLoading(false);
            });
    }

    const onSkipDOB = useCallback(() => {
        triggerSubscribedFlow();
        // recordEvent(AppEvents.SIGN_UP);
        // navigation.navigate(NAVIGATION_TYPE.BROWSE);
    }, [triggerSubscribedFlow]);

    const myTVEventHandler = (evt: { eventType: string }) => {
        setLastRemoteKeyEvent(evt.eventType);
    };

    useTVEventHandler(myTVEventHandler);

    switch (tvSignUpStep) {
        case 4:
            return (
                <SignUpScreenStepFour_UserName
                    values={values}
                    handleChange={handleChange}
                    setFormErrors={setFormErrors}
                    formErrors={formErrors}
                    submitError={submitError}
                    isSubmitLoading={isSubmitLoading}
                    lastRemoteKeyEvent={lastRemoteKeyEvent}
                    handleSubmit={handleSubmitCB}
                />
            );

        case 5:
            return (
                <SignUpScreenStepFive_Age
                    values={values}
                    handleChange={handleChange}
                    setFormErrors={setFormErrors}
                    formErrors={formErrors}
                    submitError={submitError}
                    isSubmitLoading={isSubmitLoading}
                    lastRemoteKeyEvent={lastRemoteKeyEvent}
                    handleSubmit={handleSubmitCB}
                    onSkipDOB={onSkipDOB}
                />
            );
        default:
            return <SignUpScreenStepFour_UserName navigation={navigation} setTvSignUpStep={setTvSignUpStep} />;
    }
};

export default SignUpProfileTVScreen;

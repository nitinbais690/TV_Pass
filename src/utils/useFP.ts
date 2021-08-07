import { useContext } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { ClientContext } from 'react-fetching-library';
import { authAction } from 'contexts/AuthContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';

export default function useFP() {
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);

    const fpEndpoint = EvergentEndpoints.ForgotPassword;
    const confirmOtpEndpoint = EvergentEndpoints.ConfirmOTP;
    const resetPasswordEndpoint = EvergentEndpoints.ResetPassword;

    async function forgotPassword({ email }: { email: string }) {
        const body = requestBody(fpEndpoint, appConfig, { email });
        let action = authAction({
            method: 'POST',
            endpoint: fpEndpoint,
            body,
        });

        const { payload } = await query(action);
        if (isSuccess(fpEndpoint, payload)) {
            return responsePayload(fpEndpoint, payload);
        } else {
            throw errorCode(fpEndpoint, payload);
        }
    }

    async function forgotPasswordOtp({ email, otpCode }: { email: string; otpCode: string }) {
        const body = requestBody(confirmOtpEndpoint, appConfig, { email, otp: otpCode, isGenerateToken: true });
        let action = authAction({
            method: 'POST',
            endpoint: confirmOtpEndpoint,
            body,
        });

        const { payload } = await query(action);
        if (isSuccess(confirmOtpEndpoint, payload)) {
            return responsePayload(confirmOtpEndpoint, payload);
        } else {
            throw errorCode(confirmOtpEndpoint, payload);
        }
    }

    async function forgotPasswordReset({
        email,
        newPassword,
        userToken,
    }: {
        email: string;
        newPassword: string;
        userToken: string;
    }) {
        const body = requestBody(resetPasswordEndpoint, appConfig, { email, contactPassword: newPassword, userToken });
        let action = authAction({
            method: 'POST',
            endpoint: resetPasswordEndpoint,
            body,
        });

        const { payload } = await query(action);
        if (isSuccess(resetPasswordEndpoint, payload)) {
            return responsePayload(resetPasswordEndpoint, payload);
        } else {
            throw errorCode(resetPasswordEndpoint, payload);
        }
    }

    return {
        forgotPassword,
        forgotPasswordOtp,
        forgotPasswordReset,
    };
}

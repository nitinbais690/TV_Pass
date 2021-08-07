export const useAuth = () => {
    const initialState = {
        userType: 'INIT',
        signedUpInSession: false,
        error: undefined,
        accessToken: undefined,
        silentLogin: undefined,
        setString: async () => {},
        signUp: async () => {},
        login: async () => {},
        refreshToken: async () => {},
        logout: async () => {},
        updatedAccountProfile: async () => {},
    };

    initialState.userType = 'LOGGED_IN';
    return initialState;
};

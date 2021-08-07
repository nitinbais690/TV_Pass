import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const useAppColors = () => {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);
    return appColors;
};

export default useAppColors;

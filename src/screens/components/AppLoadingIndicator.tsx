import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';

export type Size = 'small' | 'large';

const AppLoadingIndicator = ({ style, size = 'large' }: { style?: StyleProp<ViewStyle>; size?: Size }): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors, appBaseStyles } = prefs.appTheme!(prefs);

    return <ActivityIndicator color={appColors.brandTint} size="large" style={style ? style : appBaseStyles.loading} />;
};

export default AppLoadingIndicator;

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { loadingIndicatorStyles } from '../styles/PlayerControls.style';

const loadingStyle = loadingIndicatorStyles();
const AppLoadingIndicator = (): JSX.Element => {
    return <ActivityIndicator color={'white'} style={loadingStyle.loading} size="large" />;
};
export default AppLoadingIndicator;

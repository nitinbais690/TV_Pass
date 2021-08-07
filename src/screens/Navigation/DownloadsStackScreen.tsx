import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NAVIGATION_TYPE } from './NavigationConstants';
import { headerStyle } from '../../styles/Common.style';
import DownloadsScreen from 'features/downloads/presentation/screens/DownloadsScreen';

const DownloadsStack = createStackNavigator();
const DownloadsStackScreen = () => {
    return (
        <DownloadsStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerBackTitleVisible: false,
            }}
            initialRouteName={NAVIGATION_TYPE.DOWNLOADS}>
            <DownloadsStack.Screen
                name={NAVIGATION_TYPE.DOWNLOADS}
                component={DownloadsScreen}
                options={{
                    headerShown: false,
                }}
            />
        </DownloadsStack.Navigator>
    );
};

export default DownloadsStackScreen;

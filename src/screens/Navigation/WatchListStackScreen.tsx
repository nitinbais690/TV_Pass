import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NAVIGATION_TYPE } from './NavigationConstants';
import { headerStyle } from '../../styles/Common.style';
import WatchListScreen from 'features/watch-list/presentation/screens/WatchListScreen';

const WatchListStack = createStackNavigator();
const WatchListStackScreen = () => {
    return (
        <WatchListStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerBackTitleVisible: false,
                headerShown: false,
            }}
            initialRouteName={NAVIGATION_TYPE.WATCHLIST}>
            <WatchListStack.Screen name={NAVIGATION_TYPE.WATCHLIST} component={WatchListScreen} />
        </WatchListStack.Navigator>
    );
};

export default WatchListStackScreen;

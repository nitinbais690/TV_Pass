import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OfflineScreen from 'screens/Errors/OfflineScreen';
import { NAVIGATION_TYPE } from './NavigationConstants';
import DownloadsStackScreen from './DownloadsStackScreen';
import { ProfilesContextProvider } from 'contexts/ProfilesContextProvider';
import PlayerScreen from 'features/player/presentation/screen/PlayerScreen';

const OfflineStack = createStackNavigator();
const OfflineStackScreen = () => {
    return (
        <ProfilesContextProvider>
            <OfflineStack.Navigator
                headerMode="none"
                screenOptions={{
                    animationEnabled: false,
                }}
                mode="modal"
                initialRouteName={NAVIGATION_TYPE.OFFLINE}>
                <OfflineStack.Screen
                    name={NAVIGATION_TYPE.OFFLINE}
                    component={OfflineScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <OfflineStack.Screen name={NAVIGATION_TYPE.DOWNLOADS} component={DownloadsStackScreen} />
                <OfflineStack.Screen
                    name={NAVIGATION_TYPE.PLAYER}
                    component={PlayerScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </OfflineStack.Navigator>
        </ProfilesContextProvider>
    );
};

export default OfflineStackScreen;

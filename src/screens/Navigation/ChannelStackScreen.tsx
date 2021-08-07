import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChannelTV from '../../TV/ChannelTV';

const ChannelStack = createStackNavigator();
const ChannelStackScreen = () => {
    return (
        <ChannelStack.Navigator>
            <ChannelStack.Screen
                name="Channel"
                component={ChannelTV}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerBackTitle: '',
                    headerLeft: () => <></>,
                }}
            />
        </ChannelStack.Navigator>
    );
};

export default ChannelStackScreen;

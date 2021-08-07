import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NAVIGATION_TYPE } from './NavigationConstants';
import EpgGuideScreen from '../EpgGuideScreen';
import { headerStyle } from '../../styles/Common.style';
import { useLocalization } from 'contexts/LocalizationContext';

const LiveTvStack = createStackNavigator();
const LiveTvStackScreen = () => {
    const { strings } = useLocalization();
    return (
        <LiveTvStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerBackTitleVisible: false,
                headerStyle: { shadowColor: 'transparent' },
            }}>
            <LiveTvStack.Screen
                name={NAVIGATION_TYPE.MY_CONTENT}
                component={EpgGuideScreen}
                options={{
                    headerTitle: strings['guide.header'],
                }}
            />
        </LiveTvStack.Navigator>
    );
};

export default LiveTvStackScreen;

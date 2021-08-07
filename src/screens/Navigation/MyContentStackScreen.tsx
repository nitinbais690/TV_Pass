import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppState } from 'utils/AppContextProvider';
import { NAVIGATION_TYPE } from './NavigationConstants';
import MyContentScreen from '../MyContentScreen';
import SeriesDownloadScreen from '../MyContent/SeriesDownloadScreen';
import { headerStyle } from '../../styles/Common.style';
import { ResourceVm } from 'qp-discovery-ui';

const MyContentStack = createStackNavigator();
const MyContentStackScreen = () => {
    const { routeToDownloads } = useAppState();

    return (
        <MyContentStack.Navigator
            screenOptions={{
                headerTitleStyle: headerStyle().headerTitle,
                headerBackTitleVisible: false,
            }}>
            <MyContentStack.Screen
                name={NAVIGATION_TYPE.MY_CONTENT}
                component={MyContentScreen}
                initialParams={{
                    routeToDownloads: routeToDownloads,
                }}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                }}
            />
            <MyContentStack.Screen
                name={NAVIGATION_TYPE.SERIES_DOWNLOAD}
                component={SeriesDownloadScreen}
                options={({ route }) => ({ title: (route.params as ResourceVm).name, series: route.params })}
            />
        </MyContentStack.Navigator>
    );
};

export default MyContentStackScreen;

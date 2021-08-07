import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../SearchScreen';
import SearchScreenTV from '../../TV/SearchScreenTV';

const SearchStack = createStackNavigator();
const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={Platform.isTV && Platform.OS === 'android' ? SearchScreenTV : SearchScreen}
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerBackTitle: '',
                    headerLeft: () => <></>,
                }}
            />
        </SearchStack.Navigator>
    );
};

export default SearchStackScreen;

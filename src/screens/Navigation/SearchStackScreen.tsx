import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreenTV from '../SearchScreenTV';
import SearchScreen from 'features/search/presentation/screens/SearchScreen';

const SearchStack = createStackNavigator();
const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={Platform.isTV ? SearchScreenTV : SearchScreen}
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

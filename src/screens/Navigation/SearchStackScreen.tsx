import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../SearchScreen';

const SearchStack = createStackNavigator();
const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={SearchScreen}
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

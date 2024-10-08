import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './screens/HomePage';
import RecipeList from './screens/RecipeList';
import AddRecipe from './screens/AddRecipe';
import RecipeDetails from './screens/RecipeDetails';
import { RootStackParamList } from './screens/RootStackParams';
import Login from './screens/Login';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="RecipeList" component={RecipeList} />
        <Stack.Screen name="AddRecipe" component={AddRecipe} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TextToSignScreen from './src/screens/TextToSignScreen';
import SignToTextScreen from './src/screens/SignToTextScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SSL Assistant' }} />
          <Stack.Screen name="TextToSign" component={TextToSignScreen} options={{ title: 'Text → Sign' }} />
          <Stack.Screen name="SignToText" component={SignToTextScreen} options={{ title: 'Sign → Text' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
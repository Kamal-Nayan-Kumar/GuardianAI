import * as React from 'react';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import type { PropsWithChildren } from 'react'
//navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//screens
import Home from './screens/Home.tsx';
import Signup from './screens/Signup.tsx';
import Login from './screens/Login.tsx';
import ChatScreen from './screens/ChatScreen.tsx';
export type RootStackParamlist = {
  Home: any;
  Signup: any;
  Login:any;
  ChatScreen:any;
}

const Stack = createNativeStackNavigator<RootStackParamlist>()

function App():React.ReactElement {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home'
          component={Home}
            options={{ headerShown: false }} />
       
          <Stack.Screen name='Signup'
            component={Signup}
              options={{ headerShown: false }} />
            <Stack.Screen name='Login'
            component={Login}
            options={{ headerShown: false }} />
            <Stack.Screen name='ChatScreen'
            component={ChatScreen}
            options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}



export default App;

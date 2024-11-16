import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {GestureHandlerRootView} from "react-native-gesture-handler";
// import Amplify, { Auth } from 'aws-amplify';
// import awsconfig from './src/aws-exports';

import LoginScreen from './modules/auth/login.screen';
import SignUpScreen from './modules/auth/sign-up.screen';
import DictateScreen from './modules/dictate/dictate.screen';
import HomeScreen from './modules/home.screen';

// Amplify.configure(awsconfig);

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const App: React.FC = () => {
  // todo: move the state management to redux
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          {isAuthenticated ? (
              <AppStack.Navigator>
                <AppStack.Screen name="Dictate" component={DictateScreen}/>
                <AppStack.Screen name="Home" component={HomeScreen}/>
              </AppStack.Navigator>
          ) : (
              <AuthStack.Navigator>
                <AuthStack.Screen name="Login" component={LoginScreen}/>
                <AuthStack.Screen name="SignUp" component={SignUpScreen}/>
              </AuthStack.Navigator>
          )}
        </NavigationContainer>
      </GestureHandlerRootView>
  );
};

export default App;

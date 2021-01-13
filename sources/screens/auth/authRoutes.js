import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native'
import {Colors} from 'sources/styles/index'
import {Login, Verify, SignUp} from './index'

const AuthStack = createStackNavigator();

const AuthRoutes = ()=>{
  return (
      <NavigationContainer>
          <AuthStack.Navigator>
              <AuthStack.Screen name="Login" component={Login} options={{
                  headerShown: false
              }}/>
              <AuthStack.Screen name="Verify" component={Verify} options={{
                  title: "Verify Mobile",
                  headerTintColor: Colors.WHITE,
                  headerLayoutPreset: 'center',
                  headerTitleStyle: {
                     fontSize: 16
                  },
                  headerStyle: {
                      backgroundColor: Colors.SPLASH
                  }
              }}/>
              <AuthStack.Screen name="SignUp" component={SignUp} options={{
                  title: "Create An Account",
                  headerTintColor: Colors.WHITE,
                  headerLayoutPreset: 'center',
                  headerTitleStyle: {
                     fontSize: 16
                  },
                  headerStyle: {
                      backgroundColor: Colors.SPLASH
                  }
              }}/>
          </AuthStack.Navigator>
      </NavigationContainer>
  )
};

export default AuthRoutes

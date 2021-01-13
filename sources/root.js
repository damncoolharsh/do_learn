import React, {useContext, useEffect, useState} from 'react'
import {StatusBar, Text} from 'react-native'
import {Colors} from 'styles/index.js'
import {NavigationContainer} from '@react-navigation/native'
import StudentRoutes from './screens/student/routes'
import TeacherRoutes from "./screens/teacher/routes";
import AuthRoutes from './screens/auth/authRoutes'
import database from '@react-native-firebase/database'
import {AuthContext} from './providers/authProvider'
import auth from '@react-native-firebase/auth'
import { DataProvider } from './providers/dataProvider'
import SignUp2 from './screens/auth/signUp/signUp2'
import requestCameraAndAudioPermission from 'sources/screens/auth/permission'
import { Center } from './component/atoms'
import { createStackNavigator } from '@react-navigation/stack'

const Root = ()=>{
  const {user, userData, signOut} = useContext(AuthContext)
  const route = (user && userData.data) ? (userData.data.occupation === "Student" ? <StudentRoutes /> : <TeacherRoutes />) : <TeacherRoutes />;
  const [permission, setPermision] = useState(false)
  // signOut()
  const Stack = createStackNavigator()
  useEffect(()=>{
    requestCameraAndAudioPermission().then(_=>{
        if(_){
          setPermision(true)
        } else{
          setPermision(false)
        }
    })
  })
  return (
    user == null
      ? <AuthRoutes />
      : <DataProvider>
        {permission
        ? <NavigationContainer>
        <StatusBar backgroundColor={Colors.PRIMARY} />
        {route}
      </NavigationContainer> 
        : <Center>
            <Text>Please Enable Required Permissions</Text>
          </Center>}
      </DataProvider>
)
};

export default Root

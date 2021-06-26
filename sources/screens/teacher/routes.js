import React, { useContext } from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import {
  Profile
} from "./index"
import { Text, View } from 'react-native'
import TabsScreen from "./Tabs";
import { LiveClass } from "sources/component/organisms/index";
import { UserProfile } from 'sources/screens/users/index'
import Conversation from "sources/screens/conversation";
import { AddPost } from './notices/index'
import {
  Assignments,
  StudyMaterial,
  SelectUser
} from 'sources/screens/classwork/index'
import { AuthContext } from 'sources/providers/authProvider'
import AddSubject from 'sources/screens/teacher/addSubject'
import { Loading } from 'sources/component/atoms/index';
import { Colors } from 'sources/styles/index'
import SignUp2 from 'sources/screens/auth/signUp/signUp2'

const Stack = createStackNavigator();
const AssignmentsStack = createStackNavigator()

const TeacherRoutes = () => {
  const { userData, signOut } = useContext(AuthContext)
  // signOut()
  const AssignmentsStackScreen = ({ navigation, route }) => {
    return (
      <AssignmentsStack.Navigator screenOptions={{
        headerTitle: () => {
          return (
            <View>
              <Text style={{ fontSize: 16 }}>Assignments</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>{route.params.subjectKey}</Text>
            </View>
          )
        }
      }}>
        <AssignmentsStack.Screen name="Assignments" children={() => (
          <Assignments subject={route.params.subjectKey} navigation={navigation} />
        )}>
        </AssignmentsStack.Screen>
        <AssignmentsStack.Screen name="Sub Directory" component={SubAssignments} />
      </AssignmentsStack.Navigator>
    )
  }


  return (
    userData.loading
      ? <Loading />
      : <Stack.Navigator>
        {userData.data.fullName == undefined
          ? <Stack.Screen name="SignUp2" component={SignUp2} options={{ headerShown: false }} />
          : null}
        {userData.data.subject == undefined
          ? <Stack.Screen name="AddSubject" component={AddSubject} options={style.addSubjectHeader} />
          : null}
        <Stack.Screen name="Home" component={TabsScreen} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="Add Post" component={AddPost} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="LiveClass" component={LiveClass} options={{
          headerShown: false
        }} />
        {/* <Stack.Screen name="AddSubjects" component={AddSubjects} options={style.subjectHeader}/> */}
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="StudyMaterial" component={StudyMaterial} />
        <Stack.Screen name="Assignments" component={Assignments} />
        <Stack.Screen name="SelectUser" component={SelectUser} />
      </Stack.Navigator>
  )
};

const style = {
  subjectHeader: {

    headerTitleStyle: {
      alignSelf: 'center',
      fontSize: 16,
      color: 'white',
      fontFamily: 'Open Sans'
    },
    headerStyle: {
      backgroundColor: Colors.PRIMARY
    }
  },
  addSubjectHeader: {
    headerLeft: null,
    headerTitleStyle: {
      fontSize: 16,
      alignSelf: 'center'
    },
    title: 'Add Subjects'
  }
}

export default TeacherRoutes;
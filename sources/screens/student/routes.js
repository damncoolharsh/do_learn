import React, {useContext, useEffect, useState} from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../profile"
import TabsScreen from "./Tabs"
import {Loading} from 'sources/component/atoms/index';
import {LiveClass} from "sources/component/organisms";
import {AuthContext} from 'sources/providers/authProvider'
import Conversation from "sources/screens/conversation";
import {UserProfile} from 'sources/screens/users/index'
import {
    Assignments,
    StudyMaterial,
    SelectUser
} from 'sources/screens/classwork/index'
import {Colors} from 'styles'
import AddTeacher from './addTeacher'
import database from '@react-native-firebase/database'
import SignUp2 from 'sources/screens/auth/signUp/signUp2'

const Stack = createStackNavigator();

const StudentRoutes = ()=>{
    const {userData} = useContext(AuthContext)
    const [teachers, setTeachers] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        database().ref(`/teachers_list/${userData.data.id}`).once('value', value=>{
            setTeachers(value.val())
            setLoading(false)
        })
    }, [])

    return (
        loading
        ? <Loading />
        : <Stack.Navigator>
            {userData.data.fullName == undefined
            ? <Stack.Screen name="SignUp2" component={SignUp2} options={{headerShown: false}}/>
            : null}
            <Stack.Screen name="Home" component={TabsScreen} options={{
                headerShown: false,
            }}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="LiveClass" component={LiveClass} options={{
                headerShown: false,
            }}/>
            <Stack.Screen name="UserProfile" component={UserProfile}/>
            <Stack.Screen name="Conversation" component={Conversation}/>
            <Stack.Screen name="StudyMaterial" component={StudyMaterial}/>
            <Stack.Screen name="Assignments" component={Assignments}/>
            <Stack.Screen name="AddTeacher" component={AddTeacher} options={style.addTeacher}/>
            <Stack.Screen name="SelectUser" component={SelectUser}/>
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
    addTeacher: {
        headerTitleStyle: {
            fontSize: 16,
            color: 'white',
            fontFamily: 'Open Sans'
        },
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: Colors.PRIMARY
        }
    }
}

export default StudentRoutes;
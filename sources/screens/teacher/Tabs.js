import React, {useContext} from 'react'
import {View, TouchableOpacity, Dimensions} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {StackScreen} from 'sources/component/organisms/index'
import {
    HomeIcon,
    NoticesIcon,
    UsersIcon
} from 'sources/assets/index'
import {
    Dashboard,
} from './index'
import UserList from '../users/usersList'
import {AuthContext} from 'sources/providers/authProvider'
import { createStackNavigator } from '@react-navigation/stack'
import {Notices} from 'sources/screens/teacher/notices/index'

const Tabs = createBottomTabNavigator();
const ClassworkStack = createStackNavigator()
const height = Dimensions.get('window').height;

const TabsScreen = () => {
    return (
        <Tabs.Navigator
        tabBarOptions={{
            style: {
                height: height * 0.08,
                paddingBottom: 5
            },
            activeTintColor: 'blue'
        }}>

            <Tabs.Screen name="Dashboard" 
                options={{
                    tabBarIcon: (props)=>(
                    <HomeIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
                    )
                }}
                children={()=>(
                    <StackScreen name="Dashboard" screen={Dashboard} />
                )}/>

            <Tabs.Screen name="Notices" 
                options={{
                    tabBarIcon: (props)=>(
                    <NoticesIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
                    )
                }}
                children={()=>(
                    <StackScreen name="Notices" screen={Notices} />
                )}/>
            <Tabs.Screen name="Students" 
                options={{
                    tabBarIcon: (props)=>(
                      <UsersIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
                    )
                  }}
                children={()=>(
                    <StackScreen name="Students" screen={UserList} />
                )}/>
        </Tabs.Navigator>
    )
};

export default TabsScreen



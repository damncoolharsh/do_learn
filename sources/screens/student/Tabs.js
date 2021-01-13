import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Dimensions, Text} from 'react-native';
import {Classroom, NoticeBoard, Teachers, Classwork} from './index';
import {UserList} from '../users/index'
import {
  HomeIcon,
  NoticesIcon,
  UsersIcon
} from 'sources/assets/index'
import {header, StackScreen} from 'sources/component/organisms';
import { createStackNavigator } from '@react-navigation/stack';

const windowHeight = Dimensions.get('window').height;
const Tabs = createBottomTabNavigator();
const ClassroomStack = createStackNavigator()

const TabsScreen = () => (
  <Tabs.Navigator
    tabBarOptions={{
      style: {
        paddingBottom: 5,
        height: windowHeight * 0.08,
      },
    }}>
    <Tabs.Screen 
      options={{
        tabBarIcon: (props)=>(
          <HomeIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
        )
      }}
      name="Classroom" children={()=>(
          <StackScreen name="Classroom" screen={Classroom} />
      )}/>

    <Tabs.Screen 
      options={{
        tabBarIcon: (props)=>(
          <NoticesIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
        )
      }}
      name="Notice Board" children={()=>(
          <StackScreen name="NoticeBoard" screen={NoticeBoard} />
      )}/>

    <Tabs.Screen 
      options={{
        tabBarIcon: (props)=>(
          <UsersIcon width={props.size} height={props.size} style={{color: props.focused ? props.color : 'gray'}} />
        )
      }}
      name="Teachers" children={()=>(
          <StackScreen name="Teachers" screen={UserList} />
      )}/>
  </Tabs.Navigator>
);

export default TabsScreen;

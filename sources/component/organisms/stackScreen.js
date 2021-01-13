import React from 'react'
import {View, Text} from 'react-native'
import {TouchableOpacity} from "react-native-gesture-handler";
import Profile from 'sources/assets/profilePic'
import {Colors} from "../../styles";
import {createStackNavigator} from "@react-navigation/stack";
import SelectSubject from 'sources/screens/selectSubject'

const Stack = createStackNavigator();
const StackScreen = ({name, screen})=> (
    <Stack.Navigator>
        <Stack.Screen
            name={name}
            component={screen}
            options={Header}/>
    </Stack.Navigator>
);

const Header = ({navigation})=>({
    headerLeft: ()=>(
        <TouchableOpacity onPress = {()=>{navigation.push('Profile')}}>
            <View style = {{
                marginLeft: 25, borderWidth: 1, padding: 1, borderRadius: 20, borderColor: 'white'}}>
                <Profile width={36} height={36}/>
            </View>
        </TouchableOpacity>
    ),
    headerTintColor: Colors.WHITE,
    headerTitleStyle: {
        fontSize: 16,
        marginLeft: 5,
        letterSpacing: 1,
        fontWeight: 'normal'
    },
    headerStyle: {
        backgroundColor: Colors.PRIMARY
    }
})

export {
    StackScreen
}
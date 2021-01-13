import React, {useEffect, useContext, useState} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import Profile from 'assets/profile.svg'
import { Mixins } from 'styles';
import { AuthContext } from 'sources/providers/authProvider';
import { DataContext } from 'sources/providers/dataProvider';
import database from '@react-native-firebase/database'

const SelectUser = ({navigation, route})=>{
    const {userData} = useContext(AuthContext)
    const [users, setUsers] = useState(null)
    const type = userData.data.occupation

    useEffect(()=>{
        if(type == 'Teacher'){
            database().ref(`/students_list/${userData.data.id}/allStudents`).once('value', value=>{
                setUsers(value.val())
            })
        }else{
            database().ref(`/teachers_list/${userData.data.id}/`).once('value', value=>{
                setUsers(value.val())
            })
        }

        navigation.setOptions({
            title: "Select User"
        })
    }, [])

    const onShare = async ()=>{
        try{
            await Share.share({
                message: `${userData.data.id}`
            })
        }catch(e){
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white', ...Mixins.padding(0, 20)}}>
            <Text style={{fontWeight: 'bold', paddingTop: 14}}>{type == "Teacher" ? "Student Assignments": "Teachers"}</Text>
            {users != null
            ? Object.keys(users).map(userId=>(
            <TouchableOpacity 
                key={userId} style={{paddingVertical: 10}}
                onPress={()=>{
                    if(type == "Teacher"){
                        navigation.push(route.params.keyword, {studentId: userId})
                    }else{
                        navigation.push(route.params.keyword, {teacherId: userId})
                    }
                }}>
                <View style={{flexDirection: 'row', ...Mixins.padding(10), alignItems: 'center'}}>
                    <Profile width={42} width={42} />
                    <View style={{paddingLeft: 14}}>
                        <Text style={{}}>{users[userId]}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>{userId}</Text>
                    </View>
                </View>
            </TouchableOpacity>))
            : null}
        </View>
    )
};

export default SelectUser
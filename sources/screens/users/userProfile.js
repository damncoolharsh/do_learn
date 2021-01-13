import React, {useContext, useEffect, useState} from 'react'
import {Text, View, Alert, StatusBar, ActivityIndicator} from 'react-native'
import {Center, NButton, Padding, ProfileHeader, Card} from 'sources/component/atoms'
import database from '@react-native-firebase/database'
import { Colors } from 'styles'
import DataContext from 'sources/providers/dataProvider'
import storage from '@react-native-firebase/storage'
import { AuthContext } from 'sources/providers/authProvider'

const UserProfile = ({navigation, route}) => {
    const {userData} = useContext(AuthContext)
    const [profile, setProfile] = useState(null)

    useEffect(()=>{
        navigation.setOptions({
            title: "",
            headerStyle: {
                backgroundColor: Colors.HEAD
            },
            headerTintColor: 'white'
        })
        database().ref(`/users/${route.params.userId}`).once('value', async value=>{
            const ref = storage().ref(`/${route.params.userId}/profile.jpg`)
            var url
            try{
                url = await ref.getDownloadURL()
            }catch(e){
                console.log(e)
            }
            const data = {...value.val(), picUrl: url}
            setProfile(data)
        })
    },[])

    const userConfirmation = ()=>{
        Alert.alert(
            "Are you Sure",
            "Do yo really want to remove this person?",
            [
                {
                    text: 'No'
                },
                {
                    text: 'Yes',
                    onPress: ()=>{
                        removeUser()
                    }
                }
            ]
        )
    }

    const removeUser = async ()=>{
        if(profile.occupation == "Student"){
            try{
                await database().ref(`/students_list/${userData.data.id}/allStudents`)
                    .child(route.params.userId).remove().then(()=>{
                        database().ref(`/teachers_list/${profile.id}/`).child(userData.data.id).remove().then(()=>{
                            navigation.goBack()
                        })
                })
            }catch(e){
                console.log(e)
            }
        } else{
            try{
                await database().ref(`/teachers_list/${userData.data.id}`)
                    .child(route.params.userId).remove().then(()=>{
                    database().ref(`/students_list/${profile.id}/allStudents`).child(userData.data.id).remove().then(()=>{
                        navigation.goBack()
                    })
                })
            }catch(e){
                console.log(e)
            }
        }   
    }

    return (profile == null
        ? <Center>
            <ActivityIndicator size='large' color='blue'/>
        </Center>
        : <View>
            <StatusBar backgroundColor={Colors.HEAD} />

            <ProfileHeader title={profile.fullName} locked={true} image={profile.picUrl}>
                <NButton textColor='white' onPress={userConfirmation}>Remove</NButton>
            </ProfileHeader>

            <Card>
                <Text style={{color: '#8D8B8B', marginBottom: 10}}>{profile.occupation} ID</Text>
                <Text style={{marginBottom: 20}}>{profile.id}</Text>

                <Text style={{color: '#8D8B8B', marginBottom: 10}}>Email</Text>
                <Text style={{marginBottom: 20}}>{profile.email}</Text>

                <Text style={{color: '#8D8B8B', marginBottom: 10}}>Contact No.</Text>
                <Text style={{marginBottom: 20}}>{profile.mobile}</Text>

                {profile.occupation == "Teacher"
                ? <View>
                    <Text style={{color: '#8D8B8B', marginBottom: 10}}>Subject</Text>
                    <Text style={{marginBottom: 10}}>{profile.subject}</Text>
                    <Padding value={10} />
                </View> 
                : null}
            </Card>
        </View>
    )
};

export default UserProfile
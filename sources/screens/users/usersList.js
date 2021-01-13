import React, { useContext, useEffect, useState } from 'react'
import {View, Text, Image} from 'react-native'
import Profile from 'sources/assets/profile.svg'
import {CButton, Center} from 'sources/component/atoms'
import { UniqueId } from 'sources/component/organisms'
import { Colors, Mixins } from 'styles'
import { AuthContext } from 'sources/providers/authProvider'
import database from '@react-native-firebase/database'
import { TouchableOpacity } from 'react-native-gesture-handler'
import storage from '@react-native-firebase/storage'

const UserList = ({navigation}) => {
    const {userData} = useContext(AuthContext)
    const [users, setUsers] = useState(null)
    const occupation = userData.data.occupation
    console.log(users)
    useEffect(()=>{
        if(occupation == "Teacher"){
            database().ref(`/students_list/${userData.data.id}`).on('value', value=>{
                var data = value.val()
                const promises = []
                if(data){
                    if(data.requests){
                        Object.keys(data.requests).map(key=>{
                            const ref = storage().ref(`/${key}/profile.jpg`)
                            promises.push(ref.getDownloadURL().then(url=>{
                                data.requests[key] = {name: data.requests[key], picUrl: url}
                            }).catch(e=>{
                                data.requests[key] = {name: data.requests[key]}
                            }))
                        })
                    }
                    if(data.allStudents){
                        Object.keys(data.allStudents).map(key=>{
                            const ref = storage().ref(`/${key}/profile.jpg`)
                            promises.push(ref.getDownloadURL().then(url=>{
                                data.allStudents[key] = {name: data.allStudents[key], picUrl: url}
                            }).catch(e=>{
                                data.allStudents[key] = {name: data.allStudents[key]}
                            }))
                        })
                    }
                }
                Promise.all(promises).then(()=>{
                    setUsers(data)
                }).catch(e=>{
                    console.log(e)
                })
            })
        } else{
            database().ref(`/teachers_list/${userData.data.id}`).on('value', value=>{
                var data = value.val()
                const promises = []
                if(data){
                    Object.keys(data).map( key=>{
                        promises.push(storage().ref(`/${key}/profile.jpg`).getDownloadURL().then(url=>{
                            data[key] = {name: data[key], picUrl: url}
                        }).catch(e=>{
                            data[key] = {name: data[key]}
                        }))
                    })
                }
                Promise.all(promises).then(()=>{
                    console.log(data)
                    setUsers(data)
                }).catch(e=>{
                    console.log(e)
                })
            }) 
        }
        
    },[])

    const onAccept = async (key)=>{
        database().ref(`/students_list/${userData.data.id}/allStudents`).child(key.toString()).set(users.requests[key].name)
        database().ref(`/teachers_list/${key}`).child(userData.data.id.toString()).set(userData.data.fullName)
        database().ref(`/students_list/${userData.data.id}/requests`).child(key.toString()).set(null)
    }

    const onCencel = async (key)=>{
        database().ref(`/students_list/${userData.data.id}/requests`).child(key).set(null)
    }
    
    return (
        <View style={style.screen}>
            {occupation == "Teacher"
            ? <View>
                {/* <View style={style.teacherId}>
                    <UniqueId />
                </View> */}
                <View style={style.card}>
                    <Text style={style.card.header}>Students requests</Text>
                    {users != null && users.requests != null
                    ? Object.keys(users.requests).map(item=>
                    <View key={item} style={style.studentRequest}>
                        <TouchableOpacity onPress={()=>{navigation.push("UserProfile", {userId: item})}}>
                        {users.requests[item].picUrl
                        ? <Image 
                            style={{width: 42, height: 42, borderRadius: 21}}
                            source={{uri: users.requests[item].picUrl}}
                        />
                        : <Profile width={42} height={42} />}
                        </TouchableOpacity>
                        <View style={style.studentRequest.info}>
                            <Text style={style.studentRequest.title}>{users.requests[item].name}</Text>
                            <View style={style.studentRequest.buttons}>
                                <CButton customStyle={{marginRight: 10}}
                                    onPress={()=>onAccept(item)}>Accept</CButton>
                                <CButton customStyle={{backgroundColor: Colors.DISCARD}}
                                    onPress={()=>onCencel(item)}>Cencel</CButton>
                            </View>
                        </View>
                    </View>)
                    : <Text style={{color: 'gray'}}>No student requests yet</Text>}
                </View>
            </View>
            : null}
            {occupation == "Student"
            ? <View style={{...style.card, alignItems: 'center'}}>
                <Text style={{letterSpacing: 1, fontSize: 16, textAlign: 'center', paddingBottom: 8}}>Tell your teacher to join doLearn app and ask them their unique id</Text>
                <CButton onPress={()=>{navigation.push("AddTeacher")}}>Add Teacher</CButton>
            </View>
            : null}
            <View style={style.card}>
                <Text style={style.card.header}>{userData.data.occupation == "Teacher" ? "Your Students" : "Your Teachers"}</Text>
                {userData.data.occupation == "Teacher"
                ? users != null && users.allStudents != null
                    ? Object.keys(users.allStudents).map(item=>
                    <View key={item} style={style.allStudents}>
                        <TouchableOpacity onPress={()=>{navigation.push("UserProfile", {userId: item})}}>
                        {users.allStudents[item].picUrl
                        ? <Image 
                            style={{width: 42, height: 42, borderRadius: 21}}
                            source={{uri: users.allStudents[item].picUrl}}
                        />
                        : <Profile width={42} height={42} />}
                        </TouchableOpacity>
                        <View style={style.studentRequest.info}>
                            <Text style={style.allStudents.title}>{users.allStudents[item].name}</Text>
                            <Text style={style.allStudents.uid}>{item}</Text>
                        </View>
                    </View>)
                    : <Text style={{color: 'gray'}}>No Students available yet</Text>
                : users != null
                    ? Object.keys(users).map(item=>
                        <View key={item} style={style.allStudents}>
                            <TouchableOpacity onPress={()=>{navigation.push("UserProfile", {userId: item})}}>
                            {users[item].picUrl
                            ? <Image 
                                style={{width: 42, height: 42, borderRadius: 21}}
                                source={{uri: users[item].picUrl}}
                            />
                            : <Profile width={42} height={42} />}
                            </TouchableOpacity>
                            <View style={style.studentRequest.info}>
                                <Text style={style.allStudents.title}>{users[item].name}</Text>
                                <Text style={style.allStudents.uid}>{item}</Text>
                            </View>
                        </View>)
                    : <Text style={{color: 'gray'}}>No Teachers available yet</Text>}
            </View>
        </View>
    )
};

const style = {
    screen: {
        backgroundColor:'#F2F3FE', 
        flex: 1, 
        paddingBottom: 10
    },
    teacherId: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        marginBottom: 14
    },
    card: {
        backgroundColor: 'white',
        ...Mixins.padding(16, 24),
        marginBottom: 12,
        header: {
            paddingBottom: 10,
            fontSize: 14,
            fontWeight: 'bold',
        },
    },
    studentRequest: {
        flexDirection: 'row',
        alignItems: 'center',
        info: {
            ...Mixins.padding(0, 16),
            justifyContent: 'center'
        },
        title: {
            ...Mixins.padding(0, 0, 5)
        },
        buttons: {
            flexDirection: 'row',

        }
    },

    allStudents: {
        flexDirection: 'row',
        alignItems: 'center',
        ...Mixins.padding(8),
        title: {
            fontWeight: 'bold',
        },
        uid: {
            color: 'gray',
            fontSize: 12
        }
    }
}

export default UserList
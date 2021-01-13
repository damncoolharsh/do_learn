import React, { useContext, useState } from 'react'
import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import {SelectButton} from 'sources/component/atoms/index'
import { AuthContext } from 'sources/providers/authProvider'
import {Menu, Dialog, Button, ActivityIndicator} from 'react-native-paper'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'

export default function Subjects({navigation}) {
    const {userData, setUserData} = useContext(AuthContext)
    const [visible, setVisible] = useState({})
    const subjects = userData.data.subjects
    const [newName, setNewName] = useState('')
    const [selected, setSelected] = useState()
    const [loading, setLoading] = useState(false)
    const [dialogVisible, setDialogVisible] = useState(false)

    const changeName = ()=>{
        if(newName != ""){
            database().ref(`/users/${userData.data.id}/subjects/${selected}`).child('name').set(newName)
            setDialogVisible(false)
        }
    }

    const removeSubject = ()=>{
        Alert.alert(
            "Are you Sure?",
            "Do you want to delete subject and all files along with it?",
            [
                {
                    text: 'Yes',
                    onPress: ()=>{
                        var files = []
                        database().ref(`/study_material/${userData.data.id}`).once('value', value=>{
                            if(value.val()){
                                Object.keys(value.val()).map(key=>{
                                    files.push(value.val()[key].fileName)
                                })
                            }
                        })
                        if(files.length > 0){
                            files.map(file=>{
                                storage().ref(`/${userData.data.id}/study_material/${selected}/${file}`).delete()
                            })
                        }
                       

                        database().ref(`/students_list/${userData.data.id}`).on('value', value=>{
                            if(value.val()){
                                Object.keys(value.val().allStudents).map(key=>{
                                    var studentFiles = []
                                    database().ref(`/assignments/${key}/${selected}`).on('value', files=>{
                                        if(files.val()){
                                            Object.keys(files.val()).map(fileKey=>{
                                                studentFiles.push(files.val()[fileKey].fileName)
                                            })
                                        }
                                    })
                                    studentFiles.map(file=>{
                                        storage().ref(`/${key}/assignments/${selected}/${file}`).delete()
                                    })
                                })
                            }
                        })
                        console.log(selected)
                        database().ref(`/users/${userData.data.id}/subjects/${selected}`).child('name').set(null)
                        database().ref(`/users/${userData.data.id}/subjects`).once('value', (value)=>{
                            if(value.val() == null){
                                navigation.navigate()
                            }
                        })
                    }
                },
                {
                    text: 'No'
                }
            ]
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: '#F2F3FE'}}>
            <View style={style.addSubject}>
                <SelectButton onPress={()=>{navigation.push('AddSubjects')}}>Add New Subject</SelectButton>
            </View>
            <View style={style.allSubjects}>
                <Text style={style.allSubjects.title}>All Subjects</Text>
                {loading
                ? <ActivityIndicator size='large' color="green"/>
                : <ScrollView>
                    {subjects != undefined
                    ? Object.keys(subjects).map(key=>(
                    <Menu
                        key={key}
                        visible={visible[key] == undefined ? false : true}
                        style={{position: 'absolute', right: 0, alignItems: 'flex-end'}}
                        onDismiss={()=>{setVisible(false)}}
                        anchor={
                            <TouchableOpacity 
                            style={{paddingVertical: 5, paddingHorizontal: 10}}
                            onPress={()=>{
                                setVisible(()=>{
                                    const temp = {}
                                    temp[key] = true
                                    return temp
                                })
                                setSelected(key)}}>
                                <View style={style.subject}>
                                    <Text>{subjects[key].name}</Text>
                                </View>
                            </TouchableOpacity>
                        }>
                        <Menu.Item onPress={()=>{
                            setVisible(false)
                            setDialogVisible(true)
                            setSelected(key)
                        }} title="Edit Name" />
                        <Menu.Item onPress={removeSubject} title="Remove" />
                    </Menu>
                    ))
                    : null}
                </ScrollView>}
            </View>
            <Dialog onDismiss={()=>{setDialogVisible(false)}} visible={dialogVisible}>
                <Dialog.Title>Change Name</Dialog.Title>
                <Dialog.Content>
                    <TextInput 
                        style={style.inputBox} 
                        value={newName} 
                        onChangeText={text=>{setNewName(text)}}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={()=>{setDialogVisible(false)}}>Cencel</Button>
                    <Button onPress={changeName}>Change</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}

const style = {
    addSubject: {
        alignItems: 'center',
        marginBottom: 14,
        backgroundColor: 'white',
        padding: 8
    },
    inputBox: {
        paddingLeft: 15, 
        borderRadius: 8, 
        borderWidth: 0.3, 
        borderColor: 'gray',
        marginRight: 10,
        paddingVertical: 6
    },
    allSubjects: {
        padding: 20,
        backgroundColor: 'white',
        title: {
            fontWeight: 'bold',
            paddingBottom: 14
        }
    },
    subject: {
        backgroundColor: '#B9E0ED',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    }
}

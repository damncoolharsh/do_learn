import React, { useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { Files } from 'sources/component/organisms'
import {Mixins} from 'styles'
import database from '@react-native-firebase/database'
import { AuthContext } from 'sources/providers/authProvider'
import { DataContext } from 'sources/providers/dataProvider'
import {
    BottomContainer,
    CButton
} from 'sources/component/atoms/index'

export default function Assignments({route}) {
    const [files, setFiles] = useState(null)
    const {addFile} = useContext(DataContext)
    const {userData} = useContext(AuthContext)
    const type = userData.data.occupation

    const storageUrl = `${userData.data.id}/assignments/${route.params.teacherId}`
    const databaseUrl = `/assignments/${userData.data.id}/${route.params.teacherId}`

    useEffect(()=>{
        if(type == "Teacher"){
            database().ref(`/assignments/${route.params.studentId}/${userData.data.id}`)
            .on('value', value=>{
                setFiles(value.val())
            })
        }else{
            database().ref(`/assignments/${userData.data.id}/${route.params.teacherId}`)
            .on('value', value=>{
                setFiles(value.val())
            })
        }
    }, [setFiles])

    return (
        <View style={{flex: 1, backgroundColor: 'white', ...Mixins.padding(0, 20)}}>
            {userData.data.occupation == "Student"
            ? <View style={{position: 'absolute', bottom: 0}}>
                <BottomContainer>
                    <CButton onPress={()=>(addFile(databaseUrl, storageUrl))}>Add File</CButton>
                </BottomContainer>
            </View>
            : null}
            <Text style={{fontWeight: 'bold', paddingTop: 14}}>{type == "Teacher" ? "Student Assignments" : "Your Assignments"}</Text>
            <Files 
                files={files} 
                storageUrl={type == "Teacher" ? `${route.params.studentId}/assignments/${userData.data.id}`: `${userData.data.id}/assignments/${route.params.teacherId}`}
                databaseUrl={type == "Teacher" ? `/assignments/${route.params.studentId}/${userData.data.id}`: `/assignments/${userData.data.id}/${route.params.teacherId}`}
            />
        </View>
    )
}

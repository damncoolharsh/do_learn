import React, {useEffect, useContext, useState} from 'react'
import {View, Text} from 'react-native'
import {BottomContainer, CButton, Center} from 'sources/component/atoms'
import { Mixins } from 'styles';
import { AuthContext } from 'sources/providers/authProvider';
import { DataContext } from 'sources/providers/dataProvider';
import {Files} from 'sources/component/organisms'
import database from '@react-native-firebase/database'

const StudyMaterial = ({navigation, route})=>{
    const {userData} = useContext(AuthContext)
    const {addFile} = useContext(DataContext)
    const [files, setFiles] = useState(null)
    const id = userData.data.occupation == "Teacher" ? userData.data.id : route.params.teacherId
    const storageUrl = `${id}/study_material/`
    const databaseUrl = `/study_material/${id}`

    useEffect(()=>{
        navigation.setOptions({
            headerTitleStyle: {
                fontSize: 16
            },
            headerTitle: (props)=>{
                return (
                    <View>
                        <Text style={{fontSize: 16}}>Study Material</Text>
                        <Text style={{fontSize: 12, color: 'gray'}}>{userData.data.subject}</Text>
                    </View>
                )
            }
        })

        database().ref(databaseUrl).on('value', value=>{
            setFiles(value.val())
        })
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: 'white', ...Mixins.padding(0, 20)}}>
            {userData.data.occupation == "Teacher"
            ? <View style={{position: 'absolute', bottom: 0}}>
                <BottomContainer>
                    <CButton onPress={()=>(addFile(databaseUrl, storageUrl))}>Add File</CButton>
                </BottomContainer>
            </View>
            : null}
            <Text style={{fontWeight: 'bold', paddingTop: 14}}>Your Files</Text>
            <Files files={files} storageUrl={storageUrl} databaseUrl={databaseUrl}/>
        </View>
    )
};

export default StudyMaterial
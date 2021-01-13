import React, { useContext, useEffect, useState } from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native'
import { Colors, Mixins } from 'styles'
import { CButton, NButton, Row, SelectButton, Padding } from 'sources/component/atoms'
import Profile from 'sources/assets/profile.svg'
import { AuthContext } from 'sources/providers/authProvider'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'

const Classroom = ({navigation})=>{
    const {userData} = useContext(AuthContext)
    const [live_classes, setLiveClasses] = useState({})
 
    useEffect(()=>{
        const dataRef = []
        database().ref(`/teachers_list/${userData.data.id}`).once('value', teachers=>{
            var classes = {}
            if(teachers.val()){
                Object.keys(teachers.val()).map(key=>{
                    dataRef.push(database().ref(`/users/${key}`))
                    database().ref(`/users/${key}`).on('value', async teacher=>{
                        if(teacher.val()){
                            const temp = {...classes}
                            if(teacher.val().live_class){     
                                const ref = storage().ref(`/${key}/profile.jpg`)
                                var url
                                try{
                                    url = await ref.getDownloadURL()
                                }catch(e){
                                    console.log(e)
                                }
                                temp[key] = {
                                    name: teacher.val().fullName,
                                    teacherId: key,
                                    picUrl: url,
                                    subject: teacher.val().subject
                                }
                            } else{
                                delete temp[key]
                            }
                            classes = {...temp}
                        }
                        setLiveClasses(classes)
                    })
                })
            } else{
                setLiveClasses(null)
            }
        })

        return ()=>{
            dataRef.forEach(val=>{
                val.off()
            })
        }
    }, [])

    return (
        <View style={{backgroundColor:'#F2F3FE', flex: 1}}>
            {live_classes == null
            ? <View style={{...style.card, alignItems: 'center'}}>
                <Text style={{letterSpacing: 1, fontSize: 16, textAlign: 'center', paddingBottom: 8}}>Tell your teacher to join doLearn app and ask them their unique id</Text>
                <CButton onPress={()=>{navigation.push("AddTeacher")}}>Add Teacher</CButton>
            </View>
            : null}
            <View style={{marginBottom: 10}}>
                <View style={style.takeClass}>
                    <View style={{paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'white', justifyContent: 'center'}}>
                        {/* <Text style={{paddingVertical: 14}}>Selection</Text> */}
                        <SelectButton onPress={()=>{navigation.push('SelectUser', {keyword: 'StudyMaterial'})}}>Study Material</SelectButton>
                        <Padding value={8} />
                        <SelectButton onPress={()=>{navigation.push('SelectUser', {keyword: 'Assignments'})}}>Assignments</SelectButton>
                    </View>
                    
                </View>
            </View>
            <View style={{backgroundColor: 'white', padding: 20}}>
                <Text style={{fontWeight: 'bold', paddingBottom: 14}}>Live Classes</Text>
                {live_classes  && Object.keys(live_classes).length > 0
                ? Object.keys(live_classes).map(key=>
                <TouchableOpacity
                    onPress={()=>{navigation.push('LiveClass', {roomId: live_classes[key].teacherId, userId: userData.data.id})}}
                    key={key} 
                    style={style.liveClass}>
                    {live_classes[key].picUrl
                    ? <Image 
                        style={{width: 42, height: 42, borderRadius: 21}}
                        source={{ uri: live_classes[key].picUrl}}
                    />
                    : <Profile width={42} height={42} />}
                    <View style={{marginLeft: 14}}>
                        <Text style={{fontWeight: 'bold'}}>{live_classes[key].name}</Text>
                        <Text style={{color: 'gray'}}>{live_classes[key].subject}</Text>
                    </View>
                    <View style={{backgroundColor: 'orange', position: 'absolute', right: 5, bottom: 5, borderRadius: 8}}>
                        <Text style={{color: 'white', padding: 4, fontSize: 12}}>Live Now</Text>
                    </View>
                </TouchableOpacity>)
                : <Text style={{color: 'lightgray', paddingLeft: 15}}>No Classes Available Right Now</Text>}
            </View>
        </View>
    )
}

const style = {
    takeClass: {
        padding: 24,
        // elevation: 2,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    liveClass: {
        elevation: 2, 
        backgroundColor: 'white', 
        borderRadius: 12, 
        padding: 20, 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        ...Mixins.padding(16, 24),
        marginBottom: 12,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
}

export default Classroom
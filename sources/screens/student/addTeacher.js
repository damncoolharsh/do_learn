import React, { useState, useContext } from 'react'
import {ScrollView, ActivityIndicator, View, Text, StyleSheet} from 'react-native'
import { Colors, Mixins, Typography } from 'styles'
import {CButton, Row, NButton} from 'sources/component/atoms/index'
import { TextInput } from 'react-native-gesture-handler'
import database from '@react-native-firebase/database'
import {AuthContext} from 'sources/providers/authProvider'

export default function AddTeacher({navigation}) {
    const [subjects, setSubjects] = useState([])
    const [id, setId] = useState({
        entry: "",
        loading: false
    })
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const addTeacher = async ()=>{
        if(id.entry == "" || id.entry.length < 10){
            alert("Please Enter Valid Teacher ID")
        } else{
            setId({...id, loading: true})
            const enteredId = parseInt(id.entry)
            database().ref(`/students_list/${enteredId}/requests/`).child(userData.data.id.toString())
                .set(userData.data.fullName)
            
            setId({...id, loading: false})
            alert("Successfully sent request to teacher, tell teacher to accept your request")
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={style.desc}>
                <Text style={style.info}>To enjoy learning it is required to add teachers 
                who are going to teach you. Send Request to your teacher by their given id.
                </Text>
            </View>
            <View style={style.container}>
                <Text style={style.title}>Enter Teacher ID</Text>
                <View customStyle={{justifyContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput
                        keyboardType='numeric'
                        value={id.entry} 
                        style={style.inputBox} 
                        onChangeText={(text)=>(setId({...id, entry: text}))}/>
                    {loading
                    ? <ActivityIndicator color="blue" />
                    : <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 15}}>
                        <CButton customStyle={{ alignItems: 'center', marginRight: 15}}
                            onPress={addTeacher}>Add Teacher</CButton>
                        <NButton onPress={()=>{navigation.navigate("Home")}} textColor={Colors.PRIMARY}>
                            Skip
                        </NButton>
                    </View>}
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderColor: 'gray',
        padding: 20
    },
    desc: {
        margin: 20
    },
    info: {
        color: Colors.GRAY,
        ...(Typography.FONT_SANS_REGULAR),
        fontSize: 14,
    },

    title: {
        ...(Typography.FONT_SANS_REGULAR),
        color: 'black',
        paddingBottom: 8
    },
    inputBox: {
        borderWidth: 0.3,
        paddingLeft: 10,
        marginRight: 15,
        // width: Mixins.WINDOW_WIDTH * 0.70,
        height: Mixins.WINDOW_WIDTH * 0.12,
        borderRadius: 5
    },

    subjectBox: {
        backgroundColor: Colors.PRIMARY,
        alignItems: 'stretch',
        flexDirection: 'row',
        margin: 10
    },

    subjectText: {
        color: 'white',
        padding: 10
    },
    remove:{
        position: 'absolute',
        right: 20, 
        alignSelf: 'center'
    }
})


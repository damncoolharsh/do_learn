import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors, Mixins, Typography } from 'styles'
import {CButton, Row, BottomContainer} from 'sources/component/atoms/index'
import { TextInput } from 'react-native-gesture-handler'
import database from '@react-native-firebase/database'
import {AuthContext} from 'sources/providers/authProvider'

export default function AddSubject({navigation}) {
    const [entry, setEntry] = useState("")
    const {userData} = useContext(AuthContext)

    const submitData = async ()=>{
        if(entry.length > 2 && entry.match(/[a-zA-Z0-9]+/)){
            database().ref(`/users/${userData.data.id}`).child('subject').set(entry)
            navigation.navigate("Home")
        }else{
            alert("Please enter valid subject name.")
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={style.desc}>
                <Text style={style.info}>Enter the name of subject you are going to teach. Subject name shoud be greator then 2 letters.
                </Text>
            </View>
            <View style={style.container}>
                <Text style={style.title}>Enter Subject Name</Text>
                <TextInput value={entry} style={style.inputBox} onChangeText={(text)=>(setEntry(text))}/>
                <View style={{alignItems: 'flex-end', paddingTop: 10}}>
                    <CButton onPress={submitData}>Add Subject</CButton>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white'
    },
    desc: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 10
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


import React, { useContext, useEffect, useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Profile from 'sources/assets/profile.svg'
import database from '@react-native-firebase/database'
import { AuthContext } from 'sources/providers/authProvider'
import storage from '@react-native-firebase/storage'
import {Mixins} from 'styles'
import {CButton} from 'sources/component/atoms/index'

export default NoticeBoard = ({navigation})=>{
    const {userData} = useContext(AuthContext)
    const [posts, setPosts] = useState({})

    useEffect(()=>{
        const noticeRef = database().ref(`/notices/${userData.data.id}`)
        noticeRef.on('value', notices=>{
            if(notices.val()){
                const data = {}
                const snap = notices.val()
                const promises = []
                Object.keys(snap).map(key=>{
                    promises.push(database().ref(`/users/${snap[key].teacher_id}`).once('value', async value=>{
                        data[key] = {...snap[key], name: value.val().fullName}
                    }))
                })
                Promise.all(promises).then(()=>{
                    var temp = Object.keys(data).map(async key=>{
                        try {
                            const url = await storage().ref(`/${snap[key].teacher_id}/profile.jpg`).getDownloadURL();
                            data[key] = {
                                ...data[key],
                                picUrl: url
                            };
                        } catch (e) {console.log(e)}
                    })
                    Promise.all(temp).then(()=>{
                        setPosts(data)
                    })
                })
            } else{
                setPosts(null)
            }
        })

        return ()=>{
            noticeRef.off()
        }

    }, [])
    return (
        <View style={{}}>
            {posts == null
            ? <View style={{...style.card, alignItems: 'center', marginBottom: 10}}>
                <Text style={{letterSpacing: 1, fontSize: 16, textAlign: 'center', paddingBottom: 8}}>Tell your teacher to join doLearn app and ask them their unique id</Text>
                <CButton onPress={()=>{navigation.push("AddTeacher")}}>Add Teacher</CButton>
            </View>
            : null}
            {posts != null && Object.keys(posts).length > 0
            ? <View style={{backgroundColor: 'white'}} >
            {Object.keys(posts).map((key)=>(
                <TouchableOpacity key={key} style={style.notices} onPress={()=>{
                    navigation.push('Conversation', {
                        teacher_id: posts[key].teacher_id, 
                        conversation_key: posts[key].conversation_key
                    })
                }}>
                    {posts[key].picUrl
                    ? <Image
                        style={{width: 48, height: 48, borderRadius: 24}}
                        source={{uri: posts[key].picUrl}}
                    />
                    : <Profile width={42} height={42} />}
                    <View style={{marginLeft: 14}}>
                        <Text style={style.name}>{posts[key].name}</Text>
                        <Text style={style.message}>{posts[key].post}</Text>
                    </View>
                </TouchableOpacity>))}
            </View>
            : <View style={{backgroundColor: 'white', padding: 8}}>
                <Text style={{alignSelf: 'center', color: 'lightgray'}}>No Notices Yet</Text>
            </View>}
        </View>
    )
}

const style = StyleSheet.create({
    notices: {
        borderRadius: 8,
        elevation: 2,
        backgroundColor: 'white',
        padding: 14,
        marginHorizontal: 8,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#E9E9E9',
        marginVertical: 4
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
    },
    name: {
        fontWeight: 'bold',
        fontSize: 12
    },
    message: {
        letterSpacing: 0.6,
        marginTop: 2,
        width: '60%',
        fontSize: 14
    }
});
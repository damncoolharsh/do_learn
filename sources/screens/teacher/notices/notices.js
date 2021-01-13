import React, { useContext, useEffect, useState } from 'react'
import {Text, StyleSheet, View, ScrollView, Image, Button} from 'react-native'
import {InputBox} from 'sources/component/atoms/index'
import {UniqueId, Posts, PostContainer} from 'sources/component/organisms/index'
import TakeClass from 'sources/component/organisms/teachers/takeClass'
import {AuthContext} from 'sources/providers/authProvider'
import database from '@react-native-firebase/database'

import { Mixins } from 'styles'

const Notices = ({ navigation })=>{
    const {userData} = useContext(AuthContext)
    const [posts, setPosts] = useState(null)

    useEffect(()=>{
        database().ref(`/posts/${userData.data.id}`).orderByChild('timestamp').on('value', value=>{
            setPosts(value.val())
        })
    }, [])
    return (
        <View style={style.screen}>
            <ScrollView>
                <PostContainer navigation={navigation}/>
                <View style={{paddingBottom: 15, backgroundColor: 'white', paddingHorizontal: 10}}>
                    <Text style={style.title}>Your Posts</Text>
                    <Posts posts={posts} navigation={navigation}/>
                </View>
            </ScrollView>
        </View>
    )
};

const style = StyleSheet.create({
    screen: {
        backgroundColor:'#F2F3FE', 
        flex: 1, 
        // paddingBottom: 2
    },
    title: {
        ...(Mixins.padding(10, 0, 8, 10)),
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Open Sans'
    },
})

export default Notices
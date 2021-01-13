import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {Center} from 'sources/component/atoms/index'
import { Mixins, Colors} from 'styles'

export default function Posts({posts, navigation}) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
        posts != null
        ? Object.keys(posts).map(item=>{
            const time = new Date(posts[item].timestamp)
                    var minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes().toString()
                    const formattedTime =  `${time.getHours()}:${minutes} ${months[time.getMonth()]} ${time.getDate()} ${time.getFullYear()}`
            return <TouchableOpacity 
                style={style.notices}
                key={item} onPress={()=>navigation.push('Conversation', {
                teacher_id: posts[item].teacher_id,
                conversation_key: item
            })}>
                <View>
                    <Text style={style.time}>{formattedTime}</Text>
                    <Text style={style.message}>{posts[item].message}</Text>
                </View>
            </TouchableOpacity>
        })
        : <Center>
            <Text style={style.message}>No Posts available yet</Text>
        </Center>
    )
}

const style = StyleSheet.create({
    notices: {
        elevation: 4,
        backgroundColor: 'white',
        borderRadius: 4,
        marginVertical: 4,
        letterSpacing: 0.8,
        marginTop: 2,
        width: '100%',
    },

    time: {
        color: Colors.GRAY,
        fontSize: 12,
        paddingTop: 10,
        paddingLeft: 12,
    },
    message: {
        color: 'black',
        ...Mixins.padding(8, 16, 14),
        fontSize: 14
    }
})

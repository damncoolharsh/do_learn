import React from 'react'
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Profile from 'sources/assets/profile.svg'
import {Mixins} from 'styles'
import { CButton } from 'sources/component/atoms'

export default function PostContainer({navigation}) {
    return (
        <View style={style.post}>
            {/* <Profile width={42} height={42}/> */}
            <TouchableOpacity onPress={()=>{navigation.push('Add Post')}}>
                <View style={style.postMessage}>
                    <Text style={style.placeholder}>Post Something for Students</Text>
                    <CButton customStyle={{height: Mixins.WINDOW_HEIGHT * 0.04}}>Post</CButton>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    post: {
        // padding: 8,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // borderRadius: 5,
        elevation: 1,
        padding: 10,
        // borderWidth: 0.1,
        borderColor: 'white',
        backgroundColor: "white",
        justifyContent: 'center'
    },
    postMessage: {
        // elevation: 1,
        ...Mixins.padding(8, 15),
        backgroundColor: '#EEECEC',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        width: Mixins.WINDOW_WIDTH * .90,
    },
    placeholder: {
        color: '#8D8D8D',
        fontSize: 12,
    }
})

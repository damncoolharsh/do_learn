import React, { useContext, useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { CButton, Padding } from 'sources/component/atoms'
import { AuthContext } from 'sources/providers/authProvider'
import { DataContext } from 'sources/providers/dataProvider'
import { Mixins, Colors } from 'styles'
import FileIcon from 'assets/filePdf.svg'

export default function AddPost({navigation}) {
    const {userData, user} = useContext(AuthContext)
    const {loading, submitPost} = useContext(DataContext)
    const [post, setPost] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                fontSize: 14
            }
        })
    }, [])
    const addPost = ()=>{
        if(post != ""){
            submitPost(`/posts/${userData.data.id}`, post)
            navigation.goBack()
        }
    }

    return (
        <View style={style.container}>
            <Text style={style.title}>{userData.data.fullName}</Text>
            <TextInput 
                style={style.input}
                onChangeText={(text)=>setPost(text)}
                placeholder="Write some notice or information to convey to students"
                multiline={true}
                />
            {files.length > 0
            ? <View style={{height: 90, margin: 5}}>
                <ScrollView horizontal={true}>
                    {files.map((item)=>
                        <View key={item.url} style={style.files}>
                            <FileIcon width={48} height={48} />
                            <Text>{item.name}</Text>
                        </View>)}
                </ScrollView>
            </View>
            : null}
            {loading
            ? <View>
                <ActivityIndicator color='blue' />
            </View>
            : <View style={style.inverse_row}>
                {/* <CButton customStyle={{backgroundColor: Colors.LIGHT_BLUE}}>Add File</CButton> */}
                <Padding value={8}/>
                <CButton onPress={addPost}>Send Post</CButton>
            </View>}
            
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        height: Mixins.WINDOW_HEIGHT,
        padding: 20,
        backgroundColor: 'white',
        
    },
    title: {
        fontSize: 16,
        paddingBottom: 10,
        paddingLeft: 12,
        fontWeight: 'bold'
    },
    input: {
        // borderTopWidth: 0.3,
        // borderBottomWidth: 0.3,
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#F4EEEE',
        height: Mixins.WINDOW_HEIGHT * 0.4,
        textAlignVertical: 'top'
    },
    scroller: {
        height: 50
    },
    files: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    }
})

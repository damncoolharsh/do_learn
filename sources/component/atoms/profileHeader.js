import React, { useContext, useState } from 'react'
import { View, Text, Image } from 'react-native'
import Profile from 'sources/assets/profile.svg'
import {Colors} from 'styles'
import DocumentPicker from 'react-native-document-picker'
import ImageResizer from 'react-native-image-resizer'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
import { AuthContext } from 'sources/providers/authProvider'
import storage from '@react-native-firebase/storage'
import database from '@react-native-firebase/database'

export default function ProfileHeader({children, image, title, locked}) {
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const onSubmit = async ()=>{
        try{
            const result = await DocumentPicker.pick({
                type: DocumentPicker.types.images
            })
            ImageResizer.createResizedImage(
                result.uri,
                280,
                280,
                "JPEG",
                100,
                0,
                null
            ).then(res=>{
                const profilePic = res.uri
                setLoading(true)
                storage().ref(`${userData.data.id}/profile.jpg`).putFile(profilePic).then(()=>{
                    storage().ref(`${userData.data.id}/profile.jpg`).getDownloadURL()
                    .then(url=>{
                        database().ref(`/users/${userData.data.id}`).set({...userData.data, picUrl: url})
                        .then(()=>{
                            setLoading(false)
                        })
                    })
                })
            })
        } catch(e){
            console.log(e)
            return null
        }
    }
        
    const getImage = ()=>{
        return (image
            ?<Image 
                style={{width: 64, height: 64, borderRadius: 64 / 2}}
                    source={{uri: image}}
            />
            : <Profile width={64} height={64} />)
    }

    return (
        <View style={{ backgroundColor: Colors.HEAD, justifyContent: 'center', alignItems: 'center', padding: 20}}>
            {loading
            ? <ActivityIndicator color='purple' size='small' />
            : locked
                ? <View>
                    {getImage()}
                </View>
                : <TouchableOpacity onPress={onSubmit}>
                    {getImage()}
                </TouchableOpacity>}
            <Text style={{color: 'white', fontWeight: 'bold', paddingVertical: 10}}>{title}</Text>    
            {children}
        </View>
    )
}

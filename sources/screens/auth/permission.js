import React from 'react'
import {PermissionsAndroid} from 'react-native'

export default async function requestCameraAndAudioPermission(){
    try{
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ])
        if(granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED){
                return true
        } else{
            return false
        }
    } catch(e){
        console.log(e)
    }
}
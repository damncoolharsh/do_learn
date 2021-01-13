import React, {createContext, useContext, useState, useEffect} from 'react'
import {PermissionsAndroid} from 'react-native'
import { AuthContext } from './authProvider'
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage'
import messaging from '@react-native-firebase/messaging'
import database from '@react-native-firebase/database'
import RNFetchBlob from 'rn-fetch-blob'

export const DataContext = createContext()

export const DataProvider = ({children})=>{
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState({})
    const [error, setError] = useState("")

    // const sendNotifications = (topic)=>{
    //     console.log("helo")
    //     messaging().sendMessage({
    //         notification: {
    //             title: '$FooCorp up 1.43% on the day',
    //             body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    //         },
    //         from: topic
    //     }).then(()=>{
    //         console.log('done')
    //     })
    // }
    const submitPost = async (url, data)=>{
        try{
            setLoading(true)
            const messageKey = database().ref(url).push({
                message: data,
                teacher_id: userData.data.id,
                timestamp: database.ServerValue.TIMESTAMP
            }).key

            const studentJson = {
                teacher_id: userData.data.id,
                post: data,
                conversation_key: messageKey
            }
            database().ref(`/students_list/${userData.data.id}/allStudents`).once('value', value=>{
                if(value.val()){
                    Object.keys(value.val()).map(key=>{
                        database().ref(`/notices/${key}`).push(studentJson)
                    })
                }
            })
            if(userData.data.students){
                if(userData.data.students.allStudents){
                    
                }
            }
            setLoading(false)
        } catch(e){
            setError(e.code)
        }
    }

    const formatTime = (timestamp)=>{
        const time = new Date(timestamp)
        var minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes().toString()
        const formattedTime =  `${time.getDay}-${time.getMonth}-${time.getFullYear()} ${time.getHours()}:${minutes}`
        return formatTime
    }

    const addFile = async (databaseUrl, storageUrl)=>{
        try{
            const result = await DocumentPicker.pickMultiple({
                type: [
                    DocumentPicker.types.docx,
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.ppt,
                    DocumentPicker.types.pptx,
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.plainText,
                    DocumentPicker.types.images
                ]
            })
            const uri = await RNFetchBlob.fs.stat(result[0].uri)
            const promises = []
            result.map(async (item)=>{
                const alreadyExist = await database().ref(databaseUrl).orderByChild('fileName').equalTo(item.name).once('value')
                if(!(progress[item.name] || alreadyExist.exists())){
                    promises.push(storage().ref(`${storageUrl}/${item.name}`)
                    .putFile(uri.path).on('state_changed', taskSnapshot => 
                    {
                        const percent = Math.round(100 * (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes))
                        switch(taskSnapshot.state){
                            case 'running':
                                setProgress(prevState=>{
                                    const temp = {...prevState}
                                    temp[item.name] = percent
                                    return temp 
                                });
                                break
                            case 'success':
                                setProgress(prevState=>{
                                    const temp = {...prevState}
                                    if(prevState[item.name] != undefined){
                                        database().ref(databaseUrl).push({
                                            fileName: item.name,
                                            timestamp: database.ServerValue.TIMESTAMP
                                        })
                                    }
                                    delete temp[item.name]
                                    return temp;
                                })
                            default:
                                break
                        }
                    }))
                }
            })
            Promise.all(promises)
        } catch(e){
            if(DocumentPicker.isCancel(e)){
                console.log("cencel")
            }
        }
    }

    return (
        <DataContext.Provider value={{
            loading,
            submitPost,
            addFile,
            progress,
            formatTime,
        }}>
            {children}
        </DataContext.Provider>
    )
}
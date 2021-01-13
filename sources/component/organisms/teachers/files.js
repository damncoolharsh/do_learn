import React, { useContext, useState, useRef } from 'react'
import { Alert, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import PdfIcon from 'assets/pdfIcon.svg'
import { Mixins } from 'styles';
import { DataContext } from 'sources/providers/dataProvider';
import RNFetchBlob from 'rn-fetch-blob'
import {Dialog} from 'react-native-paper'
import * as mime from 'react-native-mime-types'
import storage from '@react-native-firebase/storage'
import database from '@react-native-firebase/database'
import ActionSheet from 'react-native-actionsheet'

const Files = ({files, storageUrl, databaseUrl})=>{
    const {progress} = useContext(DataContext)
    const [file, setFile] = useState(null)
    const dirs = RNFetchBlob.fs.dirs;
    const android = RNFetchBlob.android;
    const [dialog, setDialog] = useState({
        state: false,
        file: ""
    })

    let actionsheet = useRef()
    const options = [
        "Download File",
        "Delete File",
        "Cencel"
    ]
    
    const openFile = (fileName)=>{
        RNFetchBlob.fs.exists(`${dirs.DocumentDir}/${fileName}`)
        .then(exists=>{
            if(exists){
                android.actionViewIntent(`${dirs.DocumentDir}/${fileName}`, mime.lookup(fileName))
            } else{
                storage().ref(`${storageUrl}/${fileName}`)
                .getDownloadURL().then(url=>{
                    RNFetchBlob.config({
                        addAndroidDownloads: {
                            title: fileName,
                            useDownloadManager: true,
                            mediaScannable: true,
                            notification: true,
                            description: 'File downloaded by download manager.',
                            path: `${dirs.DownloadDir}/${fileName}`,
                        },
                        })
                        .fetch('GET', url)
                        .then((res) => {
                            alert("File Downloaded")
                        })
                        .catch((err) => console.log(err));
                }).catch(e=>{
                    console.log(e)
                })
            }
        })
    }

    const deleteFile = (file)=>{
        setDialog({state: false, file: ""})
        Alert.alert(
            "Delete File",
            "Do you want to delete your File",
            [
                {
                    text: 'No'
                },
                {
                    text: "Yes",
                    onPress: ()=>{
                        storage().ref(`${storageUrl}/${file}`).delete().then(()=>{
                            console.log("deleted")
                        })
                        database().ref(`${databaseUrl}`).orderByChild('fileName')
                        .equalTo(`${file}`).once('value', value=>{
                            database().ref(`${databaseUrl}/${Object.keys(value.val())[0]}`)
                            .set(null).then(()=>{
                                alert("File Deleted")
                            })
                        })
                    }
                },
            ]
        )
    }

    return (
        <ScrollView style={{paddingTop: 14}}>
            {Object.keys(progress).length > 0
            ? Object.keys(progress).map((item, index)=>
            <View key={index} style={{flexDirection: 'row', ...Mixins.padding(20)}}>
                <View style={{...style.progress, width: `${progress[item]}%`}}>
                </View>
                <View style={{flexDirection: 'row', opacity: 0.25}}>
                    <PdfIcon width={42} width={42} />
                    <View style={{paddingLeft: 14}}>
                        <Text style={{}}>{item}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>10:55 11/11/2020</Text>
                    </View>
                </View>
            </View>)
            : null}
            
            {files != null && Object.keys(files).length > 0
            ? Object.keys(files).map((key)=>
            <TouchableOpacity key={key} onPress={()=>{
                setFile(files[key].fileName)
                actionsheet.current.show()
            }}>
                <View  style={{flexDirection: 'row', ...Mixins.padding(10), alignItems: 'center'}}>
                    <PdfIcon width={42} width={42} />
                    <View style={{paddingLeft: 14}}>
                        <Text style={{}}>{files[key].fileName}</Text>
                        <Text style={{color: 'gray', fontSize: 12}}>{files[key].timestamp}</Text>
                    </View>
                </View>
            </TouchableOpacity>)
            : null}
            <ActionSheet 
                ref={actionsheet}
                options={options}
                title="File Options"
                cancelButtonIndex={2}
                onPress={(index)=>{
                    if(index == 0){
                        openFile(file)
                    } else if(index == 1){
                        deleteFile(file)
                    }
                }}
            />
        </ScrollView>
    )
}

const style = {
    progress: {
        zIndex: 1, 
        position: 'absolute', 
        height: 10, 
        borderRadius: 4, 
        backgroundColor: 'lightblue', 
        alignSelf: 'center', 
    }
}

export default Files
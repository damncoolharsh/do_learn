import React, { useContext, useEffect, useState } from 'react'
import {View, Text, Share, Button} from 'react-native'
import { Colors } from 'styles'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { CButton, Row, SelectButton, Padding, NButton } from 'sources/component/atoms'
import { AuthContext } from 'sources/providers/authProvider'
import database from '@react-native-firebase/database'
import { ActivityIndicator } from 'react-native-paper'

const Dashboard = ({navigation})=>{
    const {userData, setUserData} = useContext(AuthContext)
    const ref = database().ref(`/users/${userData.data.id}`)
    const [loading, setLoading] = useState(false)
    
    const onShare = async ()=>{
        const link = await dynamicLinks().buildShortLink({
            link: `https://do.learn/${userData.data.id}`,
            domainUriPrefix: 'https://dolearn.page.link',
            android: {
                packageName: "com.dolearn"
            }
        })
        try{
            await Share.share({
                message: `Teacher ${userData.data.fullName} with id ${userData.data.id} has invited you to study in doLearn app. Click on this link to Get Stated ${link}`
            })
        }catch(e){
            console.log(e)
        }
    }

    const takeClass = ()=>{
        const teacherId = userData.data.id
        navigation.push('LiveClass', {roomId: teacherId, userId: teacherId})
    }

    const discardClass = ()=>{
        setLoading(true)
        ref.child('live_class').set(false)
        .then(()=>{
            setTimeout(()=>{
                setLoading(false) 
            }, 300)
            
        })
    }

    return (
        <View style={{backgroundColor:'#F2F3FE', flex: 1}}>
            {/* <View style={{backgroundColor: 'white', marginBottom: 5}}>
                <Text style={{alignSelf: 'center', paddingVertical: 24, letterSpacing: 2, fontSize: 18, color: 'purple'}}>
                    WELCOME TO DOLEARN
                </Text>
            </View> */}
            <View style={{marginBottom: 10}}>
                <View style={style.takeClass}>
                    <Text style={{letterSpacing: 1, fontSize: 16, textAlign: 'center', paddingBottom: 8}}>Go live and take class with available students on your list.</Text>
                    {/* <CButton customStyle={{width: '50%', alignSelf: 'center'}}>Take Class</CButton> */}
                    <View style={{paddingHorizontal: 24, paddingVertical: 20, backgroundColor: 'white', justifyContent: 'center'}}>
                        {loading
                        ? <ActivityIndicator color='red' />
                        : userData.data.live_class
                            ? <Row customStyle={{justifyContent: 'space-around', width: '100%'}}>
                                <CButton onPress={takeClass}>Rejoin Class</CButton>
                                <NButton onPress={discardClass} textColor="brown">Discard Class</NButton>
                            </Row>
                            : <SelectButton onPress={takeClass}>Take Class</SelectButton>}
                        {/* <Text style={{paddingVertical: 14}}>Selection</Text> */}
                        <Padding value={8} />
                        <SelectButton onPress={()=>{navigation.push('StudyMaterial')}}>Study Material</SelectButton>
                        <Padding value={8} />
                        <SelectButton onPress={()=>{navigation.push('SelectUser', {keyword: 'Assignments'})}}>Assignments</SelectButton>
                    </View>
                    
                </View>
            </View>
            <View style={{marginBottom: 10}}>
                <View style={{...style.takeClass, alignItems: 'center'}}>
                <Text style={{letterSpacing: 1, fontSize: 14, width: '80%', textAlign: 'center', paddingBottom: 10, paddingRight: 5}}>Your Unique ID id {userData.data.id}. Share this id 
                with your students.</Text>
                    <CButton onPress={onShare}>Share</CButton>
                </View>
            </View>
        </View>
    )
}

const style = {
    takeClass: {
        padding: 24,
        // elevation: 2,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
}

export default Dashboard
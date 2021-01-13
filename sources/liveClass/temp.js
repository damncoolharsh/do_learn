import React, {useState, useEffect, useContext} from 'react'
import {View, TouchableOpacity, StyleSheet, Text, Dimensions, Platform} from 'react-native'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
  } from 'react-native-webrtc';
import {
    VideoOn,
    VideoOff,
    MicOn,
    MicOff,
    EndCall,
    BackIcon
} from 'sources/assets/index.js'
import {FlatGrid} from 'react-native-super-grid'
import database from '@react-native-firebase/database'
import { AuthContext } from 'sources/providers/authProvider';
import { DataContext } from 'sources/providers/dataProvider';

const LiveClass = ({navigation, route})=>{
    const [localStream, setLocalStream] = useState({toURL: ()=> null})
    const [remoteStream, setRemoteStream] = useState(null)
    const {userData, setUserData} = useContext(AuthContext)
    const roomId = route.params.roomId
    const roomRef = database().ref(`/users/${roomId}/live_class`)
    const dataRef = database().ref(`/rooms/${roomId}/data`)
    const membersRef = database().ref(`/rooms/${roomId}/members`)
    const [session, setSession] = useState({
        mic: true,
        video: true
    })
    const [rtcConn, setRtcConn] = useState(
        new RTCPeerConnection({
            iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',  
            }, {
                urls: 'stun:stun1.l.google.com:19302',    
            }, {
                urls: 'stun:stun2.l.google.com:19302',    
            }
            ],
        })
    )
     useEffect(() => {
        dataRef.on('value', rawData=>{
            if(
                rawData.val() 
                && userData.data.id == rawData.val().target 
                && userData.data.id != rawData.val().userId
            ){
                let data
                data = rawData.val()
                console.log(data.type)
                var userId = rawData.val().userId
                switch (data.type){
                    case 'offer':
                        handleOffer(data.offer, userId)
                        break
                    case 'answer':
                        handleAnswer(data.answer)
                        break
                    case 'candidate':
                        handleCandidates(data.candidate)
                        break
                    default:
                    break
                }
            }
        })

        membersRef.on('child_removed', value=>{
            if(value.val().userId == roomId){
                setLocalStream({toURL: ()=> null})
            } else{
                setRemoteStream((prevStream)=>{
                    const temp = {...prevStream}
                    Object.keys(temp).forEach(key=>{
                        if(temp[key].stream.id == value.val().streamId){
                            delete temp[key]
                        }
                    })
                    return temp
                })
            }
        })

        mediaDevices.enumerateDevices().then(sourceInfo=>{
            let videoId;
            let isFront = true;
            rtcConn.onaddstream = (event)=>{
                membersRef.once('value', streamData=>{
                    let obj
                    if(streamData.val()){
                        Object.keys(streamData.val()).forEach(userId=>{
                            if(streamData.val()[userId].streamId == event.stream.id){
                                obj = {
                                    name: streamData.val()[userId].name,
                                    stream: event.stream,
                                    streamUrl: event.stream.toURL(),
                                    userId: userId
                                }
                            }
                        })
                        if(obj.userId == roomId){
                            setLocalStream(event.stream)
                        } else{
                            setRemoteStream((prevStream)=>({...prevStream, [event.stream.id]: obj}))
                        }
                    }
                })
            }
        
            rtcConn.onicecandidate = event =>{
                if(event.candidate){
                    sendData({
                        type: 'candidate',
                        candidate: event.candidate,
                        target: roomId,
                        userId: userData.data.id
                    })
                }
            }
 
            for(var i=0; i<sourceInfo.length; i++){
                if(
                    sourceInfo.kind == 'videoinput' &&
                    sourceInfo.facing ==  (isFront ? "front" : "environment")
                ){
                    videoId = sourceInfo.deviceID
                }
            }
            
            mediaDevices.getUserMedia({
                audio: true, 
                video: {
                    minHeight: 300,
                    minWidth: 500,
                    minFrameRate: 24
                },
                facing: (isFront ? "front" : "environment"),
                optional: videoId ? [{sourceId: videoId}] : []
            }).then((stream)=>{
                userStream = stream
                membersRef.child(userData.data.id.toString()).set({
                    name: userData.data.fullName,
                    streamId: stream.id,
                    userId: userData.data.id
                }).then(()=>{
                    rtcConn.addStream(stream)
                    roomRef.once('value', value=>{
                        if(!value.val()){
                            roomRef.set(true)
                        }else{
                            rtcConn.createOffer().then(offer=>{
                                rtcConn.setLocalDescription(offer).then(()=>{
                                    sendData({
                                        type: "offer",
                                        offer: offer,
                                        target: roomId,
                                        userId: userData.data.id
                                    })
                                })
                            })
                        }

                        if(userData.data.id == roomId){
                            setLocalStream(stream)
                        } else{
                            setRemoteStream({
                                [stream.id]: {
                                    name: userData.data.fullName,
                                    stream: stream,
                                    streamUrl: stream.toURL(),
                                    userId: userData.data.id
                                }
                            })
                        }
                        
                    })
                })
            }).catch(err=>{
                console.log(err)
            });
        }) 
        
        return function cleanup () {
            membersRef.child(userData.data.id.toString()).set(null)
            if(!remoteStream && userData.data.id == roomId){
                setUserData({...userData, loading: true})
                roomRef.set(false).then(()=>{
                    setUserData({...userData, loading: false})
                })
            }
            rtcConn.close()
            dataRef.set(null).then(()=>{
                dataRef.off()
            })
        }
    }, [setRemoteStream])

    const sendData = (msg)=>{
        dataRef.set({...msg})
    }


    const handleOffer = async (offer, target)=>{
        try{
            await rtcConn.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await rtcConn.createAnswer()
            await rtcConn.setLocalDescription(answer)
            console.log(target)
            sendData({
                type: 'answer',
                answer: answer,
                target: target,
                userId: userData.data.id
            })
        }
        catch(err){
            console.log(err)
        }
    }

    const endCall = ()=>{
        database().ref(`/rooms/${roomId}`).set(null).then(()=>{
            database().ref(`/users/${userData.data.id}/live_class`).set(null)
            .then(()=>{
                dataRef.off()
                navigation.goBack()
            })
        })
    }
    const handleAnswer = async (answer)=>{
        try{
            await rtcConn.setRemoteDescription(new RTCSessionDescription(answer))
        } catch(e){
            console.log(e)
        } 
        
    }

    const handleCandidates = async (candidate)=>{
        rtcConn.addIceCandidate(new RTCIceCandidate(candidate)).then(()=>{
            sendData(null)
        })
    }

    const onBack = ()=>{
        if(Object.keys(remoteStream).length == 0){
            database().ref(`/users/${userData.data.id}/live_class`).set(null)
            .then(()=>{
                navigation.goBack()
            })
        } else{
            navigation.goBack()
        }
    }

    return(
        <View style={appStyle.parent}>
            <TouchableOpacity 
                onPress={()=>{navigation.goBack()}}
                style={{position: 'absolute', left: 10, top: 0, zIndex: 1}}>
                <BackIcon width={18} />
            </TouchableOpacity>
            <View style={appStyle.presentScreen}>
                <View style={{width: '100%', borderRadius: 12, overflow: 'hidden'}}>
                    <RTCView streamURL={session.video ? localStream.toURL() : null} style={{
                        height: '100%',
                        width: '100%',
                    }} objectFit='cover'/>
                </View>
            </View>
            <View style={{height: '40%'}}>
            {remoteStream
            ? <FlatGrid
                data={Object.keys(remoteStream)}
                itemDimension={sizeWidth * 0.25}
                renderItem={(user)=>{
                // console.log(remoteStream[user.item].name)
                return <View style={{
                        ...appStyle.remoteContainer, 
                        backgroundColor: userData.data.id == remoteStream[user.item].userId
                            ? 'gray' : '#5E5C75'
                    }}>
                        <View style={{width: '100%', height: '80%', borderRadius: 12, overflow: 'hidden'}}>
                            <RTCView 
                                streamURL={remoteStream[user.item].streamUrl} 
                                style={{
                                    height: '100%',
                                    width: '100%'
                                }} 
                                objectFit='cover'/>
                        </View>
                        <Text style={{color: 'white', paddingTop: 2, textAlign: 'center'}}>{remoteStream[user.item].name}</Text>
                    </View>
                }}
                />
            : null}
            </View>
            <View style={appStyle.navBar}>
                <TouchableOpacity onPress={endCall}>
                    <EndCall width={32} height={32} />
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    const video = localStream.getTracks().filter(track=>track.kind == 'video')
                    video[0].enabled = !video[0].enabled
                    setSession({...session, video: video[0].enabled})
                }}>
                    {session.video
                    ? <VideoOn width={32} height={32} />
                    : <VideoOff width={32} height={32} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    const audio = localStream.getTracks().filter(track=>track.kind == 'audio')
                    audio[0].enabled = !audio[0].enabled
                    setSession({...session, mic: audio[0].enabled})
                }}>
                    {session.mic
                    ? <MicOn width={32} height={32} />
                    : <MicOff width={32} height={32} />}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const sizeWidth = Math.round(Dimensions.get('window').width)
const sizeHeight = Math.round(Dimensions.get('window').height)


const appStyle = StyleSheet.create({
    parent: {
        height: '100%'
    },
    presentScreen: {
        height: '50%',
        backgroundColor: '#4E4C67',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 8
    },
    remoteContainer: {
        borderRadius: 8,
        backgroundColor: '#5E5C75',
        padding: 2,
        height: sizeHeight * 0.15
    },
    remoteStream: {
    },
    
    present: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'Open Sans',
        alignSelf: 'center',
    },
    navBar: {
        alignItems: 'center',
        height: '10%',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-evenly'
    }
})

export default LiveClass;
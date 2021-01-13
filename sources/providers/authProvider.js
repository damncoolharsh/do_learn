import React, {createContext, useState, useEffect} from 'react'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'

const AuthContext = createContext()

const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [userData, setUserData] = useState({
        data: {},
        loading: false
    })
    useEffect(()=>{
        auth().onAuthStateChanged((user)=>{
            setUser(user)
            if(user){
                setUserData({data: {}, loading: true})
                database().ref('/users').orderByChild('email').equalTo(user.email).once('value', value=>{
                    const id = Object.keys(value.val())[0]
                    setTimeout(()=>{
                        database().ref(`/users/${id}`).on('value', (value)=>{
                            storage().ref(`${id}/profile.jpg`)
                            .getDownloadURL()
                            .then((url)=>{
                                setUserData({data: {...value.val(), picUrl: url}, loading: false})
                            }).catch(e=>{
                                setUserData({data: {...value.val()}, loading: false})
                            })
                        })
                    }, 200)
                })
            }
        })
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                userData,
                setUserData,
                login: async (email, password)=>{
                    try{
                        await auth().signInWithEmailAndPassword(email, password)
                    }catch(e){
                        console.log(e)
                    }
                },
                signUp: async (userData)=>{
                    try{
                        await auth().createUserWithEmailAndPassword(userData.email, userData.password)
                        delete userData.password
                        delete userData.retypePassword
                        database().ref(`/users/${userData.id}`).set(userData).then(()=>{console.log("done")})
                    }catch(e){
                        console.log(e)
                    }
                },
                signOut: async ()=>{
                    try{
                        setUserData({data: {}, loading: true})
                        await auth().signOut()
                        setUserData({data: {}, loading: false})
                    }catch(e){
                        console.log(e)
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider
}
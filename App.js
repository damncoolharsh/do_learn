import React, {useContext, useEffect, useState} from 'react'
import Root from "./sources/root";
import database from '@react-native-firebase/database'
import {Provider as PaperProvider} from 'react-native-paper'
import { AuthContext } from 'sources/providers/authProvider';
import dynamicLinks from '@react-native-firebase/dynamic-links'

const App = () => {
  const {user, userData} = useContext(AuthContext)
  useEffect(()=>{
    const handleLink = dynamicLinks()
      .onLink(link=>{
        if(user && userData.data.occupation == "Student"){
          const teacherId = link.url.split('/').pop()
          database().ref(`teachers_list/${userData.data.id}`).orderByChild(`${teacherId}`).once('value', value=>{
            if(value.val() == null){
              database().ref(`/students_list/${teacherId}/requests`).child(userData.data.id.toString())
              .set(userData.data.fullName).then(()=>{
                alert("Sent Request to teacher successfully")
              })
            } else{
              console.log("Already Exist")
            }
          })
        }
    })
    // messaging().sendMessage({
    //   data: {
    //     userID: userData.data.id
    //   }
    // })
    return ()=>handleLink()
  }, [])

  return(
    <PaperProvider>
      <Root />
    </PaperProvider>
  )
};

export default App
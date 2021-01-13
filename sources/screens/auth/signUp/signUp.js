import React, { useContext, useState } from 'react'
import { ActivityIndicator, StatusBar, View, ScrollView } from 'react-native'
import { Padding, NButton, CButton, Row, Container } from 'sources/component/atoms/index'
import { FormField, OptionsField, OptionsContext } from 'sources/component/organisms/index'
import {AuthContext} from 'sources/providers/authProvider'
import database from '@react-native-firebase/database'

const SignUp = ({navigation}) => {
  const genderData = ['Male', 'Female', 'Other'];
  const [userInfo, setUserInfo] = useState({})
  const [error, setError] = useState({})
  const {signUp} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    const valid = validateData()
    if((userInfo.password != undefined && userInfo.email != undefined) && valid){
      setLoading(true)
      try{
        const finalUserData = await generateId()
        signUp(finalUserData)
        navigation.goBack()
      }
      catch (e){
        console.log(e)
      }

    }
  }

  const generateId = async ()=>{
    var id
    var room
    while(true){
        id = Math.floor(Math.random() * Math.pow(10, 10))
        var flag
        await database().ref('/users').orderByChild('id').equalTo(id).once('value', value=>{
            flag = value.exists()
        })
        if(!flag){
            break
        }
    }
    while(true){
      room = Math.floor(Math.random() * Math.pow(10, 10))
      var flag
      await database().ref('/users').orderByChild('roomId').equalTo(room).once('value', value=>{
          flag = value.exists()
      })
      if(!flag){
          break
      }
    }
    const finalData = {...userInfo, id: id, roomId: room}
    return finalData
  }

  const validateData = () => {
    var errors = {}

    //Email
    if (userInfo.email === undefined || userInfo.email.length <= 0) {
      errors = { email: "Please enter a valid Email address", ...errors }
    }
    else {
      var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (userInfo.email.match(regex)) {
        delete errors.email
      }
      else {
        errors = { email: "Please enter a valid Email Address", ...errors }
      }
    }

    //Password
    if (userInfo.password === undefined || userInfo.password.length <= 0) {
      errors = { password: "Please enter valid Password\n\nUse the following: \n\t- Atleast a Capital Letter\n\t- A Symbol\n\t- Atleast One Number", ...errors }
    }
    else {
      var regex = /^[A-Za-z\d@$!%*?&]{8,}$/;
      if (userInfo.password.match(regex)) {
        // errors = { password: undefined, ...errors }
        delete errors.password
      }
      else {
        errors = { password: "Please enter valid Password\n\t- Enter atleast 8 letters", ...errors }
      }
    }

    //Retype Password
    if(userInfo.password !== userInfo.retypePassword){
      errors = {retype: "Password do not match", ...errors}
    }
    else{
      // errors = { retype: undefined, ...errors }
      delete errors.retype
    }

    //Gender
    if(userInfo.gender == undefined ){
      errors = {gender: "Please Select Gender", ...errors}
    }
    else{
      // errors = { gender: undefined, ...errors }
      delete errors.gender
    }

    //Occupation
    if(userInfo.occupation == undefined){
      errors = {occupation: "Please Select Occupation", ...errors}
    }
    else{
      // errors = { occupation: undefined, ...errors }
      delete errors.occupation
    }
    setError(errors)

    if(Object.keys(errors).length == 0){
      return true
    }else{
      return false
    }
  }

  return (
    <ScrollView><StatusBar backgroundColor='#496897'/>
      <Container>
        <FormField 
          title="Email" 
          onError={error.email} 
          onEnterText={text => setUserInfo({ ...userInfo, email: text })} />
        <FormField 
          title="Password" 
          onError={error.password} 
          secure={true}
          onEnterText={text => setUserInfo({ ...userInfo, password: text })} />
        <FormField 
          title="Retype Password" 
          onError={error.retype} 
          secure={true}
          onEnterText={text => setUserInfo({ ...userInfo, retypePassword: text })} />
        <OptionsField 
          data={genderData} 
          onError={error.gender} 
          title="Gender" 
          current={userInfo.gender} 
          onClick={(gender) => { setUserInfo({ ...userInfo, gender }) }} />
        <OptionsField 
          data={["Student", "Teacher"]} 
          onError={error.occupation} 
          title="You Are" 
          current={userInfo.occupation} 
          onClick={(occupation) => { setUserInfo({ ...userInfo, occupation }) }} />
        {loading
          ? <Center><ActivityIndicator color='blue'/></Center>
          : <View style={{ alignItems: 'center', padding: 20, width: '100%' }}>
            <CButton onPress={onSubmit}>Create New Account</CButton>
          </View>
        }
      </Container>
    </ScrollView>
  )
};

export default SignUp


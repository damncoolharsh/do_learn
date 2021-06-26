import React, { useContext, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { CButton, Padding } from 'sources/component/atoms'
import FormField from 'sources/component/organisms/auth/formField'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import { AuthContext } from 'sources/providers/authProvider'
import ImageResizer from 'react-native-image-resizer'
import DocumentPicker from 'react-native-document-picker'
import { ActivityIndicator, Dialog } from 'react-native-paper'
import ImageReducer from 'react-native-image-resizer'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function SignUp2({ navigation, route }) {
  const { userData } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [profilePic, setProfilePic] = useState(null)

  const onSubmit = () => {
    const valid = validateData()
    if (valid) {
      setLoading(true)
      if (profilePic) {
        storage().ref(`${userData.data.id}/profile.jpg`).putFile(profilePic).then((a) => {
          storage().ref(`${userData.data.id}/profile.jpg`).getDownloadURL()
            .then(url => {
              database().ref(`/users/${userData.data.id}`).set({ ...userData.data, fullName: userInfo.fullName, mobile: userInfo.mobile, picUrl: url })
                .then(() => {
                  setLoading(false)
                  if (userData.data.occupation == "Student") {
                    navigation.navigate("AddTeacher")
                  } else {
                    navigation.navigate("AddSubject")
                  }

                })
            })
        })
      } else {
        database().ref(`/users/${userData.data.id}`).set({ ...userData.data, fullName: userInfo.fullName, mobile: userInfo.mobile })
          .then(() => {
            setLoading(false)
            if (userData.data.occupation == "Student") {
              navigation.navigate("AddTeacher")
            } else {
              navigation.navigate("AddSubject")
            }
          })
      }
    }

  }

  const validateData = () => {
    var errors = {}
    //Name
    if (userInfo.fullName === undefined || userInfo.fullName.length <= 0) {
      errors = { fullName: "Please enter a valid Name" }
    }
    else {
      // errors = { fullName: undefined, ...errors }
      delete errors.fullName
    }

    //Mobile
    if (userInfo.mobile === undefined || userInfo.mobile.length <= 0) {
      errors = { mobile: "Please enter Mobile Number", ...errors }
    }
    else {
      var regex = /^([0-9]{10})$/;
      if (userInfo.mobile.match(regex)) {
        // errors = { mobile: undefined, ...errors }
        delete errors.mobile
      }
      else {
        errors = { mobile: "Please enter a valid Mobile Number", ...errors }
      }
    }

    setError(errors)

    if (Object.keys(errors).length == 0) {
      return true
    } else {
      return false
    }
  }





  const getImage = async () => {
    try {
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
      ).then(res => {
        console.log(res.size)
        setProfilePic(res.uri)
      })

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={{ padding: 30, backgroundColor: 'white', flex: 1 }}>
      <TouchableOpacity style={appStyle.photo} onPress={() => { getImage() }}>
        {profilePic
          ? <Image
            style={{ width: 140, height: 140, borderRadius: 70 }}
            source={{ uri: profilePic }}
          />
          : <View style={{ backgroundColor: '#F7B1AB', borderRadius: 12, padding: 8 }}>
            <Text style={{ color: 'white' }}>Upload Photo</Text>
          </View>}
      </TouchableOpacity>
      <FormField
        title="Display Name"
        onError={error.fullName}
        onEnterText={text => setUserInfo({ ...userInfo, fullName: text })} />
      <FormField
        title="Mobile"
        onError={error.mobile}
        keyType='numeric'
        onEnterText={text => setUserInfo({ ...userInfo, mobile: text })} />
      <Padding value={10} />
      {loading
        ? <ActivityIndicator color='green' size='small' />
        : <CButton onPress={onSubmit}>Save Details</CButton>}
    </View>
  )
}

const appStyle = {
  photo: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 140,
    width: 140,
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#D8AA96',
    borderRadius: 70
  }
}
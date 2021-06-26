import React, { useContext, useState, useEffect } from 'react'
import { View, Alert, Text, StatusBar, Share, StyleSheet } from 'react-native'
import { CButton, NButton, ProfileHeader } from 'sources/component/atoms'
import { AuthContext } from 'sources/providers/authProvider'
import { Colors } from 'styles'
import database from '@react-native-firebase/database'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { DataContext } from 'sources/providers/dataProvider'

export default Classroom = ({ navigation }) => {
  const { signOut, userData } = useContext(AuthContext)
  const [newName, setName] = useState(userData.data.fullName)

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: {
        backgroundColor: Colors.HEAD
      },
      headerTintColor: 'white'
    })
  }, [])

  const onShare = async () => {
    try {
      await Share.share({
        message: `${userData.data.id}`
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onUpdateName = () => {
    if (newName != userData.data.fullName && newName != "") {
      Alert.alert(
        "Update Name",
        "Do you want to change your Name",
        [
          {
            text: "Yes",
            onPress: () => {
              database().ref(`/users/${userData.data.id}`).child('fullName').set(newName).then(() => {
                alert("Name Changed")
              })
            }
          },
          {
            text: 'No'
          }
        ]
      )
    } else {
      alert("Please enter diffrent or valid name")
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.HEAD} />
      <ProfileHeader title={userData.data.fullName} image={userData.data.picUrl}>
        {/* {userData.data.occupation == "Teacher"
                ?<View style={{flexDirection: 'row', padding: 10, width: '100%',backgroundColor: '#194F9F', borderRadius: 8}}>
                    <View style={{alignItems: 'center', justifyContent: 'center', width:'50%'}}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>20</Text>
                        <Text style={{fontSize: 12, color: 'white'}}>Students</Text>
                    </View>
                    <View style={{borderLeftWidth: 0.5, borderColor: 'white'}}/>
                    <View style={{alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{userData.data.subject}</Text>
                        <Text style={{fontSize: 12, color: 'white'}}>Subjects</Text>
                    </View>
                </View>
                : null} */}
      </ProfileHeader>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ padding: 20 }}>
          <Text style={style.title}>Full Name</Text>
          <View style={style.box}>
            <View style={style.container}>
              <TextInput
                style={style.inputBox}
                value={newName}
                onChangeText={text => { setName(text) }}
              />
              <NButton onPress={onUpdateName} textColor="purple">Update</NButton>
            </View>
          </View>

          <Text style={style.title}>Your ID</Text>
          <View style={style.box}>
            <View style={style.container}>
              <Text>{userData.data.id}</Text>
              <NButton onPress={onShare} textColor="purple">Share</NButton>
            </View>
          </View>

          <Text style={style.title}>Email</Text>
          <View style={style.box}>
            <Text style={{}}>{userData.data.email}</Text>
          </View>

          <Text style={style.title}>Contact Number</Text>
          <View style={style.box}>
            <Text style={{}}>{userData.data.mobile}</Text>
          </View>
          <View style={{ marginTop: 10, alignItems: 'center' }}>
            <CButton onPress={signOut}>Logout</CButton>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  box: {
    borderWidth: 0.1,
    elevation: 1,
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 20,
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: 'white'
  },
  title: {
    color: '#8D8B8B',
    marginBottom: 10
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBox: {
    paddingLeft: 15,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: 'gray',
    width: '68%',
    marginRight: 10,
    paddingVertical: 6
  }
});

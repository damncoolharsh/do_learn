import React, { useContext, useEffect, useRef, useState } from 'react'
import { Text, View, TextInput, Alert, Image } from 'react-native'
import { CButton, Loading } from 'sources/component/atoms';
import { DataContext } from 'sources/providers/dataProvider';
import { Mixins, Typography } from 'styles'
import Profile from '../assets/profile.svg'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import { AuthContext } from 'sources/providers/authProvider';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet'

const Conversation = ({ navigation, route }) => {
  const { userData } = useContext(AuthContext)
  const { formatTime } = useContext(DataContext)
  const [reply, setReply] = useState("")
  const [postInfo, setPostInfo] = useState(null)
  const [messages, setMessages] = useState(null)
  const [selected, setSelected] = useState(null)

  let actionsheet = useRef()
  const options = [
    "Delete Message",
    "Cencel"
  ]
  useEffect(() => {
    navigation.setOptions({
      title: "Conversation",
      headerTitleStyle: {
        fontSize: 16
      }
    })
    var data = {}
    database()
      .ref(`/users/${route.params.teacher_id}`)
      .once('value', value => {
        database().ref(`/posts/${route.params.teacher_id}/${route.params.conversation_key}`).once('value', conv => {
          if (conv.val()) {
            const time = new Date(conv.val().timestamp)
            var minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes().toString()
            const formattedTime = `${time.getHours()}:${minutes} ${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`
            storage().ref(`${route.params.teacher_id}/profile.jpg`).getDownloadURL()
              .then((url) => {
                data = {
                  name: value.val().fullName,
                  timestamp: formattedTime,
                  message: conv.val().message,
                  picUrl: url
                }
                setPostInfo(data)
              }).catch(e => {
                data = {
                  name: value.val().fullName,
                  timestamp: formattedTime,
                  message: conv.val().message,
                }
                setPostInfo(data)
              })
          }
        })
      })
    getConversations()

  }, []);

  const getConversations = () => {
    var conversations = {}
    database().ref(`/conversations/${route.params.conversation_key}`).on('value', snapshot => {
      var promises = []
      if (snapshot.val()) {
        conversations = {}
        promises = Object.keys(snapshot.val()).map(key => {
          return database().ref(`/users/${snapshot.val()[key].user_id}`).once('value', user => {
            conversations[key] = {
              name: user.val().fullName,
              message: snapshot.val()[key].message,
              id: snapshot.val()[key].user_id
            }
          })
        })
        Promise.all(promises).then(() => {
          var temp = Object.keys(conversations).map(async key => {
            try {
              const url = await storage().ref(`${snapshot.val()[key].user_id}/profile.jpg`).getDownloadURL();
              conversations[key] = {
                ...conversations[key],
                picUrl: url
              };
            } catch (e) {

            }
          })
          Promise.all(temp).then(() => {
            setMessages(conversations)
          })
        })
      }
    })
  }

  const submitReply = async () => {
    if (reply != "") {
      database().ref(`/conversations/${route.params.conversation_key}`).push({
        message: reply,
        timestamp: database.ServerValue.TIMESTAMP,
        user_id: userData.data.id
      })
      setReply("")
    }
    // getConversations()
  }

  const deleteMessage = () => {
    Alert.alert(
      "Delete File",
      "Do you want to delete your Message",
      [
        {
          text: 'No'
        },
        {
          text: "Yes",
          onPress: () => {
            database().ref(`/conversations/${route.params.conversation_key}/${selected}`)
              .set(null).then(() => {
                // getConversations()
              })
          }
        },
      ]
    )
  }

  return (
    postInfo == null
      ? <Loading />
      : <View style={style.screen}>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <View style={style.profileAndDate}>
            <View style={style.profileAndDate.alignment}>
              {postInfo.picUrl
                ? <Image
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                  source={{ uri: postInfo.picUrl }}
                />
                : <Profile width={40} height={40} />}
              <View style={style.profileAndDate.spacing}>
                <Text style={style.profileAndDate.userName}>{postInfo.name}</Text>
                <Text style={style.profileAndDate.time}>{postInfo.timestamp}</Text>
              </View>
            </View>
            <Text style={style.teacherMessage}>{postInfo.message}</Text>
          </View>

          {messages != null
            ? Object.keys(messages).map(item =>
              messages[item].id == userData.data.id
                ? <TouchableOpacity
                  onPress={() => {
                    setSelected(item)
                    actionsheet.current.show()
                  }}
                  key={item}
                  style={style.studentReply}>
                  {messages[item].picUrl
                    ? <Image
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      source={{ uri: messages[item].picUrl }}
                    />
                    : <Profile width={40} height={40} />}
                  <View style={style.studentReply.alignment}>
                    <Text style={style.studentReply.studentName}>{messages[item].name}</Text>
                    <Text>{messages[item].message}</Text>
                  </View>
                </TouchableOpacity>

                : <View key={item} style={style.studentReply}>
                  {messages[item].picUrl
                    ? <Image
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                      source={{ uri: messages[item].picUrl }}
                    />
                    : <Profile width={40} height={40} />}
                  <View style={style.studentReply.alignment}>
                    <Text style={style.studentReply.studentName}>{messages[item].name}</Text>
                    <Text>{messages[item].message}</Text>
                  </View>
                </View>)
            : null}

        </ScrollView>
        <View style={style.replyBox}>
          <View style={style.replyBox.alignment}>
            <TextInput
              value={reply}
              onChangeText={text => { setReply(text) }}
              style={{ flex: 1 }}
              placeholder="Reply to this conversation" />
            <CButton
              onPress={submitReply}
              customStyle={{
                height: Mixins.WINDOW_HEIGHT * 0.045
              }}
            >
              Reply
                    </CButton>
          </View>
        </View>
        <ActionSheet
          ref={actionsheet}
          options={options}
          title="File Options"
          cancelButtonIndex={1}
          onPress={(index) => {
            if (index == 0) {
              deleteMessage()
            }
          }}
        />
      </View>
  )
};

const style = {
  screen: {
    // paddingLeft: 20,
    // paddingRight: 20,
    backgroundColor: 'white',
    flex: 1
  },
  profileAndDate: {
    paddingTop: 15,
    paddingBottom: 14,
    borderBottomWidth: 0.4,
    marginBottom: 10,
    alignment: {
      paddingBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    spacing: {
      paddingLeft: 10,
      // paddingBottom: 10,
    },
    userName: {
      fontWeight: 'bold',
      fontSize: 12,
    },
    time: {
      fontSize: 12,
      color: 'gray'
    }
  },
  teacherMessage: {
    fontSize: 16,
    ...Typography.FONT_SANS_REGULAR
  },
  studentReply: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    width: "80%",
    alignment: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderRadius: 18,
      marginLeft: 10,
      backgroundColor: '#E7E7E7',
      ...Mixins.padding(10, 20)
    },
    studentName: {
      fontWeight: 'bold',
      fontSize: 12
    }
  },
  replyBox: {
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 3,
    backgroundColor: 'white',
    alignment: {
      flexDirection: 'row',
      elevation: 2,
      backgroundColor: 'white',
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 8,
      alignItems: 'center'
    }
  }
}

export default Conversation
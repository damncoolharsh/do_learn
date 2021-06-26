import React, {useEffect} from 'react'
import {Image, Text, TextInput, Button, StatusBar, View, StyleSheet} from 'react-native'
import {Mixins, Colors} from 'styles'
import LoginSplash from 'sources/assets/loginSplash.svg'
import {HeadTitle} from 'sources/component/atoms/index'

const LoginHeader = (props)=>{
  const {type} = props
  return (
    <View style={{marginTop: -20, marginLeft: -10}}>
      <LoginSplash  width={Mixins.WINDOW_WIDTH + 10} />
      <View style={style.headText}>
          <HeadTitle extraStyle={{color: Colors.WHITE}}>
              Welcome To doLearn
          </HeadTitle>
          <HeadTitle extraStyle={{color: Colors.WHITE}}>
              LogIn/SignUp to your account
          </HeadTitle>
      </View>
    </View>
  )
};

const style = StyleSheet.create({
    headText: {
        position: 'absolute',
        alignSelf: 'center',
        top: 30
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around'
    }
});

export default LoginHeader
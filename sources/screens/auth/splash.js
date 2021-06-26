import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { CButton, CustButton } from 'sources/component/atoms'
import Logo from '../../assets/logo.svg'

export default function Splash({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff"/>
      <View style={styles.logoContainer}>
        <Logo width={130}/>
      </View>
      <View style={styles.footer}>
        <CustButton 
          title={"Get Started"} 
          onPress={() => navigation.navigate("SignUp")} />
        <View>
          <Text style={styles.rawText}>Already have account?</Text>
          <CustButton 
            title={"Login"} variant="#2ADD31"
            onPress={() => navigation.navigate("Login")} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logoContainer: {
    height: '70%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
    flex: 1
  },
  rawText: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    fontSize: 14
  }
})

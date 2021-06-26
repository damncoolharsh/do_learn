import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { color } from 'react-native-reanimated'

export default function CustButton(props) {
  const {onPress, title, variant} = props
  console.log(title)
  return (
    <TouchableOpacity onPress={onPress} style={{...styles.button, backgroundColor: variant || '#5583F9'}}>
      <Text style={{...styles.textStyle}}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10,
    elevation: 4,
    color: 'white',
    fontFamily: 'Noto Sans'
  }
})

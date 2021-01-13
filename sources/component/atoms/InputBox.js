import React from 'react'
import {View, TextInput, StyleSheet} from 'react-native'

export default function InputBox({placeholder, width}){
    return (
        <TextInput style={{...style.inputBox, width: width}} placeholder={placeholder}/>
    )
}

const style = StyleSheet.create({
    inputBox: {
        borderWidth: 1,
        borderColor: '#E9E9E9',
        padding: 8,
        borderRadius: 8,
        margin: 5
    }
})
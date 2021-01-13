import React from 'react'
import {View, Image, StyleSheet, Text} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import { Colors } from 'styles'

const SignInButton = ({children, theme, icon})=>{
    return (
        <TouchableOpacity>
            <View style={{...style.container, backgroundColor: theme.background}}>
                <Image source={icon} style={{width: 32, height: 32}}/>
                <Text style={{...style.title, color: theme.textColor}}>{children}</Text>
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    container: {
        // borderWidth: 0.3,
        borderColor: Colors.GRAY,
        flexDirection: 'row',
        borderRadius: 20,
        justifyContent: 'center',
        margin: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        // fontWeight: 'bold',
        padding: 15
    }
})

export default SignInButton

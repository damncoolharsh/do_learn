import React, { useState } from 'react'
import {View, Alert, Text, StyleSheet, TextInput} from 'react-native'
import {Container, CButton, Padding} from 'sources/component/atoms/index'
import { Typography, Mixins } from 'styles';
import auth from '@react-native-firebase/auth'

const Verify = ({routes})=>{
    const [mail, setMail] = useState("")
    const [error, invokeError] = useState()

    const resetPassword = async ()=>{
        if(verifyEmail()){
            try{
                await auth().sendPasswordResetEmail(mail)
                alert("Link sent successfully")
            } catch(e){
                switch(e.code){
                    case 'auth/user-not-found':
                        invokeError("Email does not exist")
                        break
                    default:
                        console.log(e)
                        break
                }
            }
        }
    }

    const verifyEmail = ()=>{
        if (mail != "") {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (mail.match(regex)) {
                invokeError("")
                return true
            }
            else {
                invokeError("Please enter valid email address")
                return false
            }
        }
        else{
            invokeError("Please enter valid email address")
            return false
        }
    }

    return (
        <Container>
            <View style={style.view}>
                <Text style={style.title}>Enter email address</Text>
                <TextInput  
                    style={style.otpBox}
                    value={mail}
                    onChangeText={(text)=>setMail(text)}
                />
                { error != ""
                    ? <Text style={{color: 'red'}}>{error}</Text>
                    : null}
                <Padding value={10} />
                <CButton onPress={resetPassword}>Reset Password</CButton>
            </View>
        </Container>
    );
}

const style = StyleSheet.create({
    otpBox: {
        width: Mixins.WINDOW_WIDTH / 1.5,
        marginTop: 10,
        padding: 5,
        textAlign:'center',
        borderWidth: 0.3
    },

    title: {
        fontSize: 14,
        ...(Typography.FONT_SANS_REGULAR)
    },

    view: {
        alignItems: 'center',
        paddingTop: 20

    }

})

export default Verify

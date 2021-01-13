import React, { useContext } from 'react'
import {Text, View, TextInput, StyleSheet} from "react-native";
import NormalTitle from "../../atoms/normalTitle";
import {Colors} from "styles";

const FormField = ({title, onEnterText, onError, keyType, placeholder, secure})=>{
    return (
        <View>
            <NormalTitle textColor={Colors.PRIMARY}>{title}</NormalTitle>
            <TextInput 
                style={style.inputBox} 
                secureTextEntry={secure} 
                onChangeText={onEnterText} 
                keyboardType={keyType}
                placeholder={placeholder}
                />
            {onError != undefined 
            ? (<Text style={style.errorText}>{onError}</Text>)
            : null}
        </View>
    )
};

const style = StyleSheet.create({
   inputBox: {
       borderWidth: 1,
       borderColor: Colors.PRIMARY_LIGHT,
       padding: 10,
       marginTop: 8,
       marginBottom: 14
   },
   errorText: {
       color: 'red',
       fontSize: 12,
       paddingLeft: 10,
       paddingBottom: 10
   }
});
export default FormField
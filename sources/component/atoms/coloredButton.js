import React from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import {Typography, Colors, Mixins} from 'sources/styles/index'

const CButton = ({children, onPress, customStyle})=>{
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{...style.button, ...customStyle}}>
                <Text style={style.title}>
                    {children}
                </Text>
            </View>
        </TouchableOpacity>
    )
};

const style = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: Colors.SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        ...(Mixins.padding(10, 20)),
        color: Colors.WHITE
    }
});

export default CButton
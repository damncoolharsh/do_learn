import React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import {TouchableOpacity} from "react-native-gesture-handler";
import {Typography, Colors, Mixins} from 'sources/styles/index'

const NButton = ({children, onPress, textColor, style})=>{
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{...appStyle.button, ...style}}>
                <Text style={{...(appStyle.title), color: textColor}}>
                    {children}
                </Text>
            </View>
        </TouchableOpacity>
    )
};

const appStyle = StyleSheet.create({
    button: {
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: Colors.PRIMARY_LIGHT
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        ...(Mixins.padding(10, 20))
    }
});

export default NButton
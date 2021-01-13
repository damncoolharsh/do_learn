import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Mixins } from 'styles'

export default function SelectButton({children, onPress}) {
    return (
        <TouchableOpacity
            style={{elevation: 4, backgroundColor: 'white', borderRadius: 12}}
            onPress={onPress}>
            <View style={style.box}>
                <Text style={style.title}>
                    {children}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const style = {
    box: {
        alignItems: 'center',
        // width: '100%'
    },
    title: { 
        color: 'purple',
        fontSize: 14, 
        fontWeight: 'bold',
        letterSpacing: 1,
        ...Mixins.padding(12, 16)
    }
}

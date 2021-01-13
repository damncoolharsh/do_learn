import React from 'react'
import { View, Text } from 'react-native'

export default function Card({children}) {
    return (
        <View style={{backgroundColor: 'white', padding: 20}}>
            {children}
        </View>
    )
}

import React from 'react'
import {View, StyleSheet} from 'react-native'

export default Center = ({children})=>{
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {children}
        </View>
    )
};
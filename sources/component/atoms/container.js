import React from 'react'
import {View} from 'react-native'
import {Mixins} from 'sources/styles/index'

const Container = ({children})=>{
    return(
        <View style={{
            ...(Mixins.padding(14, 20))
        }}>
            {children}
        </View>
    )
}

export default Container
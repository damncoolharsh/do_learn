import React from 'react'
import {View} from 'react-native'

const Row = ({children, customStyle})=>{
    return (
        <View style={{flexDirection: 'row', ...customStyle}}>
            {children}
        </View>
    )
};

export default Row
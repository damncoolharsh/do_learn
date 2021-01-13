import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {Typography} from 'sources/styles/index'

const NormalTitle = ({children, textColor})=>{
    return (
        <Text style={{...style.title, color: textColor}}>
            {children}
        </Text>
    )
};

const style = StyleSheet.create({
   title: {
       ...(Typography.FONT_SANS_BOLD),
       fontSize: 13,
       letterSpacing: 1
   }
});

export default NormalTitle
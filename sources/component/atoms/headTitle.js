import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {Typography} from 'sources/styles/index'

const HeadTitle = ({children, extraStyle})=>{
    return (
        <Text style={{...style.title, ...extraStyle}}>
            {children}
        </Text>
    )
};

const style = StyleSheet.create({
   title: {
       ...(Typography.FONT_SANS_BOLD),
       letterSpacing: 2,
    //    padding: 5,
       fontSize: 16
   }
});

export default HeadTitle
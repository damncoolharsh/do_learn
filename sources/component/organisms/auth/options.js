import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { Colors } from 'styles'
import {NButton, NormalTitle, Row, Padding} from '../../atoms/index'

let OptionsContext

const OptionsField = ({title, data, current, onClick, onError})=>{
    const options = data.map((item)=>{
        return (
            <Row key={item}>
                {item == current
                ? <NButton 
                    textColor='white'
                    style={{backgroundColor: 'skyblue'}}
                    onPress={()=>{onClick(item)}}
                >
                    {item}
                </NButton>
                : <NButton 
                    textColor='teal'
                    onPress={()=>{onClick(item)}}
                >
                    {item}
                </NButton>
                }
                <Padding value={4} />
            </Row>
        )
    })
    
    return (
            <View style={{paddingTop: 5, paddingBottom: 5}}>
                <NormalTitle textColor={Colors.SPLASH}>{title}</NormalTitle>
                <Padding value={5} />
                <Row>
                    {options}
                </Row>
                {onError != undefined
                ? <Text style={style.error}>{onError}</Text>
                : null}
                
            </View>
    )
}

const style = StyleSheet.create({
    error: {
        color: 'red',
       fontSize: 11,
       padding: 10
    }
})

export {
    OptionsField,
    OptionsContext
}
import React, {useContext, useEffect} from 'react'
import { View, Text } from 'react-native'
import { AuthContext } from 'sources/providers/authProvider'
import {SelectButton} from 'sources/component/atoms/index'
import { Mixins } from 'styles'

export default function SelectSubject({navigation, route}) {

    const {userData} = useContext(AuthContext)

    useEffect(()=>{
        navigation.setOptions({
            headerLeft: undefined,
            title: route.params.source
        })
    }, [])

    const onPress = (key, name)=>{
        if(route.params.source == "Assignments"){
            navigation.navigate('Assignments', {subjectName: name, subjectKey: key})
        }else{
            navigation.push('StudyMaterial', {subjectName: name, subjectKey: key})
        }
    }

    return (
        <View style={style.screen}>
            <View style={style.subjectList}>
                {userData.data.subjects != undefined
                 ?   Object.keys(userData.data.subjects).map(key=>{
                    return <View style={{paddingVertical: 5, paddingHorizontal: 10}}>
                        <SelectButton key={key} onPress={()=>{onPress(key, userData.data.subjects[key].name)}}>{userData.data.subjects[key].name}</SelectButton>
                    </View>                
                    })
                : null}
            </View>
        </View>
    )
}

const style = {
    screen: {
        ...Mixins.padding(0, 20)
    },
    subjectList: {
        ...Mixins.padding(20, 0, 10)
    }
}

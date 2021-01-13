import React from 'react'
import {View, Text, Button} from 'react-native'
import { SelectButton, Padding } from 'sources/component/atoms'
import {UniqueId} from 'sources/component/organisms'

const Students = ({navigation}) => {
    return (
        <View style={{backgroundColor:'#F2F3FE', flex: 1}}>
            <View style={{paddingVertical: 10, backgroundColor: 'white', marginBottom: 14}}>
                <UniqueId />
            </View>
            <View style={{paddingHorizontal: 24, backgroundColor: 'white'}}>
                <Text style={{paddingVertical: 14}}>Selection</Text>
                <SelectButton onPress={()=>{navigation.push('Select Subject', {source: 'Study Material'})}}>Study Material</SelectButton>
                <Padding value={8} />
                <SelectButton onPress={()=>{navigation.push('Select Subject', {source: 'Assignments'})}}>Assignment</SelectButton>
                <Padding value={10} />
            </View>
        </View>
    )
};

export default Students
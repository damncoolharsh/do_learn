import React, {useContext} from 'react'
import { View, Text } from 'react-native'
import { Colors } from 'styles'
import {CButton, BottomContainer} from 'sources/component/atoms/index'
import {UniqueId} from 'sources/component/organisms/index'

export default function TakeClass({navigation, class_id}) {

    return (
        class_id != undefined
        ? <BottomContainer>
            <CButton onPress={()=>(navigation.push('LiveClass'))}>Rejoin Class</CButton>
            <CButton customStyle={{backgroundColor: Colors.DISCARD}}>Discard Class</CButton>
        </BottomContainer>
        : <BottomContainer>
            <UniqueId />
            {/* <CButton onPress={()=>(navigation.push('LiveClass'))}>Go Live</CButton> */}
        </BottomContainer>
    )
}

import React, { useContext } from 'react'
import { View, Text, Share, StyleSheet } from 'react-native'
import { Colors, Mixins, Typography } from 'styles'
import {CButton, Row} from '../../atoms/index'
import { AuthContext } from 'sources/providers/authProvider'

export default function UniqueId() {
    const {userData} = useContext(AuthContext)

    const onShare = async ()=>{
        try{
            await Share.share({
                message: `${userData.data.id}`
            })
        }catch(e){
            console.log(e)
        }
    }

    return (
        <View style={style.view}>
            <Row>
                <Text style={style.text}>Your Unique Id is: </Text>
                <Text style={{...style.text, fontWeight: 'bold'}}>{userData.data.id}</Text>
            </Row>
            <CButton 
            customStyle={{backgroundColor: Colors.SECONDARY, height: Mixins.WINDOW_HEIGHT * 0.035}}
            onPress={onShare}>Share</CButton>
        </View>
    )
}

const style = StyleSheet.create({
    view:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        // ...(Mixins.padding(5, 12)),
        // margin: 10,
        backgroundColor: 'white',
        // borderRadius: 8,
    },
    text: {
        ...(Typography.FONT_SANS_REGULAR),
        fontSize: 12
    }
})

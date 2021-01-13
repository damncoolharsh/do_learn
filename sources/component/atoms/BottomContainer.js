import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {Mixins} from 'styles'

export default function BottomContainer({children}) {
    return (
        <View style={style.view}>
            {children}
        </View>
    )
}

const style = StyleSheet.create({
    view: {
        zIndex: 1,
        elevation: 1,
        borderTopWidth: 0.1,
        paddingTop: 2,
        flexDirection: 'row',
        height: Mixins.WINDOW_HEIGHT * 0.08,
        width: Mixins.WINDOW_WIDTH,
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})

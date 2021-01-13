import React, { useContext } from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {AuthContext} from 'sources/providers/authProvider'

export default Classroom = ()=>{
    const {signOut} = useContext(AuthContext)
    return (
        <View style={style.center}>
            <Text>Student Profile</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    )
}

const style = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
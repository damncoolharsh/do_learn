import React, {useContext, useEffect, useState} from 'react'
import {Image} from 'react-native'
import { AuthContext } from 'sources/providers/authProvider'
import {DataContext} from 'sources/providers/dataProvider'
import ProfileSvg from './profile.svg'

export default function Profile ({width, height}){
    const {userData} = useContext(AuthContext)
    return (
        userData.data.picUrl
        ? <Image 
            style={{width: width, height: height, borderRadius: height / 2}}
            source={{uri: userData.data.picUrl}}
        />
        : <ProfileSvg width={width} height={height} />
    )
}
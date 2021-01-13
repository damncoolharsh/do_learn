import React, {useState} from 'react'
import {Text, StatusBar, View, StyleSheet} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {LoginHeader, FormField} from 'sources/component/organisms/index'
import {Colors} from "sources/styles";
import {Mixins} from 'sources/styles/index';
import auth from '@react-native-firebase/auth'
import {HeadTitle, Row, CButton, NButton, Padding, Loading} from "sources/component/atoms/index";

const Login = ({navigation})=>{

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const [error, invokeError] = useState("")

    // const addData = ()=>{
    //     database().ref('/users').set(userData).then(()=>{console.log("done")})
    // }

    const logInUser = async ()=>{
        if(validateData()){
            try{
                setLoading(true)
                await auth().signInWithEmailAndPassword(userData.email, userData.password)
            } catch(e){
                switch (e.code){
                    case 'auth/user-not-found':
                        invokeError("Invalid credentials")
                        break
                    case 'auth/wrong-password':
                        invokeError("Invalid credentials")
                        break
                    default:
                        console.log(e)
                        invokeError("Something Went Wrong")
                        break
                }
            }
        }
    }

    const validateData = ()=>{
        if(userData.email == "" ||  userData.password == ""){
            invokeError("Please enter valid email and password")
            return false
        }else{
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (userData.email.match(regex)) {
                invokeError("")
                return true
            }
            else {
                invokeError("Please enter valid email and password")
                return false
            }
        }
    }

    return (
        <View style={{backgroundColor: 'white', flex: 1}}>
            <StatusBar backgroundColor='#8F78EF'/>

            {/* Header */}
            <LoginHeader/>

            {/* Login */}
            {loading 
            ?   <View style={{alignItems:'center'}}>
                <Loading />
            </View>
            : <View style={style.container}>
                <HeadTitle extraStyle={{color: Colors.SPLASH}}>Login</HeadTitle>
                <Padding value={10} />

                {/* Error */}
                { error != ""
                ? <View style={style.error}>
                    <Text style={{color: 'white'}}>{error}</Text>
                </View>
                : null
                }

                {/* Form Fields */}
                <View style={style.padding}>
                    <FormField title="Email/Phone" onEnterText={text=>setUserData({...userData, email: text})}/>
                    <FormField title="Password" secure={true} onEnterText={text=>setUserData({...userData, password: text})}/>
                </View>

                {/* Buttons */}
                <Row customStyle={{justifyContent: 'flex-end'}}>
                    <NButton onPress={()=>{navigation.push('SignUp')}} textColor={Colors.PRIMARY}>
                        Create New Account
                    </NButton>
                    <Padding value={10} />
                    <CButton onPress={()=>logInUser()}>Login</CButton>
                </Row>
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={()=>{
                        navigation.push('Verify')
                    }}>
                        <Padding value={10} />
                        <Text style={{color: Colors.LINK}}>Forget Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </View>
    )
};

const style = StyleSheet.create({
   container: {
       ...(Mixins.margin(0, 20))
   },
    padding: {
       ...(Mixins.padding(10))
    },
    primaryButton: {
        borderRadius: 8,
        marginLeft: 10
    },
    secondaryButton: {
        borderRadius: 8
    },
    error: {
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 5
    }
});

export default Login
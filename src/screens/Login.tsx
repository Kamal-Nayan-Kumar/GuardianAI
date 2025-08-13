import { StyleSheet, Text, View,Button,TextInput,TouchableOpacity,Dimensions } from 'react-native'
import React ,{useEffect,useState}from 'react'
//navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamlist } from '../App'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
// import { StatusBar } from 'react-native/types_generated/index'
//older method
// import database from '@react-native-firebase/database'
// import auth from '@react-native-firebase/auth'

//new method
import { signInWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { getDatabase, ref, get } from '@react-native-firebase/database';
type DetailsProps=NativeStackScreenProps<RootStackParamlist,'Login'>

const Login = () => {

//   const {productId}=route.params
  const navigation=useNavigation<NativeStackNavigationProp<RootStackParamlist>>()
const [email, setemail] = useState('')
const [password, setpassword] = useState('')
  const [message, setmessage] = useState('')

  const handleLogin=async()=>{
    try {
      const authInstance=getAuth();
      const db=getDatabase();
      const isUser=await signInWithEmailAndPassword(
              authInstance,
              email,
              password
            )
            const uid=isUser.user.uid;
            const details=await get(ref(db,`/users/${uid}`));
            let nickname='';
            if(details.exists()){
              nickname=details.val().nickname||""
            }
            setmessage('')
            navigation.navigate('Home',{
              email:isUser.user.email,
              nickname:nickname
            })


    } catch (error) {
         const err = error as Error;
  console.log(err.message);
    //   console.log(error)
      setmessage(err.message)
    }
  }

  return (
  <View style={styles.container}>
    <View style={styles.formWrapper}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={value => setemail(value)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={value => setpassword(value)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}
const {width}=Dimensions.get('window');

export default Login

const styles = StyleSheet.create({
    container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
backgroundColor:'#f8f8f8'
  },
  inputWrapper: {
  marginBottom: 12,
},
label: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},

  formWrapper:{
paddingHorizontal:20,
alignItems:'center'
  },
  heading:{
    textAlign:'center',
    fontSize:26,
fontWeight:"bold",
marginBottom:20,
color:'#333'
  },
  smallText:{
         color: "#000000"
  },
  inputBox: {
    width:width*0.75,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:'#ccc',
    color: '#333',
    marginVertical: 8,
backgroundColor:"#fff",
fontSize:16,
    padding: 12,
  },
  addButton: {
    backgroundColor: '#4a90e2',
    width:width*0.85,
    paddingVertical:14,
    borderRadius:12,
marginTop:15,
shadowColor:'#000',
 shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    padding: 10,
    
},
buttonText: {
    color: '#fff',
    fontSize: 18, // ✅ readable font
    fontWeight: 'bold',
  }})
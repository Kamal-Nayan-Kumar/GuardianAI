import { StyleSheet, Text,View,Button,TextInput,TouchableOpacity,Dimensions } from 'react-native'
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
import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { getDatabase, ref, set } from '@react-native-firebase/database';
type SignupProps=NativeStackScreenProps<RootStackParamlist,'Signup'>
const {width}=Dimensions.get('window');
const Signup = ({route}:SignupProps) => {

  // const {productId}=route.params
  const navigation=useNavigation<NativeStackNavigationProp<RootStackParamlist>>()
const [email, setemail] = useState('')
const [password, setpassword] = useState('')
  const [message, setmessage] = useState('')
const [nickname, setnickname] = useState('')
  const handleSignup=async()=>{
    try {
      const authInstance=getAuth();
      const db = getDatabase();
      const User=await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      )
      const uid=User.user.uid;
      await set(ref(db, `/users/${uid}`), {
      email,
      nickname
    });

    } catch (error) {
      const Err=error as Error
      console.log(Err)
      setmessage(Err.message)
    }
  }

return (
  <View style={styles.container}>
    <View style={styles.formWrapper}>
      <Text style={styles.heading}>Signup</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your nickname"
          placeholderTextColor="#888"
          value={nickname}
          onChangeText={value => setnickname(value)}
        />
      </View>

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

      <TouchableOpacity style={styles.addButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#28a745', marginTop: 10 }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  </View>
);

}

export default Signup

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
  },})
import { StyleSheet,Button, Text, View,TouchableOpacity,Image,ImageBackground } from 'react-native'
import React from 'react'
import type { PropsWithChildren } from 'react'
//navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamlist } from '../App'
import {useRoute} from '@react-navigation/native'
type HomeProps=NativeStackScreenProps<RootStackParamlist,'Home'>

const Home = ({navigation}:HomeProps) => {
  const route=useRoute<any>();
  // const {email,uid}=route.params as { email: string; uid: string };
  const email = route.params?.email;
const nickname = route.params?.nickname;
const [welcomeText, setWelcomeText] = React.useState<string>('');
const fullText = "Welcome to our app";
React.useEffect(() => {
  setWelcomeText('');                 // reset before typing
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const typeChar = (i: number) => {
    if (cancelled) return;
    if (i > fullText.length) return;  // stop when we've reached the end

    // set the substring up to i (no risk of undefined)
    setWelcomeText(fullText.slice(0, i));

    // schedule next char only if we haven't finished
    if (i < fullText.length) {
      timer = setTimeout(() => typeChar(i + 1), 100);
    }
  };

  typeChar(1); 
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}, []);
  return (

   
  <View style={styles.container}>
    {/* Navbar */}
    <View style={styles.navbar}>
      {/* Left: Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/logo1.jpg')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>MyApp</Text>
      </View>

      {/* Right: Buttons */}
      <View style={styles.navButtons}>
        {nickname ? (
          <Text style={styles.nickname}>{nickname}</Text>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.navButtonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navButton, styles.signupButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.navButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Image background starts AFTER navbar */}
    <ImageBackground
      source={require('../assets/bg.jpg')}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      {/* Main Content */}
     <View style={styles.content}>
  {nickname ? (
    <TouchableOpacity
      style={styles.chatbotButton}
      onPress={() => navigation.navigate('ChatScreen')}
    >
      <Text style={styles.chatbotButtonText}>💬 Chat with Chatbot</Text>
    </TouchableOpacity>
  ) : (
    <Text style={styles.welcomeText}>{welcomeText}</Text>
  )}
</View>

    </ImageBackground>
  </View>


  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  imageBackground: {
  flex: 1,
  width: '100%',
},
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: '	#10898d',
    elevation: 3,
    backgroundColor: 'rgba(16, 137, 141, 0.8)', 
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 20,
    
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  navButtons: {
    flexDirection: 'row',
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#357ABD',
    borderRadius: 6,
    marginLeft: 8,
  },
  signupButton: {
    backgroundColor: '#28a745',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    fontSize: 18,
    color: '#333',
    marginBottom: 6,
  },
  smallText: {
    color: '#555',
  },
  nickname: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
chatbotButton: {
  backgroundColor: '#357ABD',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  elevation: 3,
},
chatbotButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
welcomeText: {
  fontSize: 30,
  color: '#333',
  fontWeight: 'bold',
  textAlign: 'center',
},

})
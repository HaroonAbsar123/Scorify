// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Loader from './Loader';

const Login = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  GoogleSignin.configure({
    webClientId: '47008947111-ic65n90uldobf2nk2dnfg29opl99sij5.apps.googleusercontent.com', // Replace with your web client ID
  });
  const passwordInputRef = createRef();


  const SignInWithGoogle = async () => {
    try {
      // Sign in with Google
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(googleCredential);
  
      // If the user is successfully signed in, you can access userCredential.user
      // to access the user information.
  
      const user = userCredential.user;
  
      // Set the user's ID in AsyncStorage
      await AsyncStorage.setItem('userId', user.uid);
  
      // Navigate to the "Home" screen and replace the current screen
      // You should have the navigation prop available to access navigation here
      navigation.replace('BottomNavigation');
    } catch (error) {
      setErrortext(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitPress = async () => {
    setErrortext('');
  
    if (!userEmail || !userPassword) {
      setErrortext('Please fill in all fields');
      return;
    }
  
    try {
      setLoading(true);
  
      const userCredential = await auth().signInWithEmailAndPassword(userEmail, userPassword);
  
      // If the user is successfully logged in, you can use userCredential.user
      // to access the user information.
  
      // Set the user's ID in AsyncStorage
      await AsyncStorage.setItem('userId', userCredential.user.uid);
  
      // Navigate to the "Home" screen
      navigation.replace('BottomNavigation');
    } catch (error) {
      setErrortext(error.message);
    } finally {
      setLoading(false);
    }
  };




  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../assets/app_icon.png')}
                style={{
                  width: '50%',
                  height: 150,
                  resizeMode: 'contain',
                }}
              />
            </View>

            <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>LOGIN</Text>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Enter Email" //dummy@abc.com
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                
                placeholderTextColor="#8b9cb5"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.buttonStyleGoogle}
              activeOpacity={0.5}
              onPress={SignInWithGoogle}>
                <Image source={require('../../assets/googleLogo.png')}
                style={{
                  width: '100%',
                  height: '70%',
                  resizeMode: 'contain'
                }} />
            </TouchableOpacity>

            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('Signup')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#ca3232',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#ca3232',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },

  buttonStyleGoogle: {
    backgroundColor: '#fff',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#ca3232',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
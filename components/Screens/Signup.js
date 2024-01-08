// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import Loader from './Loader';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const Signup = (props) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);

  const emailInputRef = createRef();
  const passwordInputRef = createRef();


  GoogleSignin.configure({
    webClientId: '47008947111-ic65n90uldobf2nk2dnfg29opl99sij5.apps.googleusercontent.com', // Replace with your web client ID
  });



  const signUpWithGoogle = async () => {
    try {
      // Sign in with Google
      
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign in with Firebase
      await auth().signInWithCredential(googleCredential);
  
      // Get user information
      const user = auth().currentUser;
  
      if (user) {
        // Handle user registration logic here, e.g., save user data to a database
        setIsRegistraionSuccess(true);
      }
    } catch (error) {
      setErrortext(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitButton = async () => {
    setErrortext('');
  
    if (!userEmail || !userPassword) {
      setErrortext('Please fill in all fields');
      return;
    }
  
    try {
      setLoading(true);
  
      const userCredential = await auth().createUserWithEmailAndPassword(userEmail, userPassword);
  
      // If the user was registered successfully, you can use userCredential.user
      // to access the user information.
  
      setIsRegistraionSuccess(true);
    } catch (error) {
      setErrortext(error.message);
    } finally {
      setLoading(false);
    }
  };
  


  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#1e1e1e',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../assets/app_icon.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#1e1e1e',flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
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
    textAlign: 'center'}}>REGISTER</Text>

        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
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
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>



          <TouchableOpacity
              style={styles.buttonStyleGoogle}
              activeOpacity={0.5}
              onPress={signUpWithGoogle}>
                <Image source={require('../../assets/googleLogo.png')}
                style={{
                  width: '100%',
                  height: '70%',
                  resizeMode: 'contain'
                }} />
            </TouchableOpacity>


        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default Signup;

const styles = StyleSheet.create({
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
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
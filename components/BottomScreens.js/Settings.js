import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Settings({ navigation }) {

    const handleClearAsyncStorage = async () => {
        try {
          await AsyncStorage.clear();
          console.log('AsyncStorage cleared successfully.');
        } catch (error) {
          console.error('Error clearing AsyncStorage:', error);
        }
      };


    const handleSignOut = async () => {
      try {
        handleClearAsyncStorage();
        // Navigate to the login screen or any other screen as needed
        navigation.replace('Login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  
    return (
      <View style={styles.container}>
        {/* Background Image */}
        <Image
          source={require('../../assets/homeBackground.jpg')}
          style={styles.backgroundImage}
        />
  
        {/* Settings Content */}
        <View style={styles.settingsContent}>

        <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../assets/appIcon.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                }}
              />
            </View>

        <Text style={styles.settingsTitle}>Scorify</Text>
        <Text style={styles.settingsTitleSecond}>Your Ultimate Cricket Scoring App!</Text>
  
          {/* Add other settings components here as needed */}
          
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonTextStyle}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', // Background color for the entire screen
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    settingsContent: {
      flex: 1,
      justifyContent: 'center',
    },
    settingsTitle: {
      fontSize: 35,
      fontWeight: 'bold',
      width: '100%',
        textAlign: 'center',
        color: 'white',
        
        marginBottom: 5
    },
    settingsTitleSecond: {
      fontSize: 20,
      fontWeight: 'bold',
      width: '100%',
        textAlign: 'center',
        color: 'white',
    },
    signOutButton: {
      backgroundColor: 'red', // Customize the button background color
      padding: 10,
      borderRadius: 5,
    
    },
    signOutText: {
      color: 'white',
      fontSize: 16,
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
      marginBottom: 25,
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
      justifyContent: 'center',
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
  });
  
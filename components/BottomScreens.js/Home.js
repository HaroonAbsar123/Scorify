import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {responsiveWidth} from 'react-native-responsive-dimensions';

export default function Home({navigation}) {
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
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/homeBackground.jpg')}
        style={styles.backgroundImage}
      />

      {/* Settings Content */}
      <View style={styles.settingsContent}>
        <View style={{flex: 2}}>
          <Image
            source={require('../../assets/worldcuplogo.png')}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={{flex: 1, margin: 5}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => {navigation.navigate('EnterMatchCode')}}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  View Match
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity
              onPress={() => {navigation.navigate('CreateMatchCode')}}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Create Match
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <TouchableOpacity
              onPress={() => {navigation.navigate('OldMatches')}}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Old Matches
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              <TouchableOpacity
              onPress={() => {navigation.navigate('EditMatchCode')}}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Edit Match
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={{flex: 1, flexDirection: 'row'}}>


            <View style={{flex: 1}}>
              <TouchableOpacity
              onPress={() => {navigation.navigate('TournamentHomeScreen')}}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Tournament
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Background color for the entire screen
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
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
});

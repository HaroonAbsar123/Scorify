import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet,ScrollView,TouchableOpacity,Image } from 'react-native';
import ErrorModal from '../Screens/ErrorModal';
import database from '@react-native-firebase/database';

export default function CreateTournament({ navigation }) {
  const [tournamentName, setTournamentName] = useState('');
  const [numOfTeams, setNumOfTeams] = useState(0);
  const [numOfPlayerInTeam, setNumOfPlayerInTeam] = useState(0);
  const [tournamentCode, setTournamentCode] = useState('');
  const [totalOvers, setTotalOvers] = useState(0)
  const [errorModal, setErrorModal] = useState(false)


  const handleNext = () => {
    if (!tournamentName || !tournamentCode || numOfTeams < 5 || numOfPlayerInTeam <2 || totalOvers===0) {
      Alert.alert('Please fill in all fields correctly.');
    } else {

      database()
        .ref(`/Scorify/tournament/${tournamentCode}`)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            // MatchCode already exists, show an alert
            Alert.alert('Tournament Code Already Exists', 'Please choose a different Tournament Code.');
          } else {
            // Data to pass to the next screen
            navigation.navigate('EnterTeamDetails', {
              tournamentName,
              numOfTeams,
              tournamentCode,
              numOfPlayerInTeam,
              totalOvers
            });
          }
        })
        .catch((error) => {
          console.error('Error checking matchCode:', error);
        });

      
    }
  };


  return (
    <ScrollView style={{flex: 1, backgroundColor: '#1e1e1e'}}>
    <View style={{ flex: 1, justifyContent: 'center'}}>


    <View style={{alignItems: 'center'}}>
    <Image
        source={require('../../assets/worldcuplogo.png')} // You can replace this with your under development image
        style={{
        width: 200, // Adjust the width and height based on your image
        height: 200,
      marginTop: 30}}
      />
            </View>

      <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>CREATE TOURNAMENT</Text>



      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Enter tournament name"
        onChangeText={(text) => setTournamentName(text)}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>


      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Overs"
        onChangeText={(text) => setTotalOvers(parseInt(text))}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>

      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Enter number of teams (min. 5)"
        keyboardType="numeric"
        onChangeText={(text) => setNumOfTeams(parseInt(text))}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>

      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Number of Players in a team (min. 2)"
        keyboardType="numeric"
        onChangeText={(text) => setNumOfPlayerInTeam(parseInt(text))}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>

      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Enter tournament code"
        onChangeText={(text) => setTournamentCode(text)}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>


<TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleNext}>
            <Text style={styles.buttonTextStyle}>Continue</Text>
          </TouchableOpacity>




          {errorModal && <ErrorModal setErrorModal={setErrorModal} errorModal={errorModal} text="Please Fill All Details" />}
          </View>
          </ScrollView>
  );

}


const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
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
    marginBottom: 30
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
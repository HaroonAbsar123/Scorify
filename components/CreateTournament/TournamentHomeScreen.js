import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Select } from 'native-base';
import ErrorModal from '../Screens/ErrorModal';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import database from '@react-native-firebase/database';

export default function TournamentHomeScreen({ navigation }) {
  const [matchCode, setMatchCode] = useState('');
  const [errorModal, setErrorModal] = useState(false);

  const handleCreateMatchCode = () => {
    // Check if any of the fields are empty
    if (!matchCode) {
      // Show an alert if the field is empty
      setErrorModal(true);
    } else {
      
      // Check if the matchCode already exists
      // database()
      //   .ref(`/Scorify/tournament/${matchCode}`)
      //   .once('value', snapshot => {
      //     if (snapshot.exists()) {
      //       const matchData = snapshot.val();
      //       if (!matchData.tournamentFinished) {
      //         // MatchCode exists and is not finished, navigate to the "ViewMatch" screen
      //         navigation.navigate('GenerateMatches', { tournamentCode: matchCode });
      //       } else {
      //         // MatchCode exists but is finished, show an alert
      //         Alert.alert(
      //           'MatchCode Already Finished',
      //           'The entered MatchCode refers to a match that has already finished.',
      //         );
      //       }
      //     } else {
      //       // MatchCode doesn't exist, show an alert
      //       Alert.alert(
      //         'MatchCode Not Found',
      //         'The entered MatchCode does not exist.',
      //       );
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error checking matchCode:', error);
      //   });

      database()
        .ref(`/Scorify/tournament/${matchCode}`)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            navigation.navigate('GenerateMatches', { tournamentCode: matchCode });
          } else {
            // MatchCode doesn't exist, show an alert
            Alert.alert(
              'Tournament Not Found',
              'The entered Tournament does not exist.',
            );
          }
        })
        .catch(error => {
          console.error('Error checking matchCode:', error);
        });


    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
      }}>
        
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../../assets/app_icon.png')}
          style={{
            width: '50%',
            height: 150,
            resizeMode: 'contain',
            margin: 20,
          }}
        />
      </View>

      <View style={{marginBottom: 30}}>
      <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>CREATE TOURNAMENT</Text>

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {navigation.navigate("CreateTournament")}}>
        <Text style={styles.buttonTextStyle}>Create New Tournament</Text>
      </TouchableOpacity>

      </View>

      <View >

      <Text style={{  fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>ENTER MATCH SCORES</Text>

      <View style={styles.SectionStyle}>
        <TextInput
          placeholder="Enter Tournament Code"
          value={matchCode}
          onChangeText={text => setMatchCode(text)}
          style={styles.inputStyle}
          underlineColorAndroid="#f000"
          placeholderTextColor="#8b9cb5"
        />
      </View>

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={handleCreateMatchCode}>
        <Text style={styles.buttonTextStyle}>Submit</Text>
      </TouchableOpacity>
      </View>




      {errorModal && (
        <ErrorModal
          setErrorModal={setErrorModal}
          errorModal={errorModal}
          text="Please Fill All Details"
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 0,
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
    marginTop: 10,
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

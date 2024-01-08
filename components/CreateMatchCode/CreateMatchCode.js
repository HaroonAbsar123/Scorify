import React, { useState } from 'react';
import {ScrollView, View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Select } from 'native-base';
import ErrorModal from '../Screens/ErrorModal';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import database from '@react-native-firebase/database';

export default function CreateMatchCode({ navigation }) {
  const [visitorTeam, setVisitorTeam] = useState('');
  const [hostTeam, setHostTeam] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [optedChoice, setOptedChoice] = useState('');
  const [totalOvers, setOvers] = useState('');
  const [matchCode, setMatchCode] = useState(''); // User-provided match code
  const [errorModal, setErrorModal] = useState(false)

  
  const handleCreateMatchCode = () => {
    // Check if any of the fields are empty
    if (
      !visitorTeam ||
      !hostTeam ||
      !tossWinner ||
      !optedChoice ||
      !totalOvers ||
      !matchCode
    ) {
      // Show an alert if any of the fields are empty
      setErrorModal(true);
    } else {
      // Check if the matchCode already exists
      database()
        .ref(`/Scorify/${matchCode}`)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            // MatchCode already exists, show an alert
            Alert.alert('MatchCode Already Exists', 'Please choose a different MatchCode.');
          } else {
            // Data to pass to the next screen
            const matchData = {
              visitorTeam,
              hostTeam,
              tossWinner,
              optedChoice,
              totalOvers,
              matchCode,
            };
  
            // Navigate to the next screen (CreateTeam) with the data as props
            navigation.navigate('CreateTeam', { matchData });
          }
        })
        .catch((error) => {
          console.error('Error checking matchCode:', error);
        });
    }
  };

  

  return (
    <ScrollView >
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#1e1e1e', paddingTop: 30}}>


    <View style={{alignItems: 'center'}}>
    <Image
        source={require('../../assets/worldcuplogo.png')} // You can replace this with your under development image
        style={{
        width: 200, // Adjust the width and height based on your image
        height: 200,}}
      />
            </View>

      <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>CREATE MATCH</Text>



      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Visitor Team"
        value={visitorTeam}
        onChangeText={text => setVisitorTeam(text)}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>


      <View style={styles.SectionStyle}>
      <TextInput
        placeholder="Host Team"
        value={hostTeam}
        onChangeText={text => setHostTeam(text)}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>


      <View style={{
  flexDirection: 'row',
  height: 40,
  marginTop: 20,
  marginLeft: 35,
  marginRight: 35,
  margin: 10,
}}>
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Select
      selectedValue={tossWinner}
      onValueChange={itemValue => setTossWinner(itemValue)}
      style={{
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#dadae8',
        color: 'white',
        fontSize: 15
      }}
      borderWidth={1}
      borderRadius={30}
      
    >
      <Select.Item label="Select Toss Winner" value="" />
      <Select.Item label={visitorTeam} value={visitorTeam} />
      <Select.Item label={hostTeam} value={hostTeam} />
    </Select>
  </View>
</View>


<View style={{
  flexDirection: 'row',
  height: 40,
  marginTop: 20,
  marginLeft: 35,
  marginRight: 35,
  margin: 10,
}}>
  <View style={{ flex: 1, justifyContent: 'center' }}>
      <Select
        selectedValue={optedChoice}
        onValueChange={(itemValue) => setOptedChoice(itemValue)}
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          borderColor: '#dadae8',
          color: 'white',
          fontSize: 15
        }}
        borderWidth={1}
        borderRadius={30}
      >
        <Select.Item label="Selected opted choice" value="" />
        <Select.Item label="Bat" value="bat" />
        <Select.Item label="Bowl" value="bowl" />
      </Select>
      </View>
</View>

<View style={styles.SectionStyle}>
<TextInput
        placeholder="Overs"
        onChangeText={text => setOvers(parseInt(text))}
        keyboardType='numeric'
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
      </View>



      <View style={styles.SectionStyle}>
<TextInput
        placeholder="Match Code"
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
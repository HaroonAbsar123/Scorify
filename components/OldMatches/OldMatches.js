import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import ErrorModal from '../Screens/ErrorModal';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import database from '@react-native-firebase/database';
import Loader from '../Screens/Loader';

export default function OldMatches({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    // Fetch a list of matches with matchFinished === true and winningStatement !== ""
    database()
      .ref('/Scorify')
      .once('value')
      .then((snapshot) => {
        const matchList = [];
        snapshot.forEach((childSnapshot) => {
          const match = childSnapshot.val();
          if (match.matchFinished) {
            matchList.push(match);
          }
        });
        setMatches(matchList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching matches:', error);
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={require('../../assets/app_icon.png')}
          style={{
            width: '50%',
            height: 150,
            resizeMode: 'contain',
            margin: 30,
          }}
        />
      </View>

      <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>OLD MATCHES</Text>

      {loading ? (
        <Loader loading={loading} /> 
      ) : (
        matches.map((match, index) => (
          <TouchableOpacity
            key={index}
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('OldMatchView', { matchCode: match.matchCode });
            }}
          >
            <Text style={styles.buttonTextStyle}>
              {match.hostTeam} vs {match.visitorTeam}
              {match?.tournamentName && 
              <Text style={styles.buttonTextStyle}> ({match?.tournamentName})</Text>
            }
            </Text>
          </TouchableOpacity>
        ))
      )}

      {errorModal && (
        <ErrorModal
          setErrorModal={setErrorModal}
          errorModal={errorModal}
          text="Please Fill All Details"
        />
      )}
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
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 10,
    marginBottom: 10,
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
    color: '#ca3232',
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

import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';

export default function CreateTeam({navigation, route}) {
  // Define state variables to store the received props and players for each team
  const [propsData, setPropsData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  useEffect(() => {
    // Access the props from the route and set it in state
    if (route && route.params) {
      const {matchData} = route.params;
      setPropsData(matchData);
    }
  }, [route]);

  const addPlayer = (teamNumber, playerName) => {
    if (teamNumber === 1) {
      setTeam1Players([...team1Players, { name: playerName }]);
    } else if (teamNumber === 2) {
      setTeam2Players([...team2Players, { name: playerName }]);
    }
  };

  const renderPlayers = (teamNumber, teamName, players) => {
    return (
      <View
        style={{
          flex: 1,
          margin: 10,
          borderWidth: 1,
          borderRadius: 30,
          borderColor: "#dadae8",
          padding: 5,
          paddingTop: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "white", textAlign: "center" }}>{teamName}</Text>
        <ScrollView>
          {players.map((player, index) => (
            <View key={index} style={styles.SectionStyle}>
              <TextInput
                key={index}
                style={styles.inputStyle}
                placeholder={`Player ${index + 1}`}
                value={player.name} 
                underlineColorAndroid="#f000"
                placeholderTextColor="#8b9cb5"
                onChangeText={(text) => {
                  const updatedPlayers = [...players];
                  updatedPlayers[index] = { name: text };
                  if (teamNumber === 1) {
                    setTeam1Players(updatedPlayers);
                  } else if (teamNumber === 2) {
                    setTeam2Players(updatedPlayers);
                  }
                }}
              />
            </View>
          ))}
        </ScrollView>
        {players.length < 11 && (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => addPlayer(teamNumber, "")}
          >
            <Text style={styles.buttonTextStyle}>{`Add Player`}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

  const allTeamData = {
    ...propsData,
    hostTeamPlayers: team1Players,
    visitorTeamPlayers: team2Players,
  };

  // Check if both teams have a minimum of two players
  const bothTeamsHaveMinimumPlayers =
    team1Players.length >= 2 && team2Players.length >= 2;


    const navigateToScoreboard = () => {
      // Check if all player names are entered in both teams
      const team1NamesEntered = team1Players.every(player => player.name.trim() !== '');
      const team2NamesEntered = team2Players.every(player => player.name.trim() !== '');
  
      if (team1NamesEntered && team2NamesEntered) {
        // All names are entered, navigate to the Scoreboard screen
        navigation.navigate('Scoreboard', { allTeamData });
      } else {
        // Display an alert that all names are not entered
        Alert.alert('Alert', 'Please enter names for all players in both teams.');
      }
    };
    

  return (
    <View style={{flex: 1, backgroundColor: '#1e1e1e'}}>

<Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>ENTER DETAILS</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {renderPlayers(1, propsData?.hostTeam, team1Players)}
        {renderPlayers(2, propsData?.visitorTeam, team2Players)}
      </View>

      {bothTeamsHaveMinimumPlayers && (
                  <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={navigateToScoreboard}
                  >
                  <Text style={styles.buttonTextStyle}>Next</Text>
                </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginLeft: 5,
    marginRight: 5,
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
    marginLeft: 5,
    marginRight: 5,
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
    marginBottom: 20,
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 15,
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

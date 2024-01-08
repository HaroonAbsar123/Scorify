import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import database from '@react-native-firebase/database';

export default function EnterTeamDetails({ route, navigation }) {
    const { numOfTeams, numOfPlayerInTeam, tournamentName, tournamentCode, totalOvers } = route.params;
    const [teamsData, setTeamsData] = useState(
      Array(numOfTeams).fill().map(() => ({
        title: '',
        players: Array(numOfPlayerInTeam).fill('')
      })
    ));
  
    const renderPlayers = (teamIndex) => {
      return (
        <View
          key={teamIndex}
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
          <TextInput
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
              textAlign: "center"
            }}
            placeholder={`Team Title`}
            underlineColorAndroid="#f000"
            placeholderTextColor="#8b9cb5"
            value={teamsData[teamIndex].title}
            onChangeText={(text) => {
              const updatedData = [...teamsData];
              updatedData[teamIndex].title = text;
              setTeamsData(updatedData);
            }}
          />
          <ScrollView>
          {teamsData[teamIndex].players.map((player, playerIndex) => (
  <View key={playerIndex} style={styles.SectionStyle}>
    <TextInput
      key={playerIndex}
      style={styles.inputStyle}
      placeholder={`Player ${playerIndex + 1}`}
      underlineColorAndroid="#f000"
      placeholderTextColor="#8b9cb5"
      value={player.name} // Assuming player is an object with a 'name' property
      onChangeText={(text) => {
        const updatedData = [...teamsData];
        updatedData[teamIndex].players[playerIndex] = { name: text };
        setTeamsData(updatedData);
      }}
    />
  </View>
))}

          </ScrollView>
        </View>
      );
    };


    const addItem = (item, matchCode) => {
        database().ref(`/Scorify/tournament/${matchCode}`).set(item);
      };
  
      const saveTeamDetails = async () => {
        // Check if all teams have titles and at least two players
        const allTeamsHaveTitles = teamsData.every((data) => data.title.trim() !== '');
        const allTeamsHaveMinimumPlayers = teamsData.every(
          (data) => data.players.filter((player) => player?.name?.trim() !== '').length >= 2
        );
      
        if (allTeamsHaveTitles && allTeamsHaveMinimumPlayers) {
          // Navigate to the next screen with the teams data
          console.log("teamsData", teamsData);
      
          const generatedMatches = [];
      
          if (teamsData) {
            for (let i = 0; i < teamsData.length; i++) {
              for (let j = i + 1; j < teamsData.length; j++) {
                const match = {
                  teamA: teamsData[i].title,
                  teamB: teamsData[j].title,
                };
                generatedMatches.push(match);
              }
            }
      
            // Post match data to Firebase
            const teamDataForFirebase = {};
            teamsData.forEach((team) => {
              const { title, players, ...rest } = team;
              teamDataForFirebase[title] = {
                title,
                players,
                ...rest,
              };
            });
      
            const dataToPost = {
              teams: teamDataForFirebase,
              numOfTeams,
              numOfPlayerInTeam,
              tournamentName,
              tournamentCode,
              matches: generatedMatches,
              totalOvers,
              matchType: 'Group',
            };
      
            // Assuming `addItem` is an asynchronous function, you can use `await` here
            await addItem(dataToPost, tournamentCode);
      
            navigation.navigate('GenerateMatches', { tournamentCode });
          } else {
            
            // Handle validation error, show a message to the user, etc.
          }
        } else {
          // Display an alert if validation fails
          Alert.alert('Alert', 'Please enter details for all teams.');
        }
      };
      
      
  
    return (
      <View style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
        <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>ENTER TEAM DETAILS</Text>
        <ScrollView>
          {teamsData.map((teamData, teamIndex) => renderPlayers(teamIndex))}
        </ScrollView>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={saveTeamDetails}
        >
          <Text style={styles.buttonTextStyle}>Next</Text>
        </TouchableOpacity>
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

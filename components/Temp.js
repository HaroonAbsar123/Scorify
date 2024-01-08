import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView,Image } from 'react-native';
import database from '@react-native-firebase/database';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Select } from 'native-base';

export default function MatchesDetails({ route, navigation }) {
  const [teams, setTeams] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); // State for controlling the modal
  const [selectedPlayer, setSelectedPlayer] = useState(null); // State to store the selected player
  const [selectedTeam, setSelectedTeam] = useState(null);


  const [winningTeam, setWinningTeam] = useState("");
  const [winningStatement, setWinningStatement] = useState("")
  const { item, tournamentCode } = route.params;



  const [score, setScore] = useState(0);
  const [ballsPlayed, setBallsPlayed] = useState(0);
  const [ballsDelivered, setBallsDelivered] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [runsConceded, setRunsConceded] = useState(0);


  async function submitHandler() {
    try {
      const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/matches`);
      const { teamA, teamB } = item;
  
      const winsRef = database().ref(`/Scorify/tournament/${tournamentCode}/wins`);
  
      // Read the current wins value
      const winsSnapshot = await winsRef.once('value');
      const currentWins = winsSnapshot.val() || 0; // Default to 0 if there's no value
  
      // Increment the wins value by one
      const updatedWins = currentWins + 1;
  
      // Update the wins value in the Firebase Realtime Database
      await winsRef.set(updatedWins);
  
      const matchesSnapshot = await matchesRef.once('value');
      matchesSnapshot.forEach((matchSnapshot) => {
        const matchData = matchSnapshot.val();
  
        if (matchData.teamA === teamA && matchData.teamB === teamB) {
          // Found the match with the specified teams
          const matchPath = `/Scorify/tournament/${tournamentCode}/matches/${matchSnapshot.key}`;
  
          const updatedData = {
            winningTeam: winningTeam,
            winningStatement: winningStatement,
            // Add other match data here if needed
          };
  
          // Update the specific match's data in the Firebase Realtime Database
          const matchRef = database().ref(matchPath);
          matchRef.update(updatedData);
        }
      });
  
      navigation.goBack();
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
    }
  }
  
  
  


  const showPlayerDetailsModal = (player, team) => {
    setSelectedPlayer(player);
    setModalVisible(true);
    setSelectedTeam(team)
  };

  const hidePlayerDetailsModal = () => {
    setModalVisible(false);
    setSelectedPlayer('');
    setSelectedTeam('')
    setScore(0)
    setBallsDelivered(0)
    setWickets(0)
    setBallsPlayed(0)
    setRunsConceded(0)
  };

  useEffect(() => {
    // Fetch matches data from Firebase
    const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}`);
    matchesRef.on('value', (matchesSnapshot) => {
      const matchesData = matchesSnapshot.val();
      if (matchesData) {
        const matchesArray = Object.values(matchesData.teams);
        const { teamA, teamB } = item;
      
        const updatedTeams = matchesArray.filter((team) => team.title === teamA || team.title === teamB);
        setTeams(updatedTeams)
        // console.log(JSON.stringify(updatedTeams));
      }
      
      // Cleanup listeners when component unmounts
      return () => {
        matchesRef.off('value');
      };
    });
  }, [tournamentCode, item]);


  useEffect(() => {
    // Fetch matches data from Firebase
    const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/matches`);
    matchesRef.on('value', (matchesSnapshot) => {
      const matchesData = matchesSnapshot.val();
    //   console.log(matchesData)
      if (matchesData) {
        const matchesArray = Object.values(matchesData);
        // console.log(matchesArray)
      } 
      // Cleanup listeners when component unmounts
      return () => {
        matchesRef.off('value');
      };
    });
  }, [tournamentCode, item]);

  function PlayerEntered() {
    // Convert the input values to integers
    const intScore = parseInt(score, 10) || 0;
    const intBallsPlayed = parseInt(ballsPlayed, 10) || 0;
    const intBallsDelivered = parseInt(ballsDelivered, 10) || 0;
    const intWickets = parseInt(wickets, 10) || 0;
    const intRunsConceded = parseInt(runsConceded, 10) || 0;
  
    // Construct the path to update the player's data in the database
    const tournamentCodeRef = `/Scorify/tournament/${tournamentCode}/teams`;
  
    // Find the team in the database that matches the selected team title
    const selectedTeamRef = database().ref(tournamentCodeRef);
    selectedTeamRef.orderByChild('title').equalTo(selectedTeam.title).once('value', (teamSnapshot) => {
      console.log('teamSnapshot:', teamSnapshot.val());
      teamSnapshot.forEach((team) => {
        if (team) { // Check if the team is not null
          const players = team.val().players;
          const selectedPlayerKey = Object.keys(players).find(
            (playerKey) => players[playerKey].name === selectedPlayer.name
          );
  
          if (selectedPlayerKey) {
            // Construct the path to update the player's data
            const playerPath = `${tournamentCodeRef}/${team.key}/players/${selectedPlayerKey}`;
            
            // Fetch the existing player data from the database
            const playerRef = database().ref(playerPath);
            playerRef.once('value', (playerSnapshot) => {
              const existingData = playerSnapshot.val() || {}; // If no data, initialize as an empty object
              const updatedData = {
                score: intScore + (parseInt(existingData.score, 10) || 0), // Add new score to existing score
                ballsPlayed: intBallsPlayed + (parseInt(existingData.ballsPlayed, 10) || 0), // Add new ballsPlayed to existing ballsPlayed
                ballsDelivered: intBallsDelivered + (parseInt(existingData.ballsDelivered, 10) || 0), // Add new ballsDelivered to existing ballsDelivered
                wickets: intWickets + (parseInt(existingData.wickets, 10) || 0), // Add new wickets to existing wickets
                runsConceded: intRunsConceded + (parseInt(existingData.runsConceded, 10) || 0), // Add new runsConceded to existing runsConceded
              };
  
              // Update the player's data in the Firebase Realtime Database
              playerRef.update(updatedData, (error) => {
                if (error) {
                  // Handle the error, e.g., display an error message
                } else {
                  // Data updated successfully
                  setModalVisible(false);
                }
              });
            });
          }
        }
      });
    });
  }
  
  console.log("TEANSSSSSSSSS", teams)

  if(item.winningTeam){
    
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
    <Text style={{color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,}}>
      {item.winningStatement}
    </Text>
    <TouchableOpacity
      style={{    backgroundColor: '#ca3232',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#ca3232',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,}}
      activeOpacity={0.5}
      onPress={() => navigation.goBack()}>
      <Text style={{color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,}}>Go Back</Text>
    </TouchableOpacity>
  </View>
    )
  }


  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <Text style={styles.title}>Match Entry</Text>



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
      selectedValue={winningTeam}
      onValueChange={itemValue => setWinningTeam(itemValue)}
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
      <Select.Item label="Select Winner" value="" />
      <Select.Item label={teams[0]?.title} value={teams[0]?.title} />
      <Select.Item label={teams[1]?.title} value={teams[1]?.title} />
    </Select>
  </View>
</View>


<View style={{    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,}}>
<TextInput
        style={{    flex: 1,
            color: 'white',
            paddingLeft: 15,
            paddingRight: 15,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: '#dadae8',}}
        placeholder="Statement e.g. A Won by 10 Wickets"
        keyboardType="text"
        placeholderTextColor="#8b9cb5"
        underlineColorAndroid="#f000"
        value={winningStatement}
        onChangeText={(text) => setWinningStatement(text)}
      />
      </View>




      {teams.map((team, index) => (
        <View key={index} style={styles.teamContainer}>
          <Text style={styles.teamTitle}>{team.title}</Text>
          <FlatList
            data={team.players}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity  onPress={() => showPlayerDetailsModal(item, team)} style={styles.playerItem}>
                <Text style={styles.playerText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>)
      )}
     <Modal
  style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
  transparent
  visible={isModalVisible}
>
  <View
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      flex: 1,
      justifyContent: 'center',
    }}
  >
<View
  style={{
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  }}
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    }}
  >
    {selectedPlayer?.name} Details
  </Text>
  {/* Form fields for score, ballsPlayed, ballsDelivered, wickets, runsConceded */}

  <Text>Batting</Text>
   <TextInput
        style={styles.input}
        placeholder="Score"
        keyboardType="numeric"
        value={score}
        onChangeText={(text) => setScore(parseInt(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Balls Played"
        keyboardType="numeric"
        value={ballsPlayed}
        onChangeText={(text) => setBallsPlayed(parseInt(text))}
      />

<Text>Bowling</Text>
      <TextInput
        style={styles.input}
        placeholder="Balls Delivered"
        keyboardType="numeric"
        value={ballsDelivered}
        onChangeText={(text) => setBallsDelivered(parseInt(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Wickets"
        keyboardType="numeric"
        value={wickets}
        onChangeText={(text) => setWickets(parseInt(text))}
      />
      <TextInput
        style={styles.input}
        placeholder="Runs Conceded"
        keyboardType="numeric"
        value={runsConceded}
        onChangeText={(text) => setRunsConceded(parseInt(text))}
      />

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <TouchableOpacity
      style={{
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      }}
      onPress={() => {PlayerEntered(selectedPlayer)}}
    >
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
        }}
      >
        Okay
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      }}
      onPress={hidePlayerDetailsModal}
    >
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
        }}
      >
        Close
      </Text>
    </TouchableOpacity>
  </View>
</View>

  </View>
</Modal>


<TouchableOpacity
      style={{
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
      }}
      onPress={submitHandler}
    >
      <Text
        style={{
            color: '#FFFFFF',
            paddingVertical: 10,
            fontSize: 16,
        }}
      >
        Submit
      </Text>
    </TouchableOpacity>



    </ScrollView>
  );
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  teamContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  teamTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerItem: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#333',
    backgroundColor: '#333',
  },
  playerText: {
    color: 'white',
    fontSize: 16,
  },

};

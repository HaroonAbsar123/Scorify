import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView,Image,Alert } from 'react-native';
import database from '@react-native-firebase/database';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Select } from 'native-base';

export default function MatchesDetails({ route, navigation }) {
  const { item, tournamentCode } = route.params;
  const [teams, setTeams] = useState([]);


  const [hostTeam, setHostTeam] = useState("")
  const [visitorTeam, setVisitorTeam] = useState("")
  const [hostTeamPlayers, setHostTeamPlayers] = useState([])
  const [visitorTeamPlayers, setVisitorTeamPlayers] = useState([])
  const [totalOvers, setTotalOvers] = useState(0)
  const [tossWinner, setTossWinner] = useState("")
  const [optedChoice, setOptedChoice] = useState('');
  const [matchCode, setMatchCode] = useState('');
  const [tournamentName, setTournamentName] = useState("")
  const [matchType, setMatchType] = useState("")

  async function updateMatchCodeInfo(){
    const teamA=hostTeam;
const teamB=visitorTeam;

let matchesRef;

if(matchType==="Group"){
matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/matches`);
} else if(matchType==="Semi"){
  matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/semiMatches`);
  } else if(matchType==="Final"){
    matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/finalMatch`);
    }
  
const matchesSnapshot = await matchesRef.once('value');
matchesSnapshot.forEach((matchSnapshot) => {
const matchData = matchSnapshot.val();

if (matchData.teamA === teamA && matchData.teamB === teamB) {
// Found the match with the specified teams

let matchPath;

if(matchType==="Group"){
  matchPath = `/Scorify/tournament/${tournamentCode}/matches/${matchSnapshot.key}`;
} else if(matchType==="Semi"){
  matchPath = `/Scorify/tournament/${tournamentCode}/semiMatches/${matchSnapshot.key}`;
  } else if(matchType==="Final"){
    matchPath = `/Scorify/tournament/${tournamentCode}/finalMatch/${matchSnapshot.key}`;
    }


const updatedData = {
  matchCode: matchCode
  // Add other match data here if needed
};
// Update the specific match's data in the Firebase Realtime Database
const matchRef = database().ref(matchPath);
matchRef.update(updatedData);
}
});
  }




  async function submitHandler() {
    // Check if any of the fields are empty
    if (
      !visitorTeam ||
      !hostTeam ||
      !tossWinner ||
      !optedChoice ||
      !totalOvers ||
      !matchCode ||
      !tournamentName ||
      !matchType ||
      !tournamentCode ||
      hostTeamPlayers.length===0 ||
      visitorTeamPlayers.length===0
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
              hostTeamPlayers,
              visitorTeamPlayers,
              tossWinner,
              optedChoice,
              totalOvers,
              matchCode,
              tournamentName,
              matchType,
              tournamentCode
            };

           

            updateMatchCodeInfo()
  
            // Navigate to the next screen (CreateTeam) with the data as props
            navigation.navigate('TournamentScoreboard', { allTeamData: matchData });
          }
        })
        .catch((error) => {
          console.error('Error checking matchCode:', error);
        });
    }
  }
  
  

  useEffect(() => {
    // Fetch matches data from Firebase
    const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}`);
    matchesRef.on('value', (matchesSnapshot) => {
      const matchesData = matchesSnapshot.val();
      if (matchesData) {
        const matchesArray = Object.values(matchesData.teams);
        const { teamA, teamB } = item;
        
        setHostTeam(teamA)
        setVisitorTeam(teamB)
        setTotalOvers(matchesData.totalOvers)
        setTournamentName(matchesData.tournamentName)
        setMatchType(matchesData.matchType)

        const updatedTeams = matchesArray.filter((team) => team.title === teamA || team.title === teamB);
        setTeams(updatedTeams)

        const teamAPlayers = matchesArray.find((team) => team.title === teamA);
      if (teamAPlayers) {
        setHostTeamPlayers(teamAPlayers.players);
        console.log("TEAM AAAAAAAAAAA", teamAPlayers.players);
      }

      const teamBPlayers = matchesArray.find((team) => team.title === teamB);
      if (teamBPlayers) {
        setVisitorTeamPlayers(teamBPlayers.players);
        console.log("TEAM BBBBBBBBBBB", teamBPlayers.players);
      }
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

  








  return (
    <ScrollView contentContainerStyle={{
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
    }} style={{ flex: 1, backgroundColor: '#1e1e1e' }}>


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

      <Text style={styles.title}>MATCH CREATION</Text>



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
      <Select.Item label={teams[0]?.title} value={teams[0]?.title} />
      <Select.Item label={teams[1]?.title} value={teams[1]?.title} />
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
        placeholder="Match Code"
        onChangeText={text => setMatchCode(text)}
        style={styles.inputStyle}
        underlineColorAndroid="#f000"
        placeholderTextColor="#8b9cb5"
      />
</View>


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
  },title: {
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

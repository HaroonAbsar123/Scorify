import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import { ScrollView, useToast } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../Screens/Loader';

export default function GenerateMatches({route, navigation}) {
  const [tournamentName, setTournamentName] = useState([]);
  const [matches, setMatches] = useState([]);
  const {tournamentCode} = route.params;
  const [wins, setWins] = useState("")
  const [type, setType] = useState("Group")
  const [groupFinished, setGroupFinished] = useState(false)
  const [semiFinished, setSemiFinished] = useState(false)
  const [finalFinished, setFinalFinished] = useState(false)

  const [semiFinalMatches, setSemiFinalMatches] = useState([])
  const [finalMatch, setFinalMatch] = useState([])

  const [semiWins, setSemiWins] = useState("")
  const [finalWinner, setFinalWinner] = useState("")

  const toast=useToast()
  const [firstEffectExecuted, setFirstEffectExecuted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [playerStats, setPlayerStats] = useState([])

  
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const playerStatsPath = `/Scorify/tournament/${tournamentCode}/playerStats`;
  
      // Create a reference to the playerStats path in Firebase
      const playerStatsRef = database().ref(playerStatsPath);
  
      // Fetch the playerStats data from Firebase
      playerStatsRef.once('value')
        .then(snapshot => {
          const data = snapshot.val();
          if (data) {
            // Data exists, update the state with the fetched playerStats
            console.log("PLAYER STATSSSSSSSSSS", JSON.stringify(data));
  
            const teamStatsArray = [];
            for (const teamName in data) {
              const teamData = data[teamName];
              const players = [];
              for (const playerName in teamData) {
                const playerData = {
                  name: playerName,
                  ...teamData[playerName],
                };
                players.push(playerData);
              }
              teamStatsArray.push({
                team: teamName,
                players,
              });
            }
  
            setPlayerStats(teamStatsArray);
          } else {
            // Data doesn't exist, set an empty array
            setPlayerStats([]);
          }
        })
        .catch(error => {
          console.error('Error fetching playerStats:', error);
        })
        .finally(() => {
          setLoading(false);
        });
  
      // Make sure to unsubscribe when the component unmounts
      return () => playerStatsRef.off('value');
    }, [tournamentCode]) // Add dependencies as needed
  );
  


  useEffect(() => {
    setLoading(true)
    const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}`);
    matchesRef.on('value', matchesSnapshot => {
      const matchesData = matchesSnapshot.val();
      if (matchesData) {
        const matchesArray = Object.values(matchesData.matches);
        setMatches(matchesArray);
        setTournamentName(matchesData.tournamentName);

        if (type==="Semi"){
          if(matchesData.semiMatches){
          const semiMatchesArray = Object.values(matchesData.semiMatches);
          if(semiMatchesArray.length){
          setSemiFinalMatches(semiMatchesArray)
        }
      }
        } else if (type==="Final"){
          if(matchesData.finalMatch){
          const finalMatch = Object.values(matchesData.finalMatch);
          if(finalMatch.length){
          setFinalMatch(finalMatch)
        }


          const semiMatchesArray = Object.values(matchesData.semiMatches);
          if(semiMatchesArray.length){
            setSemiFinalMatches(semiMatchesArray)
          }
        }
      }
      }
      setFirstEffectExecuted(true);
      
      setLoading(false)
      checkingWinsRefs()
      return () => {
        matchesRef.off('value');
      };
    });
  }, [type])


  function checkingWinsRefs(){
      // Fetch matches data from Firebase
      const winsRef = database().ref(`/Scorify/tournament/${tournamentCode}/wins`);
    
      // Read and listen for changes to the wins value in real-time
      winsRef.on('value', (winsSnapshot) => {
        const currentWins = winsSnapshot.val() || ""; // Default to 0 if there's no value
        setWins(currentWins);
      });
  
      const semiWinsRef = database().ref(`/Scorify/tournament/${tournamentCode}/semiWins`);
    
      // Read and listen for changes to the wins value in real-time
      semiWinsRef.on('value', (winsSnapshot) => {
        const currentWins = winsSnapshot.val() || ""; // Default to 0 if there's no value
        setSemiWins(currentWins);
      });
  
  
      const finalWinsRef = database().ref(`/Scorify/tournament/${tournamentCode}/finalWinner`);
    
      // Read and listen for changes to the wins value in real-time
      finalWinsRef.on('value', (winsSnapshot) => {
        const currentWins = winsSnapshot.val() || ""; // Default to 0 if there's no value
        setFinalWinner(currentWins);
      });
  
    
      const typeRef = database().ref(`/Scorify/tournament/${tournamentCode}/matchType`);
    
      // Read and listen for changes to the type value in real-time
      typeRef.on('value', (typeSnapshot) => {
        const currentType = typeSnapshot.val() || ""; // Default to an empty string if there's no value
        setType(currentType);
      });
      setLoading(false)
    
      // Cleanup listeners when component unmounts
      return () => {
        winsRef.off('value');
        typeRef.off('value');
        semiWinsRef.off('value');
        finalWinsRef.off('value');
      };




  }
  



useEffect(() => {


  if(type==="Group"){
    if (wins===matches.length){
      setGroupFinished(true)
      // generateMatches of 
    } else {}
  } 
  
  else if (type==="Semi"){
    if (semiWins===semiFinalMatches.length){
      setSemiFinished(true)
    } else {}
  } else if (type==="Final"){
    if (finalWinner !== ""){
      
      setFinalFinished(true)
    } else {}
  }

}, [type, wins, matches, semiFinalMatches, finalWinner])

useEffect(() => {
  const groupMatchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/matches`);
  groupMatchesRef.once('value', (groupMatchesSnapshot) => {
    const groupMatchesData = groupMatchesSnapshot.val();
  const groupMatches = Object.values(groupMatchesData);


      // Create an object to store team wins
      const teamWins = {};

  // Iterate through groupMatches to count team wins
  groupMatches.forEach((match) => {
    const { winningTeam } = match;

    // Exclude "None" from team wins
    if (winningTeam !== "None") {
      if (!teamWins[winningTeam]) {
        teamWins[winningTeam] = 1;
      } else {
        teamWins[winningTeam]++;
      }
    }
  });

  console.log("GROUP MATCHES DATA", groupMatches);

  // Sort teams by wins in descending order
  const sortedTeams = Object.keys(teamWins).sort(
    (teamA, teamB) => teamWins[teamB] - teamWins[teamA]
  );

      // Select the top 4 teams
      const top4Teams = sortedTeams.slice(0, 4);


      console.log("TOP 4 TEAMS", top4Teams)

  })
}, [])

  useFocusEffect(
    React.useCallback(() => {
    if (groupFinished) {
      // Update wins on /Scorify/tournament/${tournamentCode}/wins to 0

      // UPDATE WINS
      // const winsRef = database().ref(`/Scorify/tournament/${tournamentCode}/wins`);
      // winsRef.set(0, (error) => {
      //   if (error) {
      //     console.error("Error updating wins:", error);
      //   } else {
      //   }
      // });
    
      // Update type

    


      // CREATE NEW MATCHES
      const groupMatchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/matches`);
  groupMatchesRef.once('value', (groupMatchesSnapshot) => {
    const groupMatchesData = groupMatchesSnapshot.val();
    
    if (groupMatchesData) {


      const groupMatches = Object.values(groupMatchesData);
      // Create an object to store team wins
      const teamWins = {};

  // Iterate through groupMatches to count team wins
  groupMatches.forEach((match) => {
    const { winningTeam } = match;

    // Exclude "None" from team wins
    if (winningTeam !== "None") {
      if (!teamWins[winningTeam]) {
        teamWins[winningTeam] = 1;
      } else {
        teamWins[winningTeam]++;
      }
    }
  });

  console.log("GROUP MATCHES DATA", groupMatches);

  // Sort teams by wins in descending order
  const sortedTeams = Object.keys(teamWins).sort(
    (teamA, teamB) => teamWins[teamB] - teamWins[teamA]
  );

      // Select the top 4 teams
      const top4Teams = sortedTeams.slice(0, 4);

      const newMatchesArray = [
        { teamA: top4Teams[0], teamB: top4Teams[3] },
        { teamA: top4Teams[1], teamB: top4Teams[2] },
      ];

      const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/semiMatches`);

      matchesRef.once('value', (matchesSnapshot) => {
        const existingData = matchesSnapshot.val();
      
        if (existingData === null) {
          // Data doesn't exist, so you can set it
          matchesRef.set(newMatchesArray, (error) => {
            if (error) {
              console.error("Error updating matches:", error);
            } else {
              const typeRef = database().ref(`/Scorify/tournament/${tournamentCode}/matchType`);
              typeRef.set("Semi", (error) => {
                if (error) {
                  console.error("Error updating type to Semi:", error);
                } else {
                }
              });
            }
          });
        } else {
          // Data already exists, do nothing or handle as needed
        }
      });
      
              // Now you have the newMatches array with the matches between the top 4 teams
    
              // You can proceed to update the /Scorify/tournament/${tournamentCode}/matches with the new matches
            }
          


    
          // ADD LOGIC TO SELECT TOP 4 TEAMS FROM GROUP MATCHES...
          // MATCHES CAN BE FOUND IN /Scorify/tournament/${tournamentCode}/matches
          // for each match, check winningTeam and match it to teams present in /Scorify/tournament/${tournamentCode}/teams
          // generate new matches and update on /Scorify/tournament/${tournamentCode}/matches ...
          // 1st should have a match with the fourth and the second should have a match with the third
      
      
    });
    }
    
  
    if (semiFinished) {



 // CREATE FINAL MATCH
 const groupMatchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/semiMatches`);
 groupMatchesRef.once('value', (groupMatchesSnapshot) => {
   const groupMatchesData = groupMatchesSnapshot.val();
   
   if (groupMatchesData) {
     const groupMatches = Object.values(groupMatchesData);

     // Create an object to store team wins
     const teamWins = {};

  // Iterate through groupMatches to count team wins
  groupMatches.forEach((match) => {
    const { winningTeam } = match;

    // Exclude "None" from team wins
    if (winningTeam !== "None") {
      if (!teamWins[winningTeam]) {
        teamWins[winningTeam] = 1;
      } else {
        teamWins[winningTeam]++;
      }
    }
  });


  // Sort teams by wins in descending order
  const sortedTeams = Object.keys(teamWins).sort(
    (teamA, teamB) => teamWins[teamB] - teamWins[teamA]
  );

     // Select the top 4 teams

     const newMatchesArray = [
       { teamA: sortedTeams[0], teamB: sortedTeams[1] }
     ];
     const matchesRef = database().ref(`/Scorify/tournament/${tournamentCode}/finalMatch`);

     matchesRef.once('value', (matchesSnapshot) => {
       const existingData = matchesSnapshot.val();
     
       if (existingData === null) {
         // Data doesn't exist, so you can set it
         matchesRef.set(newMatchesArray, (error) => {
           if (error) {
             console.error("Error updating matches:", error);
           } else {
             const typeRef = database().ref(`/Scorify/tournament/${tournamentCode}/matchType`);
             typeRef.set("Final", (error) => {
               if (error) {
               } else {
               }
             });
           }
         });
       } else {
         // Data already exists, do nothing or handle as needed
       }
     });
           }
   });
      
      
      // Update wins on /Scorify/tournament/${tournamentCode}/wins to 0
      // const winsRef = database().ref(`/Scorify/tournament/${tournamentCode}/wins`);
      // winsRef.set(0, (error) => {
      //   if (error) {
      //     console.error("Error updating wins:", error);
      //   } else {
      //   }
      // });
  
      // Update type on /Scorify/tournament/${tournamentCode}/type to Final
      // const typeRef = database().ref(`/Scorify/tournament/${tournamentCode}/matchType`);
      // typeRef.set("Final", (error) => {
      //   if (error) {
      //     console.error("Error updating type to Final:", error);
      //   } else {
      //   }
      // });
  
      // ADD LOGIC TO SELECT TWO WINNING TEAMS FROM GROUP MATCHES...
      // MATCHES CAN BE FOUND IN /Scorify/tournament/${tournamentCode}/matches
      // for each match check winningTeam and match it to teams present in /Scorify/tournament/${tournamentCode}/teams
      // generate the final match and update on /Scorify/tournament/${tournamentCode}/matches ...
    }
  
    if (finalFinished) {
      // Create a variable named tournamentWinner /Scorify/tournament/${tournamentCode} and add the winningTeam in that
      // const tournamentWinnerRef = database().ref(`/Scorify/tournament/${tournamentCode}/tournamentWinner`);
      // tournamentWinnerRef.set(winningTeam, (error) => {
      //   if (error) {
      //     console.error("Error updating tournament winner:", error);
      //   } else {
      //   }
      // });
    }
  }, [groupFinished, semiFinished, finalFinished])
);

const [screen, setScreen] = useState("Matches")


  return (
    <View style={{flex: 1, backgroundColor: '#1e1e1e'}}>
      <Loader loading={loading} />
      <View style={{backgroundColor: '#ca3232', borderRadius: 10, margin: 10, marginTop: 20 }}>
      <Text style={{...styles.title, color: 'white'}}>{tournamentName}</Text>
      </View>

      {finalWinner !== "" && 
      <View style={{backgroundColor: 'yellow', borderRadius: 10, margin: 10 }}>
      <Text style={{...styles.title, fontSize: 20, textAlign: 'center', color: 'black'}}>Winner: {finalWinner}</Text>
      </View>
      }

{playerStats?.length !== 0 && 
<View style={{flexDirection: 'row' }}>

<TouchableOpacity
          onPress={() => {setScreen("Matches")}}
            style={{    margin: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: 'white',
              backgroundColor: 'white',
            flex: 1}}
              >
            <Text style={{...styles.matchText, fontSize: 15, textAlign: 'center', width: '100%'}}>MATCHES</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => {setScreen("PlayerStats")}}
            style={{    margin: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: 'white',
              backgroundColor: 'white',
              flex: 1}}
              >
            <Text style={{...styles.matchText, fontSize: 15, textAlign: 'center', width: '100%'}}>PLAYER STATS</Text>
          </TouchableOpacity>

      </View>
      }
     
{screen === "Matches" ? 
      <ScrollView>
        <View style={{margin: 10, backgroundColor: '#3b3b3b', flex: 1, borderRadius: 10}}>
      {type==="Group" &&
      <>
      <Text style={styles.title}>Group Stages</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      </>
      }
      {type==="Semi" &&

      <>
      <Text style={styles.title}>Semi Finals</Text>
      <FlatList
        data={semiFinalMatches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      
      
      <Text style={styles.title}>Group Stages</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      </>}
      {type==="Final" &&
      <>
      <Text style={styles.title}>Final</Text>
      <FlatList
        data={finalMatch}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      
      <Text style={styles.title}>Semi Finals</Text>
      <FlatList
        data={semiFinalMatches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      
      
      <Text style={styles.title}>Group Stages</Text>
      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
          onPress={() => {
            if(!item?.matchFinished){
              if(item?.matchCode){
                navigation.navigate('EditTournamentMatch', {matchCode: item?.matchCode});
              } else {
            navigation.navigate('MatchesDetails', {item, tournamentCode});
          }
          } else {
            toast.show({
              title: 'Match Finished',
              duration: 2000, // 2000 milliseconds (2 seconds)
            });
        }
          }}
            style={{    margin: 10,
              justifyContent: 'space-between',
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#white',
              backgroundColor: item?.winningTeam ? "lightgreen":'white'}}>
                <View style={{
              flexDirection: 'row',}}>
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item.teamA} vs {item.teamB}
            </Text>
            
            </View>
            {(!item?.matchFinished && item?.matchCode) && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
            Code: {item?.matchCode}
          </Text>
            }
            {item?.matchFinished && 
            <Text style={{...styles.matchText, textAlign: 'center', width: '100%'}}>
              {item?.winningStatement}
            </Text>
            }
          </TouchableOpacity>
        )}
      />
      </>
      }
      </View>
      </ScrollView>
      



      :


<ScrollView>
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'white', textAlign: 'center' }}>PLAYER STATISTICS</Text>
        {playerStats.length >0 && 
        <FlatList
          data={playerStats}
          keyExtractor={(item) => item.team}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
              <View style={{ backgroundColor: '#ca3232',  padding: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>{item.team}</Text>
              </View>
              {item?.players?.map((player) => (
                <View key={player.name} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                  <View style={{ marginBottom: 5,backgroundColor: '#1e1e1e', borderRadius: 10, padding: 5 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>{player.name}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ marginRight: 10, paddingRight: 10, borderRightColor: '#ccc', borderRightWidth: 1 }}>
  <Text style={{ fontWeight: 'bold' }}>Batting</Text>
  <Text>Score: {player?.bat?.score || 0}</Text>
  <Text>Balls: {player?.bat?.balls || 0}</Text>
</View>
<View>
  <Text style={{ fontWeight: 'bold' }}>Bowling</Text>
  <Text>Wickets: {player?.bowl?.wickets || 0}</Text>
  <Text>Score: {player?.bowl?.score || 0}</Text>
  <Text>Balls: {player?.bowl?.balls || 0}</Text>
</View>

    </View>
    
                </View>
   ) )}
            </View>
          )}
        />
      }
      </View>
    </ScrollView>
    }
    </View>
  );
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  matchItem: {

  },
  matchText: {
    color: '#333',
    fontSize: 16,
  },
};

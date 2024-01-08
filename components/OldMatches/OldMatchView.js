import {faTruckFieldUn} from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, Image} from 'react-native';
import database from '@react-native-firebase/database';
import Loader from '../Screens/Loader';

export default function OldMatchView({navigation, route}) {
  const [propsData, setPropsData] = useState(null);
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [currentBowler, setCurrentBowler] = useState('');
  const [currentStriker, setCurrentStriker] = useState('');
  const [currentNonStriker, setCurrentNonStriker] = useState('');
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [inning, setInning] = useState(1);
  const [battingTeamPlayers, setBattingTeamPlayers] = useState([]);
  const [bowlingTeamPlayers, setBowlingTeamPlayers] = useState([]);
  const [matchFinished, setMatchFinished] = useState(false);
  const [winningTeam, setWinningTeam] = useState('');
  const [target, setTarget] = useState(0);
  const [winningStatement, setWinningStatement] = useState("")
  const [matchCode, setMatchCode] = useState(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route && route.params) {
      const { matchCode } = route.params;
      setMatchCode(matchCode);

      // Show the loader while fetching data
      setLoading(true);

      // Fetch data from the database using the matchCode
      database()
        .ref(`/Scorify/${matchCode}`)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Update the state with the fetched data
            setPropsData(data);
            setScore(data.score);
            setWickets(data.wickets);
            setOvers(data.overs);
            setBalls(data.balls);
            setCurrentBowler(data.currentBowler);
            setCurrentStriker(data.currentStriker);
            setCurrentNonStriker(data.currentNonStriker);
            setBattingTeam(data.battingTeam);
            setBowlingTeam(data.bowlingTeam);
            setInning(data.inning);
            setBattingTeamPlayers(data.battingTeamPlayers);
            setBowlingTeamPlayers(data.bowlingTeamPlayers);
            setMatchFinished(data.matchFinished);
            setWinningTeam(data.winningTeam);
            setTarget(data.target);
            setWinningStatement(data.winningStatement);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          // Hide the loader when data fetching is complete
          setLoading(false);
        });
    }
  }, [route]);

  if (loading) {
    return (
      <View
      style={{
        flex: 1,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
      }}>
      <Loader loading={loading} />
      </View>
    );
  }


  if (matchFinished) {
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
                {propsData?.tournamentName && 
        <Text style={styles.successTextStyle}>
          {propsData?.tournamentName}

          {propsData?.matchType==="Group" && <Text style={styles.successTextStyle}> (Group Match)</Text>}
          {propsData?.matchType==="Semi" && <Text style={styles.successTextStyle}> (Semi Final)</Text>}
          {propsData?.matchType==="Final" && <Text style={styles.successTextStyle}> (Final)</Text>}
        </Text>
        }
        
        <Text style={styles.successTextStyle}>
          {winningStatement}
        </Text>

        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonTextStyle}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#1e1e1e'}}>
      <View style={{flex: 1.5, padding: 10}}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Match Code: {matchCode}</Text>
        </View>

        <View
          style={{
            margin: 5,
            padding: 5,
            // backgroundColor: 'rgba(255, 203, 203, 0.849)',
            borderRadius: 10,
            borderColor: 'rgba(121, 0, 0, 0.849)',
            borderWidth: 2,
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {inning === 1 && (
            <Text
            style={styles.scoreText}>
              1st Inning
            </Text>
          )}
          {target !== 0 && (
            <Text
            style={styles.scoreText}>
              {battingTeam} needs {target} runs to win
            </Text>
          )}

          <Text style={styles.scoreText}>
          {battingTeam} 🏏: {score}/{wickets}
        </Text>
        <Text style={styles.scoreText}>
          {bowlingTeam} ⚾ : {overs}.{balls}
        </Text>


       <Text style={styles.scoreText}>Striker: {currentStriker.name} 
       {currentStriker && (
  <Text>
    {battingTeamPlayers.map(player => {
      if (player.name === currentStriker.name && player.bat) {
        return ` | ${player.bat.score}/${player.bat.balls} Balls`;
      }
      return '';
    })}
  </Text>
)}

       </Text>
        
        
        
        
        <Text style={styles.scoreText}>Non-Striker: {currentNonStriker.name}
        
        {currentNonStriker && (
  <Text>
    {battingTeamPlayers.map(player => {
      if (player.name === currentNonStriker.name && player.bat) {
        return ` | ${player.bat.score}/${player.bat.balls} Balls`;
      }
      return '';
    })}
  </Text>
)}
        </Text>



        <Text  style={styles.scoreText}>

  Bowler: {currentBowler.name} {currentBowler?.bowl && `| ${currentBowler?.bowl?.score}/${currentBowler?.bowl?.wickets} | ${ballsToOvers(currentBowler?.bowl?.balls)}`

}
</Text>
          {/* <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Batting Team: {battingTeam}</Text>
        <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Bowling Team: {bowlingTeam}</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreText: {
    width: '90%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10
  },
  heading: {
    margin: 5,
    padding: 5,
    backgroundColor: '#ca3232',
    height: 50,
    borderRadius: 10,
    borderColor: '#ca3232',
    borderWidth: 2,
  },
  headingText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
  },
  button: {
    margin: 5,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    width: '100%',
  },
  buttonOut: {
    margin: 5,
    padding: 5,
    backgroundColor: '#ca3232',
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderColor: '#ca3232',
    borderWidth: 2,
  },
  buttonTextOut: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: '#ca3232',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#ca3232',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
});

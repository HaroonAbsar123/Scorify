import {faTruckFieldUn} from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Button, TouchableOpacity, StyleSheet, Image, Modal, FlatList} from 'react-native';
import database from '@react-native-firebase/database';

export default function Scoreboard({navigation, route}) {
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

  const [initialModalVisible, setInitialModalVisible] = useState(false)
  const [additionalScoreModal, setAdditionalScoreModal] = useState(false);
  const [additionalScore, setAdditionalScore] = useState(0);
  const [textInputValue, setTextInputValue] = useState('');

  const addItem = (item, matchCode) => {
    database().ref(`/Scorify/${matchCode}`).set(item);
  };

  useEffect(() => {
    // Check if the currentBowler is not already set and the bowlingTeamPlayers array is not empty
    if (currentBowler && bowlingTeamPlayers.length > 0) {
      const foundBowler = bowlingTeamPlayers.find(player => player.name === currentBowler.name);
      console.log("foundBowler", foundBowler)
      if (foundBowler) {
        // Update the currentBowler state with the found bowler object
        setCurrentBowler(foundBowler);
      }
    }
  }, [bowlingTeamPlayers, currentBowler]);


  


  useEffect(() => {


    const dataToPost = {
      ...propsData,
      score,
      wickets,
      overs,
      balls,
      currentBowler,
      currentStriker,
      currentNonStriker,
      battingTeam,
      bowlingTeam,
      inning,
      battingTeamPlayers,
      bowlingTeamPlayers,
      matchFinished,
      winningTeam,
      target,
      winningStatement,
    };
    addItem(dataToPost, propsData?.matchCode);
  }, [
    propsData,
    score,
    wickets,
    overs,
    balls,
    currentBowler,
    currentStriker,
    currentNonStriker,
    battingTeam,
    bowlingTeam,
    inning,
    battingTeamPlayers,
    bowlingTeamPlayers,
    matchFinished,
    winningTeam,
    target,
    winningStatement
  ]);

  useEffect(() => {
    if (route && route.params) {
      const {allTeamData} = route.params;
      console.log("ALL TEAM DATA", allTeamData)
      setPropsData(allTeamData);

      // Determine the batting and bowling teams based on the toss result
      if (allTeamData.tossWinner === allTeamData.hostTeam) {
        if (allTeamData.optedChoice === 'bat') {
          setBattingTeamPlayers(allTeamData?.hostTeamPlayers);
          setBowlingTeamPlayers(allTeamData?.visitorTeamPlayers);
          setBattingTeam(allTeamData.hostTeam);
          setBowlingTeam(allTeamData.visitorTeam);
          // setCurrentBowler(
          //   allTeamData.visitorTeamPlayers[
          //     allTeamData.visitorTeamPlayers.length - 1
          //   ],
          // );
          setInitialModalVisible(true)
          setCurrentStriker(allTeamData.hostTeamPlayers[0]);
          setCurrentNonStriker(allTeamData.hostTeamPlayers[1]);
        } else {
          setBattingTeam(allTeamData.visitorTeam);
          setBowlingTeam(allTeamData.hostTeam);
          // setCurrentBowler(
          //   allTeamData.hostTeamPlayers[allTeamData.hostTeamPlayers.length - 1],
          // );
          setInitialModalVisible(true)
          setCurrentStriker(allTeamData.visitorTeamPlayers[0]);
          setCurrentNonStriker(allTeamData.visitorTeamPlayers[1]);
          setBattingTeamPlayers(allTeamData?.visitorTeamPlayers);
          setBowlingTeamPlayers(allTeamData?.hostTeamPlayers);
        }
      } else {
        if (allTeamData.optedChoice === 'bat') {
          setBattingTeam(allTeamData.visitorTeam);
          setBattingTeamPlayers(allTeamData?.visitorTeamPlayers);
          setBowlingTeamPlayers(allTeamData?.hostTeamPlayers);
          setBowlingTeam(allTeamData.hostTeam);
          // setCurrentBowler(
          //   allTeamData.hostTeamPlayers[allTeamData.hostTeamPlayers.length - 1],
          // );
          setInitialModalVisible(true)
          setCurrentStriker(allTeamData.visitorTeamPlayers[0]);
          setCurrentNonStriker(allTeamData.visitorTeamPlayers[1]);
        } else {
          setBattingTeam(allTeamData.hostTeam);
          setBowlingTeam(allTeamData.visitorTeam);
          // setCurrentBowler(
          //   allTeamData.visitorTeamPlayers[
          //     allTeamData.visitorTeamPlayers.length - 1
          //   ],
          // );
          setInitialModalVisible(true)
          setCurrentStriker(allTeamData.hostTeamPlayers[0]);
          setCurrentNonStriker(allTeamData.hostTeamPlayers[1]);
          setBattingTeamPlayers(allTeamData?.hostTeamPlayers);
          setBowlingTeamPlayers(allTeamData?.visitorTeamPlayers);
        }
      }
    }
  }, [route]);

  const [isModalVisible, setModalVisible] = useState(false);

  const handleBallEvent = event => {
    // Implement ball-by-ball logic here
    // Update score, wickets, overs, balls, player statistics, etc.

    console.log('Ball Event:', event);

    // Example: Update wicket and reset the striker
    if (event === 'out') {
      setWickets(wickets + 1);
      setCurrentStriker(battingTeamPlayers[wickets + 2]); // Switch striker

       const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      console.log(bowlerIndex)
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        
    
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 1, score: 0 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
          updatedBowlingTeam[bowlerIndex].bowl.wickets += 1;
        }
        
        setBowlingTeamPlayers(updatedBowlingTeam);
        
      }
      console.log(battingTeamPlayers.length, "--------", wickets+1)
      // Check if all wickets have fallen for the batting team
      const isAllOut = wickets+1 === battingTeamPlayers.length - 1;

      

      if (isAllOut) {
        if (inning === 1) {
          setInning(2);
          setTarget(score);
        } else if (inning === 2) {


          if (score===target-1){
            console.log("DRAWWWWWWWWWWWWWWWWWWWWWWWW")
            setMatchFinished(true)
            setWinningStatement("Match Draw")
            setWinningTeam("None")
            console.log("MATCH DRAT")
          } else {
            
          setMatchFinished(true);
          setWinningTeam(bowlingTeam);
          setWinningStatement(`${bowlingTeam} won by ${target-score-1} runs`)
          }
        }
        // Switch roles between batting and bowling teams
        setBattingTeam(bowlingTeam);
        setBowlingTeam(battingTeam);

        // Set the new batting and non-striker for the new innings
        setModalVisible(true)
        // setCurrentBowler(battingTeamPlayers[battingTeamPlayers.length - 1]);
        setCurrentStriker(bowlingTeamPlayers[0]);
        setCurrentNonStriker(bowlingTeamPlayers[1]);

        const changedBowlingTeam = updatedBowlingTeam;
        setBowlingTeamPlayers(battingTeamPlayers);
        setBattingTeamPlayers(changedBowlingTeam);

        // Reset wickets, overs, and balls for the new batting team
        setWickets(0);
        setOvers(0);
        setBalls(0);
        setScore(0);
      }
    }

    // Example: Update score for a wide
    if (event === 'wide') {

      setAdditionalScoreModal(true)

      


    }

    if (event === 'single') {
      if (inning === 2) {
        if (score + 1 > target) {
          setWinningTeam(battingTeam);
          setMatchFinished(true);
          setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
        }
      }


      const batterIndex = battingTeamPlayers.findIndex(player => player.name === currentStriker.name);
      const updatedBattingTeam = JSON.parse(JSON.stringify(battingTeamPlayers));
      if (batterIndex !== -1) {
        if (!updatedBattingTeam[batterIndex].bat) {
          updatedBattingTeam[batterIndex].bat = { balls: 1, score: 1 };
        } else {
          updatedBattingTeam[batterIndex].bat.score += 1;
          updatedBattingTeam[batterIndex].bat.balls += 1;
        }
        setBattingTeamPlayers(updatedBattingTeam);

        
      const striker=currentStriker;
      setCurrentStriker(currentNonStriker);
      setCurrentNonStriker(striker)
      }
      


      const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 0, score: 1 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.score += 1;
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
        }
        setBowlingTeamPlayers(updatedBowlingTeam);
      }


      

      setScore(score + 1);
      setBalls(balls + 1);

    }

    if (event === 'double') {
      if (inning === 2) {
        if (score + 2 > target) {
          setWinningTeam(battingTeam);
          setMatchFinished(true);
          setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
        }
      }
      setScore(score + 2);
      setBalls(balls + 1);


      const batterIndex = battingTeamPlayers.findIndex(player => player.name === currentStriker.name);
      const updatedBattingTeam = JSON.parse(JSON.stringify(battingTeamPlayers));
      if (batterIndex !== -1) {
        if (!updatedBattingTeam[batterIndex].bat) {
          updatedBattingTeam[batterIndex].bat = { balls: 1, score: 2 };
        } else {
          updatedBattingTeam[batterIndex].bat.score += 2;
          updatedBattingTeam[batterIndex].bat.balls += 1;
        }
        setBattingTeamPlayers(updatedBattingTeam);

      }


      const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 0, score: 2 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.score += 2;
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
        }
        setBowlingTeamPlayers(updatedBowlingTeam);
      }


    }

    // Example: Update score for a no-ball
    if (event === 'no-ball') {

      setAdditionalScoreModal(true)
      
      // if (inning === 2) {
      //   if (score + 1 > target) {
      //     setWinningTeam(battingTeam);
      //     setMatchFinished(true);
      //     setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
      //   }
      // }
      // setScore(score + 1);


      // const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      // const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      // if (bowlerIndex !== -1) {
      //   // Deep copy of the bowlingTeamPlayers array
      //   if (!updatedBowlingTeam[bowlerIndex].bowl) {
      //     updatedBowlingTeam[bowlerIndex].bowl = { balls: 0, wickets: 0, score: 1 };
      //   } else {
      //     updatedBowlingTeam[bowlerIndex].bowl.score += 1;
      //   }
      //   setBowlingTeamPlayers(updatedBowlingTeam);
      // }
    }

    // Example: Update score for a boundary
    if (event === 'boundary') {
      if (inning === 2) {
        if (score + 4 > target) {
          setWinningTeam(battingTeam);
          setMatchFinished(true);
          setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
        }
      }
      setScore(score + 4);
      setBalls(balls + 1);

      const batterIndex = battingTeamPlayers.findIndex(player => player.name === currentStriker.name);
      const updatedBattingTeam = JSON.parse(JSON.stringify(battingTeamPlayers));
      if (batterIndex !== -1) {
        if (!updatedBattingTeam[batterIndex].bat) {
          updatedBattingTeam[batterIndex].bat = { balls: 1, score: 4 };
        } else {
          updatedBattingTeam[batterIndex].bat.score += 4;
          updatedBattingTeam[batterIndex].bat.balls += 1;
        }
        setBattingTeamPlayers(updatedBattingTeam);

      }

      const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 0, score: 4 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
          updatedBowlingTeam[bowlerIndex].bowl.score += 4;
        }
        setBowlingTeamPlayers(updatedBowlingTeam);
      }
    }

    if (event === 'six') {
      if (inning === 2) {
        if (score + 6 > target) {
          setWinningTeam(battingTeam);
          setMatchFinished(true);
          setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
        }
      }
      setScore(score + 6);
      setBalls(balls + 1);



      const batterIndex = battingTeamPlayers.findIndex(player => player.name === currentStriker.name);
      const updatedBattingTeam = JSON.parse(JSON.stringify(battingTeamPlayers));
      if (batterIndex !== -1) {
        if (!updatedBattingTeam[batterIndex].bat) {
          updatedBattingTeam[batterIndex].bat = { balls: 1, score: 6 };
        } else {
          updatedBattingTeam[batterIndex].bat.score += 6;
          updatedBattingTeam[batterIndex].bat.balls += 1;
        }
        setBattingTeamPlayers(updatedBattingTeam);

      }



      const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 0, score: 6 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
          updatedBowlingTeam[bowlerIndex].bowl.score += 6;
        }
        setBowlingTeamPlayers(updatedBowlingTeam);
      }
    }


    if (event === 'dot') {
      setBalls(balls + 1);



      const batterIndex = battingTeamPlayers.findIndex(player => player.name === currentStriker.name);
      const updatedBattingTeam = JSON.parse(JSON.stringify(battingTeamPlayers));
      if (batterIndex !== -1) {
        if (!updatedBattingTeam[batterIndex].bat) {
          updatedBattingTeam[batterIndex].bat = { balls: 1, score: 0 };
        } else {
          updatedBattingTeam[batterIndex].bat.balls += 1;
        }
        setBattingTeamPlayers(updatedBattingTeam);

      }


      const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
      const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
      if (bowlerIndex !== -1) {
        // Deep copy of the bowlingTeamPlayers array
        if (!updatedBowlingTeam[bowlerIndex].bowl) {
          updatedBowlingTeam[bowlerIndex].bowl = { balls: 1, wickets: 0, score: 0 };
        } else {
          updatedBowlingTeam[bowlerIndex].bowl.balls += 1;
        }
        setBowlingTeamPlayers(updatedBowlingTeam);
      }
    }

    // Update overs and balls
    if (balls === 5) {
      setOvers(overs + 1);
      setBalls(0);

        console.log("totalOvers",  propsData.totalOvers)
        const total = parseInt(propsData.totalOvers)
      // Check if the over limit has been reached
      if (overs + 1 >= total) {
        if (inning === 1) {
          setInning(2);
          if(event==='single'){
            setTarget(score+2);
          } else if(event==='double'){
            setTarget(score+3);
          } else if(event==='boundary'){
            setTarget(score+5);
          } else if(event==='six'){
            setTarget(score+7);
          } else {
          setTarget(score+1);
        }
          console.log("Target", score)
        } else if (inning === 2) {
          if (score===target-2){
            console.log("DRAWWWWWWWWWWWWWWWWWWWWWWWW")
            setMatchFinished(true)
            setWinningStatement("Match Draw")
            setWinningTeam("None")
            console.log("MATCH DRAT")
          } else {
            
          setMatchFinished(true);
          setWinningTeam(bowlingTeam);
          setWinningStatement(`${bowlingTeam} won by ${target-score-1} runs`)
        }
        return;
        }
        // Switch roles between batting and bowling teams
        const currentBattingTeam=battingTeam;
        setBattingTeam(bowlingTeam);
        setBowlingTeam(currentBattingTeam);

        // Set the new batting and non-striker for the new innings
        setModalVisible(true)
        // setCurrentBowler(battingTeamPlayers[battingTeamPlayers.length - 1]);
        setCurrentStriker(bowlingTeamPlayers[0]);
        setCurrentNonStriker(bowlingTeamPlayers[1]);

        const changedBowlingTeam = bowlingTeamPlayers;
        setBowlingTeamPlayers(battingTeamPlayers);
        setBattingTeamPlayers(changedBowlingTeam);

        // Reset wickets, overs, and balls for the new batting team
        setWickets(0);
        setOvers(0);
        setBalls(0);
        setScore(0);

        console.log("OVERS FINISHED", )
      } else {
        // Calculate the index of the next bowler
        setModalVisible(true);

        // let nextBowlerIndex = bowlingTeamPlayers.indexOf(currentBowler) + 1;
        // const striker=currentStriker;

        // setCurrentStriker(currentNonStriker);
        // setCurrentNonStriker(striker)

        // // Check if the next bowler's index exceeds the number of bowlers in the team
        // if (nextBowlerIndex >= bowlingTeamPlayers.length) {
        //   nextBowlerIndex = 0; // Wrap around to the first bowler
        // }

        // // Set the current bowler to the next bowler in the order
        // setCurrentBowler(bowlingTeamPlayers[nextBowlerIndex]);
      }
    }
  };

  
  const handleOkayButtonPress = () => {
    // setAdditionalScore(parseInt(textInputValue));
    const additionalScore=parseInt(textInputValue)

    if (inning === 2) {
      if (additionalScore + 1 > target) {
        setWinningTeam(battingTeam);
        setMatchFinished(true);
        setWinningStatement(`${battingTeam} won by ${battingTeamPlayers.length - wickets-1} wickets`)
      }
    }
    setScore(score + additionalScore);



    const bowlerIndex = bowlingTeamPlayers.findIndex(player => player.name === currentBowler.name);
    const updatedBowlingTeam = JSON.parse(JSON.stringify(bowlingTeamPlayers));
    console.log(bowlerIndex)
    if (bowlerIndex !== -1) {
      // Deep copy of the bowlingTeamPlayers array
      if (!updatedBowlingTeam[bowlerIndex].bowl) {
        updatedBowlingTeam[bowlerIndex].bowl = { balls: 0, wickets: 0, score: additionalScore };
      } else {
        updatedBowlingTeam[bowlerIndex].bowl.score += additionalScore;
      }
      setBowlingTeamPlayers(updatedBowlingTeam);
    }

    
    setAdditionalScoreModal(false); // Close the modal if needed
  };

  const handleBowlerChange = (selectedBowlerName) => {
    setModalVisible(false);

    // Find the index of the selected bowler in the list
    const nextBowlerIndex = bowlingTeamPlayers.findIndex((player) => player.name === selectedBowlerName);

    if (nextBowlerIndex >= 0) {
      const striker = currentStriker;
      setCurrentStriker(currentNonStriker);
      setCurrentNonStriker(striker);
      setCurrentBowler(bowlingTeamPlayers[nextBowlerIndex]);
    }
  };

  const handleBowlerChangeInitial = (selectedBowlerName) => {

    setInitialModalVisible(false);
    // Find the index of the selected bowler in the list
    const nextBowlerIndex = bowlingTeamPlayers.findIndex((player) => player.name === selectedBowlerName);

    setCurrentBowler(bowlingTeamPlayers[nextBowlerIndex]);
    
  };

  function ballsToOvers(balls) {
    const overs = Math.floor(balls / 6); // Get the number of complete overs
    const remainingBalls = balls % 6; // Get the remaining balls after complete overs
  
    if (remainingBalls === 0) {
      return `${overs} overs`;
    } else {
      return `${overs}.${remainingBalls} overs`;
    }
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

        <Text style={styles.headingText}>Match Code: {propsData?.matchCode}</Text>
        </View>
        <View 
        style={{    
          margin: 5,
          padding: 5,
          backgroundColor: 'rgba(255, 203, 203, 0.849)',
          borderRadius: 10,
          borderColor: 'rgba(121, 0, 0, 0.849)',
          borderWidth: 2,
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center'
          }}>

{inning === 1 && (
            <Text
            style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>
              1st Inning
            </Text>
          )}
          {target !== 0 && (
            <Text
            style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>
              {battingTeam} needs {target-score} runs to win
            </Text>
          )}


        <Text  style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>
          {battingTeam} 🏏: {score}/{wickets}
        </Text>
        <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>
          {bowlingTeam} ⚾ : {overs}.{balls}
        </Text>


       <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Striker: {currentStriker.name} 
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
        
        
        
        
        <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Non-Striker: {currentNonStriker.name}
        
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



        <Text  style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>

  Bowler: {currentBowler?.name} {currentBowler?.bowl && `| ${currentBowler?.bowl?.score}/${currentBowler?.bowl?.wickets} | ${ballsToOvers(currentBowler?.bowl?.balls)}`

}
</Text>

        
        {/* <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Batting Team: {battingTeam}</Text>
        <Text style={{width: '100%', fontWeight: 'bold', textAlign: 'center', fontSize: 17}}>Bowling Team: {bowlingTeam}</Text> */}

        </View>
      </View>

      <View style={{flex: 1, padding: 10, justifyContent: 'space-around'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => handleBallEvent('wide')}
            style={styles.button}>
            <Text style={styles.buttonText}>Wide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBallEvent('no-ball')}
            style={styles.button}>
            <Text style={styles.buttonText}>No-Ball</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBallEvent('double')}
            style={styles.button}>
            <Text style={styles.buttonText}>Double</Text>
          </TouchableOpacity>
          {/* <Button title="Wide" onPress={() => handleBallEvent('wide')} /> */}
          {/* <Button title="No-Ball" onPress={() => handleBallEvent('no-ball')} />
          <Button title="Out" onPress={() => handleBallEvent('out')} /> */}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

<TouchableOpacity
            onPress={() => handleBallEvent('boundary')}
            style={styles.button}>
            <Text style={styles.buttonText}>Four</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBallEvent('six')}
            style={styles.button}>
            <Text style={styles.buttonText}>Six</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBallEvent('single')}
            style={styles.button}>
            <Text style={styles.buttonText}>Single</Text>
          </TouchableOpacity>


          {/* <Button
            title="Boundary"
            onPress={() => handleBallEvent('boundary')}
          />
          <Button title="Six" onPress={() => handleBallEvent('six')} />
          <Button title="Single" onPress={() => handleBallEvent('single')} /> */}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

          <TouchableOpacity
            onPress={() => handleBallEvent('dot')}
            style={styles.button}>
            <Text style={styles.buttonText}>Dot</Text>
          </TouchableOpacity>


                      <TouchableOpacity
            onPress={() => handleBallEvent('out')}
            style={styles.buttonOut}>
            <Text style={styles.buttonTextOut}>Out</Text>
          </TouchableOpacity>



          {/* <Button title="Double" onPress={() => handleBallEvent('double')} /> */}
          {/* Add more buttons for other events as needed */}
        </View>
      </View>

      {/* {matchFinished && (
          <Text style={{textAlign: 'center'}}>
            Match Finished... Winner Team: {winningTeam}
          </Text>
        )} */}

<Modal visible={isModalVisible} transparent={true} animationType="slide">
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={{ backgroundColor: 'white', width: 300, padding: 20, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'black' }}>Select Bowler:</Text>
      <FlatList
        data={bowlingTeamPlayers.filter(player => player.name !== currentBowler?.name)}
        keyExtractor={(player, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: '#ccc', marginVertical: 10, borderRadius: 5 }}
            onPress={() => handleBowlerChange(item.name)}
          >
            <Text style={{ fontSize: 16, textAlign: 'center', color: 'black' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>


<Modal visible={initialModalVisible} transparent={true} animationType="slide">
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <View style={{ backgroundColor: 'white', width: 300, padding: 20, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'black' }}>Select Opening Bowler:</Text>
      <FlatList
        data={bowlingTeamPlayers}
        keyExtractor={(player, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: '#ccc', marginVertical: 5, borderRadius: 5 }}
            onPress={() => handleBowlerChangeInitial(item.name)}
          >
            <Text style={{ fontSize: 16, textAlign: 'center', color: 'black' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>


<Modal visible={additionalScoreModal} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', width: 300, padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'black' }}>Enter Score</Text>

          <View style={styles.SectionStyle}>
          <TextInput
            placeholder="Score to be added"
            value={textInputValue}
            onChangeText={text => setTextInputValue(text)}
            keyboardType='numeric'
            underlineColorAndroid="#f000"
            placeholderTextColor="#8b9cb5"
            style={styles.inputStyle}
          />
            </View>

          
          <TouchableOpacity style={styles.buttonStyle} onPress={handleOkayButtonPress}>
            <Text style={styles.buttonTextStyle}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>



    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#ca3232',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#ca3232',
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  heading: {
    margin: 5,
    padding: 5,
    backgroundColor: '#ca3232',
    height: 50,
    borderRadius: 10,
    borderColor: '#ca3232',
    borderWidth: 2
  },
  headingText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%'
  },
  button: {
    margin: 5,
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    width: '100%'
  },
  buttonOut: {
    margin: 5,
    padding: 5,
    backgroundColor: '#ca3232',
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderColor: '#ca3232',
    borderWidth: 2
  },
  buttonTextOut: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%'
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
    padding: 30,
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

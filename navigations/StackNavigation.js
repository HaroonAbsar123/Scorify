import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigation from './BottomNavigation';
import SplashScreen from '../components/Screens/Splash';
import Login from '../components/Screens/Login';
import Signup from '../components/Screens/Signup';


import CreateMatchCode from '../components/CreateMatchCode/CreateMatchCode';
import CreateTeam from '../components/CreateMatchCode/CreateTeam';
import Scoreboard from '../components/CreateMatchCode/Scoreboard';


import CreateTournament from '../components/CreateTournament/CreateTournament';
import EnterTeamDetails from '../components/CreateTournament/EnterTeamDetails';
import GenerateMatches from '../components/CreateTournament/GenerateMatches';

import EnterMatchCode from '../components/EnterMatchCode/EnterMatchCode';
import ViewMatch from '../components/EnterMatchCode/ViewMatch';


import OldMatches from '../components/OldMatches/OldMatches';
import OldMatchView from '../components/OldMatches/OldMatchView';

import EditMatch from '../components/EditMatchCode/EditMatch';
import EditMatchCode from '../components/EditMatchCode/EditMatchCode';
import TournamentHomeScreen from '../components/CreateTournament/TournamentHomeScreen';
import MatchesDetails from '../components/CreateTournament/MatchesDetails';
import TournamentScoreboard from '../components/CreateTournament/TournamentScoreboard';
import EditTournamentMatch from '../components/CreateTournament/EditTournamentMatch';

const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen
        name="Splash"
        options={{headerShown: false}}
        component={SplashScreen}
      />
      <Stack.Screen
        name="Login"
        options={{headerShown: false}}
        component={Login}
      />
      <Stack.Screen
        name="Signup"
        options={{headerShown: false}}
        component={Signup}
      />
      <Stack.Screen
        name="BottomNavigation"
        options={{headerShown: false}}
        component={BottomNavigation}
      />


      <Stack.Screen
        name="CreateMatchCode"
        options={{headerShown: false}}
        component={CreateMatchCode}
      />
      <Stack.Screen
        name="CreateTeam"
        options={{headerShown: false}}
        component={CreateTeam}
      />
      <Stack.Screen
        name="Scoreboard"
        options={{headerShown: false}}
        component={Scoreboard}
      />


      <Stack.Screen
        name="TournamentHomeScreen"
        options={{headerShown: false}}
        component={TournamentHomeScreen}
      />
      <Stack.Screen
        name="CreateTournament"
        options={{headerShown: false}}
        component={CreateTournament}
      />
      <Stack.Screen
        name="EnterTeamDetails"
        options={{headerShown: false}}
        component={EnterTeamDetails}
      />
        <Stack.Screen
        name="GenerateMatches"
        options={{headerShown: false}}
        component={GenerateMatches}
      />
      <Stack.Screen
        name="MatchesDetails"
        options={{headerShown: false}}
        component={MatchesDetails}
      />
      <Stack.Screen
        name="TournamentScoreboard"
        options={{headerShown: false}}
        component={TournamentScoreboard}
      />
      <Stack.Screen
        name="EditTournamentMatch"
        options={{headerShown: false}}
        component={EditTournamentMatch}
      />



      <Stack.Screen
        name="EnterMatchCode"
        options={{headerShown: false}}
        component={EnterMatchCode}
      />
      <Stack.Screen
        name="ViewMatch"
        options={{headerShown: false}}
        component={ViewMatch}
      />


      <Stack.Screen
        name="OldMatches"
        options={{headerShown: false}}
        component={OldMatches}
      />
      <Stack.Screen
        name="OldMatchView"
        options={{headerShown: false}}
        component={OldMatchView}
      />

    <Stack.Screen
        name="EditMatchCode"
        options={{headerShown: false}}
        component={EditMatchCode}
      />
      <Stack.Screen
        name="EditMatch"
        options={{headerShown: false}}
        component={EditMatch}
      />

    </Stack.Navigator>
  );
}

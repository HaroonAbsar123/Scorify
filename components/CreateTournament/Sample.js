import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function CreateTournament() {



  return (
    <View style={styles.container}>
            <Image
        source={require('../../assets/worldcuplogo.png')} // You can replace this with your under development image
        style={{
        width: 200, // Adjust the width and height based on your image
        height: 200,}}
      />

      <Text style={{    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'}}>Under Development</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underDevelopmentText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    width: '100%',
    textAlign: 'center'
  },
  underDevelopmentImage: {
    width: 200, // Adjust the width and height based on your image
    height: 200,
  },
});

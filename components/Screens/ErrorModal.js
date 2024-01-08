// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const ErrorModal = (props) => {
    const {errorModal, text, setErrorModal} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={errorModal}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Text style={styles.textStyle}>{text}</Text>

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => {setErrorModal(false) }}>
            <Text style={styles.buttonTextStyle}>Okay</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    width: responsiveWidth(90),
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20
  },
  textStyle: {
   textAlign: 'center',
   fontSize: 20,
   width: '100%',
   fontWeight: 'bold'
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
    width: responsiveWidth(80)
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
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
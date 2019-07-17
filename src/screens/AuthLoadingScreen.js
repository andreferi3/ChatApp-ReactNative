import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import User from '../../User';
import firebase from 'firebase';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentWillMount() {
    // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAIXUkhnSfa9YJ9jXQvjnPBmrzNRDp_SfQ",
    authDomain: "chatkuy-ffeab.firebaseapp.com",
    databaseURL: "https://chatkuy-ffeab.firebaseio.com",
    projectId: "chatkuy-ffeab",
    storageBucket: "chatkuy-ffeab.appspot.com",
    messagingSenderId: "682272875357",
    appId: "1:682272875357:web:e5d235c74d80540f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.email = await AsyncStorage.getItem('userEmail');
    User.uid = await AsyncStorage.getItem('userId');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.email ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

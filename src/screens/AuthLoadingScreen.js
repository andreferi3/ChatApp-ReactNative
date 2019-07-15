import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import User from '../../User';
import firebase from 'firebase';

console.disableYellowBox = true

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentWillMount() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "<YOUR_API_KEY>",
      authDomain: "<YOUR_FIREBASE_DOMAIN>",
      databaseURL: "<YOUR_API_URL>",
      projectId: "<YOUR_PROJECT_ID>",
      storageBucket: "",
      messagingSenderId: "<YOUR_MESSAGING_ID>",
      appId: "<YOUR_APP_ID>"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
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

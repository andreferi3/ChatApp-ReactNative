import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';
import User from '../../User';
import styles from '../constants/styles';

export default class Login extends Component {

  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      isLoading: false,
      errEmail: true,
      errPassword: true
    }
  }

  validate = async () => {
    if (this.state.password.length < 6) {
      this.setState({ errPassword: 'Too short!' })
    } else {
      this.setState({ errPassword: true })
    }
    if (this.state.errEmail != false && this.state.errPassword != false) {
      await AsyncStorage.setItem('userEmail', this.state.email);
      this.login()
    }
  }

  login = async () => {
    this.setState({
      isLoading: true
    })

    let email = this.state.email;
    let password = this.state.password;

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        User.uid = user.uid;
        User.email = this.state.email;
        await AsyncStorage.setItem('userId', user.uid);
        this.props.navigation.navigate('App');
        this.setState({isLoading:false})
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
          this.setState({isLoading:false})
        } else {
          alert(errorMessage);
          this.setState({isLoading:false})
        }
        console.log(error);
      });
  }

  _onChangeEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({
        errEmail: "Email is Not Correct"
      })
      this.setState({ email: text })
      return false;
    }
    else {
      this.setState({
        email: text,
        errEmail: true
      })
    }
  }

  _onChangePassword = val => {
    this.setState({
      password: val
    })
  }

  render() {
    return (
      <React.Fragment>
        <StatusBar hidden />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#48c6ef', '#6f86d6']}
          style={styles.backgroundGradient}>

          <View style={styles.container}>

            <View style={styles.containerImage}>
              <Image source={require('../assets/icon/chatrobot.png')} style={styles.imageSize} />
            </View>

            <Text style={styles.textLogo}
            >Chat Kuy</Text>

            {
              this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : null
            }

            <TextInput style={styles.textInput} placeholder='Email address...' keyboardType={'email-address'} onChangeText={this._onChangeEmail} value={this.state.email} />
            {
              this.state.errEmail !== true ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errEmail}</Text> : null
            }

            <TextInput style={[styles.textInput, { marginTop: 20 }]} placeholder='Password...' secureTextEntry={true} onChangeText={this._onChangePassword} value={this.state.password} />
            {
              this.state.errPassword !== true ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errPassword}</Text> : null
            }

            <TouchableOpacity style={styles.flexRow} onPress={() => this.validate()}>
              <View style={styles.button}>
                <Text style={styles.textButton}>Login</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.flexRow, { flexDirection: 'row', marginTop: 50, alignItems: 'center' }]}>
              <Text style={styles.whiteText}>Or login using</Text>
              <Image source={require('../assets/icon/facebook.png')} style={styles.iconLogin} />
              <View style={styles.googleLogin}>
                <Image source={require('../assets/icon/google.png')} style={styles.imageSizeSm} />
              </View>
            </View>

            <View style={[styles.footer, { marginTop: 60 }]}>
              <View style={styles.flexRow}>
                <Text style={styles.footerText}>Don't have an account ? </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                  <Text style={styles.f1Text}>Sign up here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </React.Fragment>
    );
  }
}
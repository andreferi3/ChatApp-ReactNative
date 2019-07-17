import React, { Component } from 'react';
import firebase, { auth } from 'firebase';
import User from '../../User';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  DatePickerAndroid,
  AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../constants/styles';

export default class Register extends Component {

  constructor() {
    super();

    this.state = {
      phone: '',
      date: '',
      name: '',
      password: '',
      email: '',
      image: 'http://deafhhcenter.org/wp-content/uploads/2017/12/profile-default.jpg',
      errPhone: false,
      errName: false,
      errAge: false,
      errEmail: false,
      errPassword: false
    }
  }

  datePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
      });
      if (action == DatePickerAndroid.dateSetAction) {
        this.setState({
          date: `${day}/${month + 1}/${year}`
        })
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  validate = () => {
    if (this.state.phone.length < 10) {
      this.setState({ errPhone: 'Phone number less than 10!' })
    } else {
      this.setState({ errPhone: false })
    }
    if (this.state.password.length < 6) {
      this.setState({ errPassword: 'Too short!' })
    } else {
      this.setState({ errPassword: false })
    }
    if (this.state.name.length < 5) {
      this.setState({ errName: 'Too short!' })
    } else {
      this.setState({ errName: false })
    }
    if (this.state.date.length == '') {
      this.setState({ errAge: 'Sorry! Age must be filled' })
    } else {
      this.setState({ errAge: false })
    }
    if (this.state.name != '' && this.state.date != '' && this.state.email != '' && this.state.password != '') {
      this.register()
    }
  }

  register = async () => {
    await AsyncStorage.setItem('userEmail', this.state.email);
    User.email = this.state.email;
    User.phone = this.state.phone;
    User.name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    console.warn('Masuk pa ekoo')
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(
      ({user}) => firebase.database().ref('users/' + user.uid).set({
        email: this.state.email,
        name: this.state.name,
        age: this.state.date,
        password: this.state.password,
        phone: this.state.phone
      })
    )
    .catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if(errorCode == 'auth/weak-password') {
        alert('The password is too weak');
      } else {
        alert(errorMessage);
      }
    })
    this.props.navigation.navigate('Login');
    Alert.alert(
      'Register Successful!'
    )
  }

  changeName = val => {
    this.setState({
      name: val
    })
  }

  changePhone = val => {
    this.setState({
      phone: val
    })
  }

  changePassword = val => {
    this.setState({
      password: val
    })
  }

  changeEmail = (text) => {
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
        errEmail: false
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <StatusBar hidden />
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#48c6ef', '#698ed9']}
          style={styles.backgroundGradient}>
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.containerImage}>
              <Image source={require('../assets/icon/chatrobot.png')} style={{ width: 150, height: 150 }} />
            </View>

            <Text style={styles.textLogo}>Chat Kuy</Text>

            <TextInput style={styles.textInput} placeholder='Enter your name...' onChangeText={this.changeName} />
            {
              this.state.errName !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errName}</Text> : null
            }

            <TextInput style={[styles.textInput, { marginTop: 20 }]} placeholder='Enter your phone number...' onChangeText={this.changePhone} />
            {
              this.state.errPhone !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errPhone}</Text> : null
            }

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <TextInput style={[styles.textInput, { width: '80%' }]} value={this.state.date} placeholder='Enter your age...' />
              <TouchableOpacity style={{ backgroundColor: '#fff', padding: 10, borderRadius: 50, marginLeft: 15 }} onPress={this.datePicker}>
                <Image source={require('../assets/icon/calendar.png')} />
              </TouchableOpacity>
            </View>
            {
              this.state.errAge !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errAge}</Text> : null
            }

            <TextInput style={[styles.textInput, { marginTop: 20 }]} keyboardType={'email-address'} placeholder='Enter email address...' onChangeText={(text) => this.changeEmail(text)} />
            {
              this.state.errEmail !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errEmail}</Text> : null
            }

            <TextInput style={[styles.textInput, { marginTop: 20 }]} placeholder='Enter password...' secureTextEntry={true} onChangeText={this.changePassword} />
            {
              this.state.errPassword !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errPassword}</Text> : null
            }

            <TouchableOpacity style={styles.flexRow} onPress={this.validate}>
              <View style={styles.button}>
                <Text style={styles.textButton}>Register</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../assets/icon/facebook.png')} style={{ width: 35, height: 35, marginLeft: 15 }} />
              <View style={{ backgroundColor: '#fff', padding: 7, borderRadius: 50, marginLeft: 10 }}>
                <Image source={require('../assets/icon/google.png')} style={{ width: 20, height: 20 }} />
              </View>
            </View>

            <View style={[styles.footer, { marginTop: 20 }]}>
              <View style={styles.flexRow}>
                <Text style={styles.footerText}>Have an account ? </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styles.f1Text}>Login here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </React.Fragment>
    );
  }
}

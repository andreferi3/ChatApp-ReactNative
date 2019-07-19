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
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../constants/styles';

export default class Register extends Component {

  constructor() {
    super();

    this.getUserLocation();    

    this.state = {
      phone: '',
      image: '',
      name: '',
      password: '',
      email: '',
      image: '',
      latitude: 0,
      longitude: 0,
      errPhone: false,
      errName: false,
      errAge: false,
      errEmail: false,
      errPassword: false,
      isLoading: false
    }
  }

  async getUserLocation() {
    await navigator.geolocation.getCurrentPosition(
        (position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        },
        (error) => {
            console.warn('Error ' + error.message)
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 200000 }
    )
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
    if (this.state.name != '' && this.state.date != '' && this.state.email != '' && this.state.password != '') {
      this.register()
    }
  }

  register = async () => {
    User.email = this.state.email;
    User.phone = this.state.phone;
    User.name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;
    this.setState({
      isLoading: true
    })
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(
        ({ user }) =>
          firebase.database().ref('users/' + user.uid).set({
            about: "-",
            status: "offline",
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone,
            avatar: this.state.image == '' ? 'http://www.thesanctuaryinstitute.org/wp-content/uploads/2018/07/missing-image-avatar.png' : this.state.image,
            location: {
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              city: {
                name: ""
              }
            }
          })
      )
      .then(() => {
        this.props.navigation.navigate('Login');
          Alert.alert(
            'Register Successful!'
          )
          this.setState({
            isLoading: false
          })
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        this.setState({
          isLoading: false
        });
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak');
        } else {
          alert(errorMessage);
        }
      })
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

  changeImage = val => {
    this.setState({
      image: val.slice(0, 4) !== 'http' || val == '' ? 'http://www.thesanctuaryinstitute.org/wp-content/uploads/2018/07/missing-image-avatar.png' : val
    })
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

            {
              this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : null
            }

            <TextInput style={styles.textInput} placeholder='Enter your name...' onChangeText={this.changeName} />
            {
              this.state.errName !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errName}</Text> : null
            }

            <TextInput style={[styles.textInput, { marginTop: 20 }]} placeholder='Enter your phone number...' onChangeText={this.changePhone} />
            {
              this.state.errPhone !== false ? <Text style={{ marginTop: 10, marginLeft: 5, color: '#ff0000' }}>{this.state.errPhone}</Text> : null
            }

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <TextInput style={[styles.textInput, { width: '80%' }]} placeholder='Image url...' onChangeText={this.changeImage} />
              <View style={{ borderRadius: 50, marginLeft: 9 }}>
                <Image source={{ uri: this.state.image.slice(0, 4) !== 'http' ? 'http://www.thesanctuaryinstitute.org/wp-content/uploads/2018/07/missing-image-avatar.png' : this.state.image }} style={{ width: 45, height: 45, borderRadius: 50 }} />
              </View>
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

            {
              this.state.isLoading == true ?
                <TouchableOpacity style={styles.flexRow} onPress={this.validate} disabled>
                  <View style={styles.button}>
                    <Text style={styles.textButton}>Register</Text>
                  </View>
                </TouchableOpacity> : 
                <TouchableOpacity style={styles.flexRow} onPress={this.validate}>
                <View style={styles.button}>
                  <Text style={styles.textButton}>Register</Text>
                </View>
              </TouchableOpacity>
            }

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

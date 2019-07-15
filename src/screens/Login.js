import React, {Component} from 'react';
import {
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import User from '../../User';
import styles from '../constants/styles';

console.disableYellowBox = true

export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            phone: '',
            password: ''       
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('userPhone').then(val => {
            if(val) {
                this.setState({phone: val})
            }
        })
    }

    login = async () => {
        if(this.state.phone.length < 10) {
            Alert.alert(
                'Failed',
                `Sorry! Your phone number less than 10`
            )
            if(this.state.password.length < 6) {
                Alert.alert(
                    'Failed!',
                    `Sorry! Your password less than 6`
                )
            }
        } else {
            Alert.alert(
                'Berhasil',
                `Nomor Anda : ${this.state.phone}\nPassword : ${this.state.password}`
            )

            await AsyncStorage.setItem('userPhone', this.state.phone);
            User.phone = this.state.phone;
            this.props.navigation.navigate('App');
        }
    }

    _onChangePhone = val => {
        this.setState({
            phone: val
        })
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
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            colors={['#48c6ef', '#6f86d6']} 
            style={styles.backgroundGradient}>

            <View style={styles.container}>

            <View style={styles.containerImage}>
              <Image source={require('../assets/icon/chatrobot.png')} style={styles.imageSize} />
            </View>

            <Text style={styles.textLogo}
            >Chat Kuy</Text>

            <TextInput style={styles.textInput} placeholder='Phone number...' keyboardType={'numeric'} onChangeText={this._onChangePhone} value={this.state.phone} />

            <TextInput style={[styles.textInput, {marginTop:20}]} placeholder='Password...' secureTextEntry={true} onChangeText={this._onChangePassword} value={this.state.password} />

            <TouchableOpacity style={styles.flexRow} onPress={() => this.login()}>
              <View style={styles.button}>
                <Text style={styles.textButton}>Login</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.flexRow, {flexDirection:'row', marginTop:50, alignItems:'center'}]}>
              <Text style={styles.whiteText}>Or login using</Text>
              <Image source={require('../assets/icon/facebook.png')} style={styles.iconLogin} />
              <View style={styles.googleLogin}>
                <Image source={require('../assets/icon/google.png')} style={styles.imageSizeSm} />
              </View>
            </View>

            <View style={styles.footer}>
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
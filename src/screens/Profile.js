import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../constants/styles';

export default class Profile extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: props.navigation.getParam('name'),
                avatar: props.navigation.getParam('avatar'),
                phone: props.navigation.getParam('phone'),
                email: props.navigation.getParam('email')
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#48c6ef', '#6f86d6']}
                    style={{ width: '100%', height: '100%', paddingHorizontal: 10, paddingVertical: 20}}>

                    <View style={{flexDirection:'row', padding:15, alignItems:'center'}}>
                        <Image source={{uri: this.state.user.avatar}} style={{width:100, height:100, borderRadius:100}} />
                        <View style={{flex:1, marginLeft:10}}>
                            <Text style={{fontSize:24, color:'#2e373c', fontFamily:'sans-serif-medium'}}>{this.state.user.name}</Text>
                            <Text style={{fontSize:16, color:'#2e373c', fontFamily:'sans-serif-medium'}}>{this.state.user.email}</Text>
                        </View>
                    </View>

                </LinearGradient>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['rgba(255,255,255,0.040)', 'rgba(255,255,255,0.090)']}
                    style={{ position: 'absolute', bottom: 0, right: 0, left: 0, elevation: 8 }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Home')}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/chat.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress
                        ={() => this.props.navigation.navigate('Maps')}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/location.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/man.png')} style={{ width: 45, height: 45 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </React.Fragment>
        )
    }
}
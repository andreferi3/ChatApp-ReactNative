import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    FlatList,
    Image
} from 'react-native';
import User from '../../User';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';

export default class Dashboard extends Component {

    constructor() {
        super()

        this.state = {
            users: [],
            email: [],
            phone: ''
        }
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users/' + User.uid + '/message');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.uid = val.key;
            this.setState((prevState) => {
                return {
                    users: [...prevState.users, person]
                }
            })
        })

        let userRef = firebase.database().ref('users/' + User.uid);
        userRef.on('value', (val) => {
            let user = val.val();
            User.name = user.name,
            User.phone = user.phone,
            User.avatar = user.avatar,
            User.email = user.email,
            User.data = {
                name: User.name,
                phone: User.phone,
                avatar: User.avatar,
                email: User.email
            }
        })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if(c.getDay() !== d.getDay()) {
            result = d.getDay() + ' '  + d.getMonth() + ' ' + result;
        }
        return result;
    }

    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', item)} style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: item.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                    <View style={{ padding: 10, flex: 3 }}>
                        <Text style={{ fontSize: 23, color: '#f1f1f1', fontFamily: 'sans-serif-medium', fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ fontFamily: 'sans-serif-light', fontSize: 16, fontWeight: '600' }} numberOfLines={1}>Kamu : {item.messageText}</Text>
                    </View>
                    <View style={{ padding: 10, flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text style={{ color: '#f1f1f1', fontSize: 11, fontFamily: 'sans-serif-medium' }}>{this.convertTime(item.time)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <React.Fragment>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#48c6ef', '#6f86d6']}
                    style={{ width: '100%', height: '100%', paddingHorizontal: 10, paddingVertical: 20, marginTop: 50 }}>

                    <FlatList
                        data={this.state.users}
                        keyExtractor={(item) => item.uid}
                        renderItem={this._renderItem} />
                </LinearGradient>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#48c6ef', '#6f86d6']}
                    style={{ backgroundColor: '#48c6ef', position: 'absolute', top: 0, right: 0, left: 0, elevation: 8 }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 23, color: '#f1f1f1', fontFamily: 'sans-serif-medium', fontWeight: 'bold' }}>Chat Room</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={this.logout}>
                            <Text style={{ fontSize: 23, color: '#f1f1f1', fontFamily: 'sans-serif-medium', fontWeight: 'bold' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['rgba(255,255,255,0.040)', 'rgba(255,255,255,0.090)']}
                    style={{ position: 'absolute', bottom: 0, right: 0, left: 0, elevation: 8 }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' }}>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/chat.png')} style={{ width: 45, height: 45 }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Maps')}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/location.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Profile', User.data)}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/man.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </React.Fragment>
        )
    }
}
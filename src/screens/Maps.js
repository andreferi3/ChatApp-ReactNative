import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import User from '../../User';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modalbox';
import Geocoder from 'react-native-geocoder';

var screen = Dimensions.get('window');

console.disableYellowBox = true

export default class Maps extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null,
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            users: [],
            email: '',
            isLoading: false,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            longitude: 0,
            latitude: 0,
            friendLocation: {},
            name: '',
            email: '',
            phone: '',
            debug: []
        }

        this.getUserLocation();
        this.getAllUser();
    }

    async getAllUser() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_changed', (val) => {
            this.setState((prevState) => {
                return {
                    data: [...prevState.data, val.val()]
                }
            })
        })
    }

    async getUserLocation() {
        await navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                firebase.database().ref('users/' + User.uid + '/location').update({
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

    async componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', async (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid === User.uid) {
                User.name = person.name;
                User.phone = person.phone;
                User.avatar = person.avatar;
                User.email = person.email;
                User.latitude = person.location.latitude;
                User.longtitude = person.location.longitude;
                User.data = {
                    name: User.name,
                    phone: User.phone,
                    avatar: User.avatar,
                    email: User.email
                };
                let pos = {
                    lat: person.location.latitude,
                    lng: person.location.longitude
                }

                await Geocoder.geocodePosition(pos).then(res => {
                    firebase.database().ref('users/' + person.uid + '/location/city').set({
                        name: res[0].locality
                    })
                })
                firebase.database().ref('users/'+User.uid).update({status:'Online'});
                firebase.database().ref('users/'+User.uid).onDisconnect().update({status:'Offline'});
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                });

                let pos = {
                    lat: person.location.latitude,
                    lng: person.location.longitude
                }

                await Geocoder.geocodePosition(pos).then(res => {
                    firebase.database().ref('users/' + person.uid + '/location/city').set({
                        name: res[0].locality
                    })
                })
            }
        })

        dbRef.on('child_changed', (val) => {
            let person = val.val();
            person.uid = val.key;
            if(person.uid !== User.uid) {
                this.setState((prevState) => {
                    return {
                        users: prevState.users.map(user => {
                            if(user.uid === person.uid) {
                                user = person
                            }
                            return user
                        })
                    }
                })
            }
        })
    }

    componentDidMount() {
        navigator.geolocation.watchPosition(
            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                firebase.database().ref('users/' + User.uid + '/location').update({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            error => console.warn(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }
        );
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    {
                        this.state.isLoading === true ? <ActivityIndicator size={'large'} style={{position:'absolute', top:0, bottom:0, left:0, right:0}} /> : 

                    <MapView
                        ref={(mapView) => {_mapView = mapView}}
                        style={styles.map}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        initialRegion={{
                            latitude: this.state.latitude || -7.75850555,
                            longitude: this.state.longitude || 110.37815382,
                            latitudeDelta: 0.00043,
                            longitudeDelta: 0.0034
                        }}
                    >
                        <Marker
                            title={User.name}
                            description={User.email}
                            coordinate={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.0043,
                                longitudeDelta: 0.0034
                            }} />
                        {
                            this.state.users.map((data) => (
                                <Marker
                                    title={data.name}
                                    description={data.email}
                                    key={data.uid}
                                    coordinate={{
                                        latitude: data.location.latitude,
                                        longitude: data.location.longitude,
                                        latitudeDelta: 0.0043,
                                        longitudeDelta: 0.0034
                                    }}>
                                        <Image source={{uri:data.avatar}} style={{width:50, height:50, borderRadius:50}} />
                                    </Marker>
                            ))
                        }

                    </MapView>
                    }
                </View>
                
                {
                    this.state.isOpen === true ? null : 
                
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
                        <View style={{ flex: 1}}>
                            <TouchableOpacity style={{ borderRadius: 50, alignItems:'center', marginBottom:20 }} onPress={() => _mapView.animateToRegion({
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.00043,
                                longitudeDelta: 0.0034
                            }, 1000)}>
                                <Image source={require('../assets/icon/target.png')} style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems:'center', justifyContent:'center'}} onPress={() => this.refs.modal6.open()}>
                                <FlatList 
                                data={this.state.users.slice(0,3)}
                                horizontal={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                    return (
                                        <View style={{flexDirection:'row'}}>
                                            <Image source={{uri:item.avatar}} style={{width:30, height:30, paddingTop:20, borderRadius:50}} />
                                        </View>
                                    )
                                }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Profile', User.data)}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/man.png')} style={{ width: 30, height: 30 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                }
                <Modal style={[styles.modal4, {borderTopStartRadius:20, borderTopEndRadius:20, padding:15}]} position={"bottom"} ref={"modal6"} swipeArea={20} onClosed={() => this.setState({isOpen:false})} onOpened={() => this.setState({isOpen:true})}>
                    <ScrollView>
                        <View style={{flex:1}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>Trace your friend!</Text>
                            </View>
                        </View>
                        <Text>{this.state.friendLocation.city}</Text>
                        <View>
                            <View style={{flex:1}}>
                                <FlatList 
                                data={this.state.users}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity style={{flex:1, marginRight:10, marginTop:10}} onPress={() => _mapView.animateToRegion({
                                            latitude: item.location.latitude,
                                            longitude: item.location.longitude,
                                            latitudeDelta: 0.0043,
                                            longitudeDelta: 0.0034
                                        }, 1000)}>
                                            <View style={{backgroundColor:'#fff', width:100, alignItems:'center', elevation:5, padding:10}}>
                                                <Image source={{uri:item.avatar}} style={{height:80, width:80, borderRadius:50}} />
                                                <Text numberOfLines={2} style={{textAlign:'center', marginTop:5, color: '#2e373c', fontFamily: 'sans-serif-medium'}}>{item.name}</Text>
                                                <Text style={{textAlign:'center'}}>{item.location.city.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }} />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>

                {/* <TouchableOpacity style={{position:'absolute', top:0, left:0, backgroundColor:'#fff', padding:6, elevation:5, marginTop:10, marginLeft:10, display:'none'}} onPress={this.refresh}>
                    <Image source={require('../assets/icon/refresh.png')} style={{width:25, height:25}} />
                </TouchableOpacity> */}
            </React.Fragment>
        )
    }

    // componentWillUnmount() {
    //     navigator.geolocation.clearWatch(this.watchID);
    // }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    wrapper: {
        paddingTop: 50,
        flex: 1
    },
    modal2: {
        height: 230,
        backgroundColor: "#3B5998"
    },

    modal3: {
        height: 300,
        width: 300
    },

    modal4: {
        height: 300
    },

    btn: {
        margin: 10,
        backgroundColor: "#3B5998",
        color: "white",
        padding: 10
    },

    btnModal: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        backgroundColor: "transparent"
    },

    text: {
        color: "black",
        fontSize: 22
    }
});
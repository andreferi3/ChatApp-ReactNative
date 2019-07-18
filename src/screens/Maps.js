import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import User from '../../User';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modalbox';
import Geocoder from 'react-native-geocoder';

var screen = Dimensions.get('window');

export default class Maps extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null,
        }
    }

    constructor(props) {
        super(props);

        this.getUserLocation();

        this.state = {
            users: [],
            email: '',
            isLoading: false,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            // latitude: LATITUDE,
            // longtitude: LONGTITUDE,
            // routeCoordinates: [],
            // distanceTraveled: 0,
            // prevLatLng: {},
            // coordinate: new AnimatedRegion({
            //     latitude: LATITUDE,
            //     longitude: LONGTITUDE
            // })
            longitude: 0,
            latitude: 0,
            friendLocation: {}
        }
    }

    async getUserLocation() {
        await navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                firebase.database().ref('users/' + User.uid + '/location').set({
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

    componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid === User.uid) {
                User.name = person.name,
                    User.phone = person.phone,
                    User.avatar = person.avatar,
                    User.email = person.email,
                    User.data = {
                        name: User.name,
                        phone: User.phone,
                        avatar: User.avatar,
                        email: User.email
                    }
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

                Geocoder.geocodePosition(pos).then(res => {
                    firebase.database().ref('users/' + person.uid + '/location/city').set({
                        name: res[0].locality
                    })
                })
                .catch(error => alert(error))
            }
        })
    }

    // componentDidMount() {
    //     navigator.geolocation.watchPosition(
    //         position => {
    //             this.setState({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude
    //             })
    //             firebase.database().ref('users/' + User.uid + '/location').set({
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude
    //             })
    //         },
    //         error => console.warn(error),
    //         {
    //             enableHighAccuracy: true,
    //             timeout: 20000,
    //             maximumAge: 1000,
    //             distanceFilter: 10
    //         }
    //     );
    // }

    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }

    render() {
        console.warn(this.state.friendLocation.city);
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0043,
                            longitudeDelta: 0.0034
                        }}
                    >
                        <Marker
                            title={User.name}
                            coordinate={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.0043,
                                longitudeDelta: 0.0034
                            }} />

                        {
                            this.state.users.map(data => (
                                <Marker
                                    title={data.name}
                                    coordinate={{
                                        latitude: data.location.latitude,
                                        longitude: data.location.longitude,
                                        latitudeDelta: 0.0043,
                                        longitudeDelta: 0.0034
                                    }}>
                                    <Image source={{ uri: data.avatar }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                                </Marker>
                            ))
                        }

                    </MapView>
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
                            <TouchableOpacity style={{ borderRadius: 50, alignItems:'center', marginBottom:20 }}>
                                <Image source={require('../assets/icon/location.png')} style={{ width: 30, height: 30 }} />
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
                                        <TouchableOpacity style={{flex:1, marginRight:10, marginTop:10}}>
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
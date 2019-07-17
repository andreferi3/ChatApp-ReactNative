import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import User from '../../User';
import MapView, { Marker } from 'react-native-maps';

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
            latitude: 0
        }
    }

    async getUserLocation() {
        this.setState({ isLoading: true })
        await navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    isLoading: false,
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
                })
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        loadingEnabled={true}
                        showsUserLocation={true}
                        region={{
                            latitude: this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : this.state.latitude,
                            longitude: this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : this.state.longitude,
                            latitudeDelta: 0.0043,
                            longitudeDelta: 0.0034
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : this.state.latitude,
                                longitude: this.state.isLoading === true ? <ActivityIndicator size={'large'} /> : this.state.longitude,
                                latitudeDelta: 0.0043,
                                longitudeDelta: 0.0034
                            }}>
                                <Image source={{uri:User.avatar}} style={{width:50, height:50, borderRadius:50}} />
                            </Marker>

                        {
                            this.state.users.map(data => (
                                <Marker 
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
                </View>

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
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#rgba(255,255,255,0.7)', padding: 10, borderRadius: 50, elevation: 5 }}>
                                <Image source={require('../assets/icon/location.png')} style={{ width: 50, height: 50 }} />
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
});
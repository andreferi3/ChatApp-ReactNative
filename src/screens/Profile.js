import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
    TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import User from '../../User';
import Modal from 'react-native-modalbox';

var screen = Dimensions.get('window');

export default class Profile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            friend: [],
            user: {
                name: props.navigation.getParam('name'),
                avatar: props.navigation.getParam('avatar'),
                phone: props.navigation.getParam('phone'),
                email: props.navigation.getParam('email')
            },
            name: ''
        }
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid == User.uid) {
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
                        friend: [...prevState.friend, person]
                    }
                })
            }
        })
    }

    onClose() {
        console.warn('Modal just closed');
    }

    onOpen() {
        console.warn('Modal just opened');
    }

    onClosingState(state) {
        console.warn('the open/close of the swipeToClose just changed');
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.2)' }} onPress={() => this.props.navigation.navigate('Chat', item)}>
                <Image source={{ uri: item.avatar }} style={{ width: 60, height: 60, borderRadius: 50 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, color: '#2e373c', fontFamily: 'sans-serif-medium', paddingLeft: 8 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: '#2e373c', fontFamily: 'sans-serif-medium', paddingLeft: 8 }}>{item.email}</Text>
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
                    style={{ width: '100%', height: '100%', paddingHorizontal: 10, paddingVertical: 20 }}>

                    <TouchableOpacity style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }} onPress={() => this.refs.modal3.open()}>
                        <View>
                            <Image source={{ uri: this.state.user.avatar }} style={{ width: 100, height: 100, borderRadius: 100 }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>{this.state.user.name}</Text>
                            <Text style={{ fontSize: 16, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>{this.state.user.email}</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ flex: 1, marginBottom: 50, padding: 15, backgroundColor: 'rgba(0,0,0,0.050)', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>Friend List</Text>
                        </View>

                        <FlatList
                            data={this.state.friend}
                            keyExtractor={(item, index) => item.uid}
                            renderItem={this._renderItem} />
                    </View>

                    <Modal style={[styles.modal, styles.modal3, { borderRadius: 15 }]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled} onOpened={() => this.setState({isOpen: true})} onClosed={() => this.setState({isOpen: false})}>
                        <ScrollView style={{ flex: 1, padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>Edit Profile</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 17 }}>
                                <Image source={{ uri: User.avatar }} style={{ width: 80, height: 80, borderRadius: 50 }} />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text>Change Image</Text>
                                <TextInput placeholder='put image url here...' style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} onChangeText={this.changeImage} />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text>Name</Text>
                                <TextInput placeholder='Edit name...' onChangeText={this.changeName} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} >{User.name}</TextInput>
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text>Email</Text>
                                <TextInput placeholder='Edit name...' onChangeText={this.changeEmail} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} >{User.email}</TextInput>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <TouchableOpacity style={{ backgroundColor: '#f3244d', flex: 1, marginRight: 10 }} onPress={() => this.refs.modal3.close()}>
                                    <Text style={{color:' #fff', textAlign:' center', padding:10}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#1f8cfa', flex: 1 }} onPress={this._updateProfile}>
                                    <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Done!</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Modal>
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
                        
const styles = StyleSheet.create({

wrapper: {
  paddingTop: 50,
  flex: 1
},

modal: {
  justifyContent: 'center',
  alignItems: 'center'
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
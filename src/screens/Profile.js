import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    AsyncStorage,
    StyleSheet,
    TextInput,
    Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import User from '../../User';
import ModalBox from 'react-native-modalbox';

export default class Profile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3,
            friend: [],
            name: '',
            avatar: '',
            phone: '',
            email: '',
            about: '',
            friendUid: '',
            friendName: '',
            friendAvatar: '',
            friendPhone: '',
            friendEmail: '',
            item: []
        }
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', async (val) => {
            let person = val.val();
            person.uid = val.key;
            if (person.uid == User.uid) {
                this.setState({
                    name: person.name,
                    avatar: person.avatar,
                    phone: person.phone,
                    email: person.email,
                    about: person.about
                });
                firebase.database().ref('users/'+User.uid).onDisconnect().update({status:'Offline'});
            } else {
                this.setState((prevState) => {
                    return {
                        friend: [...prevState.friend, person]
                    }
                })
            }
        })

        dbRef.on('child_changed', (val) => {
            let person = val.val();
            person.uid = val.key;
            if(person.uid !== User.uid) {
                this.setState((prevState) => {
                    return {
                        friend: prevState.friend.map(user => {
                            if(user.uid === person.uid) {
                                user = person
                            }
                            return user
                        })
                    }
                })
            } else {
                this.setState({
                    name: person.name,
                    avatar: person.avatar,
                    phone: person.phone,
                    email: person.email,
                    about: person.about,
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

    validate = () => {
        if(this.state.avatar == '') {
            alert('Image cannot empty!')
            this.setState({
                avatar: User.avatar
            })
        }
        if(this.state.name == '') {
            alert('Name cannot empty!')
            this.setState({
                name: User.name
            })
        }
        if(this.state.email == '') {
            alert('Email cannot empty!')
            this.setState({
                email: User.email
            })
        }
        if(this.state.avatar != '' && this.state.name != '' && this.state.email != '') {
            this._updateProfile();
        }
    }

    changeImage = (val) => {
        if(!val || val.length === 0) {
            this.setState({
                avatar: 'http://www.thesanctuaryinstitute.org/wp-content/uploads/2018/07/missing-image-avatar.png'
            })
        } else {
            this.setState((prevState) => {
                return {
                    avatar: prevState.avatar = val
                }
            })
        }
    }

    changeName = (val) => {
        this.setState((prevState) => {
            return {
                name: prevState.name = val
            }
        })
    }

    changeAbout = (val) => {
        this.setState((prevState) => {
            return {
                about: prevState.about = val
            }
        })
    }

    _updateProfile = () => {
        let dbRef = firebase.database().ref('users/' + User.uid);
        dbRef.update({
            avatar: this.state.avatar,
            name: this.state.name,
            about: this.state.about
        })
        this.refs.modal3.close()
        alert('Edit Profile Successfull!')
    }

    setModalVisible(visible, data) {
        if (data == undefined) {
            this.setState({ modalVisible: visible })
        } else {
            this.setState({
                modalVisible: visible,
                friendAvatar: data.avatar,
                friendName: data.name,
                friendPhone: data.phone,
                friendEmail: data.email,
                friendUid: data.uid,
                item: [
                    {
                        name: data.name,
                        phone: data.phone,
                        email: data.email,
                        avatar: data.avatar
                    }
                ]
            })
        }
    }

    logout = async () => {
        await AsyncStorage.clear();
        await firebase.database().ref('users/'+User.uid).update({status:'Offline'});
        this.props.navigation.navigate('Auth');
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.2)' }} onPress={() => this.setModalVisible(true, item)}>
                <Image source={{ uri: item.avatar }} style={{ width: 60, height: 60, borderRadius: 50 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, color: '#2e373c', fontFamily: 'sans-serif-medium', paddingLeft: 8 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: '#2e373c', fontFamily: 'sans-serif-medium', paddingLeft: 8, color:item.status == 'Online' ? '#368c06' : '#f70b0f' }}>{item.status}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>{item.location.city.name == '' ? 'Untracking' : item.location.city.name}</Text>
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
                            <Image source={{ uri: User.avatar }} style={{ width: 100, height: 100, borderRadius: 100 }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium', marginBottom:5, borderBottomWidth:0.8 }}>{User.name}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Image source={require('../assets/icon/mail.png')} style={{width:20, height:20}} />
                                <Text style={{ fontSize: 16, color: '#2e373c', fontFamily: 'sans-serif-medium', marginLeft:10 }}>{User.email}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Image source={require('../assets/icon/call1.png')} style={{width:20, height:20}} />
                                <Text style={{ fontSize: 16, color: '#2e373c', fontFamily: 'sans-serif-medium', marginLeft:10 }}>{User.phone}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{position: 'absolute', top: -22, right: 5}} onPress={this.logout}>
                            <Image style={{width: 50, height: 50 }} source={require('../assets/icon/exit.png')} />
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    >
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                            <View style={{ backgroundColor: '#fff', height: 370, width: 300 }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Image source={{ uri: this.state.friendAvatar }} style={{ height: 300, width: 300 }} />
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Chat', {
                                            name: this.state.friendName,
                                            phone: this.state.friendPhone,
                                            avatar: this.state.friendAvatar,
                                            email: this.state.email,
                                            uid: this.state.friendUid
                                        }) & this.setModalVisible(!this.state.modalVisible)}>
                                            <Image source={require('../assets/icon/chatb.png')} style={{ height: 40, width: 40 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' }} onPress={() => alert('Coming soon!')}>
                                            <Image source={require('../assets/icon/call.png')} style={{ height: 40, width: 40 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('FriendProfile', {
                                            uid: this.state.friendUid,
                                            name: this.state.friendName
                                        }) & this.setModalVisible(!this.state.modalVisible)}>
                                            <Image source={require('../assets/icon/info.png')} style={{ height: 35, width: 35 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    <View style={{ flex: 1, marginBottom: 50, padding: 15, backgroundColor: 'rgba(0,0,0,0.050)', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>{this.state.friend.length} Friend</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium', textAlign: 'center' }}>Location</Text>
                            </View>
                        </View>

                        <FlatList
                            data={this.state.friend}
                            keyExtractor={(item, index) => item.uid}
                            renderItem={this._renderItem} />
                    </View>

                    <ModalBox style={[styles.modal, styles.modal3, { borderRadius: 15 }]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled} onOpened={() => this.setState({ isOpen: true })} onClosed={() => this.setState({ isOpen: false })}>
                        <ScrollView style={{ flex: 1, padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>Edit Profile</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 17 }}>
                                <Image source={{ uri: this.state.avatar }} style={{ width: 80, height: 80, borderRadius: 50 }} />
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text>Change Image</Text>
                                <TextInput placeholder='put image url here...' style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} onChangeText={this.changeImage}>{this.state.avatar}</TextInput>
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text>Name</Text>
                                <TextInput placeholder='Edit name...' onChangeText={this.changeName} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} >{this.state.name}</TextInput>
                            </View>
                            <View>
                                <Text>About</Text>
                                <TextInput placeholder='Edit about...' onChangeText={this.changeAbout} style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.087)' }} multiline={true}>{this.state.about}</TextInput>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15, marginBottom:40 }}>
                                <TouchableOpacity style={{ backgroundColor: '#f3244d', flex: 1, marginRight: 10 }} onPress={() => this.refs.modal3.close()}>
                                    <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: '#1f8cfa', flex: 1 }} onPress={() => this.validate()}>
                                    <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Done!</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </ModalBox>
                </LinearGradient>

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
                }
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({

    wrapper: {
        paddingTop: 50,
        flex: 1
    },

    modal2: {
        height: 230,
        backgroundColor: "#3B5998"
    },

    modal3: {
        height: 480,
        width: 350
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
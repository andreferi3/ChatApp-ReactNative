import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import firebase from 'firebase';
import User from '../../User';

export default class Chat extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null)
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            messageList: [],
            person: {
                uid: props.navigation.getParam('uid'),
                name: props.navigation.getParam('name'),
                avatar: props.navigation.getParam('avatar')
            },
            textMessage: ''
        }
    }

    componentWillMount() {
        firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).on('child_added', (value) => {
            this.setState((prevState) => {
                return {
                    messageList: [...prevState.messageList, value.val()]
                }
            })
        })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgId = firebase.database().ref('messages').child(User.uid).child(this.state.person.uid).push().key;
            let updates = {};
            let updateUserMessage = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            let receiverProfile = {
                uid: this.state.person.uid,
                name: this.state.person.name,
                avatar: this.state.person.avatar,
                time: firebase.database.ServerValue.TIMESTAMP,
                messageText: this.state.textMessage
            }

            let senderProfile = {
                uid: User.uid,
                name: User.name,
                avatar: User.avatar,
                time: firebase.database.ServerValue.TIMESTAMP,
                messageText: this.state.textMessage
            }
            updates['messages/' + User.uid + '/' + this.state.person.uid + '/' + msgId] = message;
            updates['messages/' + this.state.person.uid + '/' + User.uid + '/' + msgId] = message;
            firebase.database().ref().update(updates);
            updateUserMessage['users/' + User.uid + '/message/' + this.state.person.uid] = receiverProfile;
            updateUserMessage['users/' + this.state.person.uid + '/message/' + User.uid] = senderProfile;
            firebase.database().ref().update(updateUserMessage);
            this.setState({
                textMessage: ''
            })
        }
    }

    renderMessage = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
                borderRadius: 10,
                marginBottom: 10
            }}>
                <View style={{ flex: 5.2 }}>
                    <Text style={{ color: '#fff', padding: 10 }}>
                        {item.message}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start', paddingTop: 2, paddingRight: 10 }}>
                    <Text style={{ color: '#eee', padding: 3, fontSize: 10 }}>{this.convertTime(item.time)}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <React.Fragment>
                <FlatList
                    data={this.state.messageList}
                    ref="flatList"
                    onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
                    renderItem={this.renderMessage}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: 10, padding: 10, flex:1 }} />

                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 5, alignItems: 'center', margin: 10 }}>
                    <View style={{ flex: 4, borderWidth: 1, borderColor: '#2174DB', borderRadius: 20, paddingLeft: 15 }}>
                        <TextInput placeholder='Input message...' value={this.state.textMessage} onChangeText={this.handleChange('textMessage')} multiline={true} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.sendMessage} style={{ backgroundColor: '#2174DB', padding: 10, borderRadius: 50 }}>
                            <Image source={require('../assets/icon/right-arrow.png')} style={{width:25, height:25}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        )
    }
}
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
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone')
            },
            textMessage: ''
        }
    }

    componentWillMount() {
        firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).on('child_added', (value) => {
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
        if(c.getDay() !== d.getDay()) {
            result = d.getDay() + ' '  + d.getMonth() + ' ' + result;
        }
        return result;
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates['messages/' + User.phone + '/' + this.state.person.phone + '/' + msgId] = message;
            updates['messages/' + this.state.person.phone + '/' + User.phone + '/' + msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({
                textMessage: ''
            })
        }
    }

    renderMessage = ({item}) => {
        return (
            <View style={{
                flexDirection:'row',
                width:'60%',
                alignSelf:item.from===User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from===User.phone ? '#00897b' : '#7cb342',
                borderRadius:10,
                marginBottom:10
            }}>
                <View style={{flex:5.2}}>
                    <Text style={{color:'#fff', padding:10}}>
                        {item.message}
                    </Text>
                </View>
                <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-start', paddingTop:10, paddingRight:10}}>
                    <Text style={{color:'#eee', padding:3, fontSize:12}}>{this.convertTime(item.time)}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <React.Fragment>
                <FlatList
                    data={this.state.messageList}
                    renderItem={this.renderMessage}
                    keyExtractor={(item, index) => index.toString()}
                    style={{marginTop:10,padding:10}} />

                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 5, alignItems:'center', margin:10 }}>
                    <View style={{ flex: 4, borderWidth: 1, borderColor: '#2174DB', borderRadius: 20, paddingLeft: 15 }}>
                        <TextInput placeholder='Input message...' value={this.state.textMessage} onChangeText={this.handleChange('textMessage')} multiline={true} />
                    </View>
                    <View style={{ flex: 1, alignItems:'center'}}>
                        <TouchableOpacity onPress={this.sendMessage} style={{backgroundColor:'#2174DB', padding:10, borderRadius:50}}>
                            <Image source={require('../assets/icon/right-arrow.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </React.Fragment>
        )
    }
}
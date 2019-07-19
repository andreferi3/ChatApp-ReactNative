import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';

export default class FriendProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uid: this.props.navigation.state.params.uid,
            data: []
        }
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users/'+this.state.uid);
        dbRef.on('value', (val) => {
            let person = val.val();
            person.uid = val.key;
            this.setState((prevState) => {
                return {
                    data: [...prevState.data, person]
                }
            })
        })
    }

    render() {
        return (
            <React.Fragment>
                <ScrollView style={{ width: '100%', height: '100%'}}>
                    <View style={{flex:1}}>
                        <Image source={require('../assets/icon/pattern.png')} style={{width:'100%', height:180}} />
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Image source={{uri:this.state.data[0].avatar}} style={{width:130, height:130, borderRadius:100, marginTop:-70}} />
                        </View>
                    </View>
                    <View style={{flex:1.4, marginBottom:20}}>
                        <View style={{flex:1, padding:10}}>
                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                <Text style={{fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium' }}>{this.state.data[0].name}</Text>
                            </View>
                            <View style={{flexDirection:'row', marginTop:30}}>
                                <View style={{flex:1, alignItems:'center', borderRightWidth:0.8}}>
                                    <Text style={{fontSize:20, color: '#2e373c', fontFamily: 'sans-serif-medium'}}>17</Text>
                                    <Text style={{fontFamily:'sans-serif'}}>Same friend</Text>
                                </View>
                                <View style={{flex:1, alignItems:'center', borderRightWidth:0.8}}>
                                    <Text style={{fontSize:20, color: '#2e373c', fontFamily: 'sans-serif-medium'}}>20</Text>
                                    <Text style={{fontFamily:'sans-serif'}}>Like</Text>
                                </View>
                                <View style={{flex:1, alignItems:'center'}}>
                                    <Text style={{fontSize:20, color: '#2e373c', fontFamily: 'sans-serif-medium'}}>99</Text>
                                    <Text style={{fontFamily:'sans-serif'}}>Trip</Text>
                                </View>
                            </View>
                            <View style={{paddingHorizontal:27, marginTop:20}}>
                                <Text style={{fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium', borderBottomWidth:0.5 }}>About</Text>
                            </View>
                            <View style={{paddingHorizontal:27, marginTop:10}}>
                                <Text>{this.state.data[0].about}</Text>
                            </View>
                            <View style={{paddingHorizontal:27, marginTop:20}}>
                                <Text style={{fontSize: 24, color: '#2e373c', fontFamily: 'sans-serif-medium', borderBottomWidth:0.5 }}>Contact</Text>
                            </View>
                            <View style={{paddingHorizontal:27, marginTop:10}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image source={require('../assets/icon/call1.png')} style={{width:20, height:20}} />
                                    <Text style={{marginLeft:10, fontSize:16}}>:  {this.state.data[0].phone}</Text>
                                </View>
                                <View style={{flexDirection:'row', marginTop:15}}>
                                    <Image source={require('../assets/icon/mail.png')} style={{width:20, height:20}} />
                                    <Text style={{marginLeft:10, fontSize:16}}>:  {this.state.data[0].email}</Text>
                                </View>
                            </View>
                        </View>
                    </View>                    
                </ScrollView>
            </React.Fragment>
        )
    }
}
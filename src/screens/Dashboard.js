import React, {Component} from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import User from '../../User';

export default class Dashboard extends Component {

    constructor() {
        super()

        this.state = {
            
        }
    }

    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
            <React.Fragment>
                <View>
                    <Text>Berhasil Login</Text>
                    <Text>{User.phone}</Text>
                    <TouchableOpacity onPress={this.logout}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </React.Fragment>
        )
    }
}
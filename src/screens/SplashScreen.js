import React from 'react';
import { View, Image } from 'react-native';

class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('AuthLoading');
    }
  }

  render() {
    return (
      <View style={styles.viewStyles}>
        <Image source={require('../assets/icon/chatrobot.png')} style={{height:200, width:200}}/>
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  }
}

export default SplashScreen;
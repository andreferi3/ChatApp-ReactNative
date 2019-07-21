import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Dashboard from '../screens/Dashboard';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import Chat from '../screens/Chat';
import Profile from '../screens/Profile';
import Maps from '../screens/Maps';
import FriendProfile from '../screens/FriendProfile';
import SplashScreen from '../screens/SplashScreen';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({
  Home: {
    screen: Dashboard,
    navigationOptions: () => ({
      header: null,
    })
  },
  Chat: {
    screen: Chat
  },
  Profile: {
    screen: Profile
  },
  Maps: {
    screen: Maps
  },
  FriendProfile: {
    screen: FriendProfile
  }
}, {
  initialRouteName: 'Maps'
});
const AuthStack = createStackNavigator({ 
  Login: {
    screen: Login,
    navigationOptions: () => ({
      header: null,
    })
  }, 
  Register: {
    screen: Register,
    navigationOptions: () => ({
      header: null,
    })
  }
});

export default createAppContainer(createSwitchNavigator(
  {
    SplashScreen,
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'SplashScreen',
  }
));
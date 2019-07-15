import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Dashboard from '../screens/Dashboard';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ 
  Home: {
    screen: Dashboard,
    navigationOptions: () => ({
      header: null,
    })
  }
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
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
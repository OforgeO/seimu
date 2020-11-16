import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import Tutorial from '../screens/Tutorial';
import ForgotPassword from '../screens/ForgotPassword';

const screens = {
    Login: {
        screen : Login,
        name: "LoginScreen",
        key: Login
    },
    ForgotPassword: {
        screen : ForgotPassword
    },
    Signup: {
        screen : Signup
    },
    Home: {
        screen : Home
    },
    Tutorial: {
        screen : Tutorial,
        navigationOptions: {
            title: 'アプリの使い方',
            headerTitleStyle: {
                textAlign: 'center',
                flexGrow:1,
                alignSelf:'center',
            },
            headerStyle: {
                backgroundColor: '#004097',
            },
            headerTintColor: 'white',
        }
    },
};
const Stack = createStackNavigator(screens);

export default createAppContainer(Stack);

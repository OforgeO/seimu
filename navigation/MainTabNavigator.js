import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookScreen from '../screens/BookScreen';
import MenuScreen from '../screens/MenuScreen';
import NewsScreen from '../screens/NewsScreen';
import Policy from '../screens/Policy';
import Terms from '../screens/Terms';
import AddButton from './AddButton'
import MyCalendar from '../screens/MyCalendar';
import CreateTask from '../screens/CreateTask';
import WebSearch from '../screens/WebSearch';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import CloseAccount from '../screens/CloseAccount';
import PhoneCall from '../screens/PhoneCall';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
const defaultNavigationConfig = {
  defaultNavigationOptions: {
    headerTitleStyle: {
      textAlign: 'center',
      flexGrow:1,
      alignSelf:'center',
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTintColor: 'black',
  }
}

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    MyCalendar: MyCalendar,
    CreateTask: CreateTask,
    WebSearch: WebSearch,
    MenuScreen: MenuScreen,
    Policy: Policy,
    Terms: Terms,
    EditProfile: EditProfile,
    ChangePassword: ChangePassword,
    CloseAccount: CloseAccount
  },
  defaultNavigationConfig
);

HomeStack.navigationOptions = {
  tabBarLabel: '朩一ム',
  tabBarIcon: ({ focused }) => (
    <Image source={require('../assets/images/home.png')} style={{width: 30}} resizeMode="contain"/>
  ),
};


const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
  },
  defaultNavigationConfig
);

SearchStack.navigationOptions = {
  tabBarLabel: '物件検索',
  tabBarIcon: ({ focused }) => (
    <Image source={require('../assets/images/search.png')} style={{width: 22}} resizeMode="contain"/>
  ),
};

const BookStack = createStackNavigator(
  {
    Book : BookScreen,
  },
  defaultNavigationConfig
);

BookStack.navigationOptions = {
  tabBarLabel: ' ',
  tabBarIcon:  ({focused}) => (
    <AddButton focused={focused} />
  ),
};

const NewStack = createStackNavigator(
  {
    News: NewsScreen,
  },
  defaultNavigationConfig
);

NewStack.navigationOptions = {
  tabBarLabel: '新規物件情報',
  tabBarIcon: ({ focused }) => (
    <Image source={require('../assets/images/newinfo.png')} style={{width: 22}} resizeMode="contain"/>
  ),
};

const MenuStack = createStackNavigator(
  {
    /*Menu: MenuScreen,
    Policy: Policy,
    Terms: Terms,
    EditProfile: EditProfile,
    ChangePassword: ChangePassword,
    CloseAccount: CloseAccount,*/
    Menu: PhoneCall

  },
  defaultNavigationConfig
);

MenuStack.navigationOptions = {
  tabBarLabel: '電話する',
  tabBarIcon: ({ focused }) => (
    <Image source={require('../assets/images/phone-call.png')} style={{width: 22}} resizeMode="contain"/>
  ),
  
};



const tabNavigator = createBottomTabNavigator({
  HomeStack,
  SearchStack,
  BookStack,
  NewStack,
  MenuStack,
},
{
  tabBarOptions: {
    showLabel: true, // hide labels
    activeTintColor: 'white', // active icon color
    inactiveTintColor: '#fff',  // inactive icon color
    style: {
        backgroundColor: '#004097', // TabBar background,
    }
  }
});

tabNavigator.path = '';

export default tabNavigator;

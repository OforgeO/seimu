import React from 'react';
import { SimpleLineIcons, EvilIcons, Octicons, Feather } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome";
import Variables from '../constants/Variables';

export default function TabBarIcon(props) {
  if(props.type == 'evli'){
    return (
      <EvilIcons
        name={props.name}
        size={26}
        style={{ marginBottom: -3}}
        color={props.focused ? Variables.tabIconSelected : Variables.tabIconDefault}
      />
    );
  }else if(props.type == 'oct'){
    return (
      <Octicons
        name={props.name}
        size={26}
        style={{ marginBottom: -3}}
        color={props.focused ? Variables.tabIconSelected : Variables.tabIconDefault}
      />
    );
  }
  else if(props.type == 'simple'){
    return (
      <SimpleLineIcons
        name={props.name}
        size={26}
        style={{ marginBottom: -3}}
        color={props.focused ? Variables.tabIconSelected : Variables.tabIconDefault}
      />
    );
  }else if(props.type == 'feather'){
    return (
      <Feather
        name={props.name}
        size={26}
        style={{ marginBottom: -3}}
        color={props.focused ? Variables.tabIconSelected : Variables.tabIconDefault}
      />
    );
  }else{
    return (
      <Icon
          name={props.name}
          size={26}
          style={{ marginBottom: -3 }}
          color={props.focused ? Variables.tabIconSelected : Variables.tabIconDefault}
        />
    );
  }
  
}

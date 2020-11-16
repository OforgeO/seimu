import React, {Component} from 'react';
import {View, Text, Image} from "react-native";
import Icon from '@expo/vector-icons/FontAwesome';
import Variables from '../constants/Variables';
const SIZE = 80;
export default class AddButton extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
        };
    }
    toggleView = () => {
        //this.props.navigation.navigate('Book');
    };
    render() {
        return (
            <View style={{
                position: 'absolute',
                alignItems: 'center',
                zIndex: 0
            }}>
                <View
                    underlayColor="#2882D8"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE,
                        height: SIZE,
                        borderRadius: SIZE / 2,
                        borderWidth: 5,
                        borderColor: '#004097',
                        backgroundColor: '#002352',
                        marginBottom: 4
                    }}
                >
                    <View style={{alignItems: 'center'}}>
                        <Image source={require('../assets/images/book.png')} style={{width: 22, marginBottom: 20}} resizeMode={"contain"}/>
                        <Text style={{color: 'white', fontSize: 12, position: 'absolute', bottom: 10}}>来店予約</Text>
                    </View>
                </View>
            </View>
        );
    }
}
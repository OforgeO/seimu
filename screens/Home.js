import React from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';
import AppNavigator from '../navigation/AppNavigator';
import Popup from './Popup';
import ChatTool from './ChatTool';


export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            event:[],
        }
    }
    componentDidMount(){
        
        this.getPopup();
        setInterval(() => {
            this.getPopup();
        }, 110000);
    }
    renderPopups(){
        return this.state.event.map((ev) => {
            return <Popup key={ev}/>
        })
    }
    getPopup(){
        var t = new Date().getTime();
        //console.log(t);
        this.setState({event : [...this.state.event, t]})
        
    }
    render(){
        return (
            <View style={styles.container}>
                <AppNavigator/>
                <ChatTool />
                {this.renderPopups()}
            </View>
        );
    }
}
Home.navigationOptions = {
    header: null,
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});
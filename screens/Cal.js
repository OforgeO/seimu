import React  from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

export default class Cal extends React.Component {    
    constructor(props){
        super(props);
        this.state = {};
    }

    toggleModal(){
      this.props.data.navigate('MyCalendar');
    }

    render(){
      return (
        <TouchableOpacity onPress={() => this.toggleModal()} style={styles.calendar}>
          <View>
              <Image source={require('../assets/images/calendar.png')} style={{width: 22, height: 20}} />
          </View>
        </TouchableOpacity>
      );
    }
}

const styles = StyleSheet.create({
    calendar: {
        backgroundColor: '#01b901',
        borderRadius: 25,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 20,
        left: 10, 
        justifyContent: "center",
        alignItems:"center"
    },
});

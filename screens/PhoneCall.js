import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  Linking,
  Image
} from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import Cal from './Cal';
import { ScrollView } from 'react-native-gesture-handler';


export default class PhoneCall extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: '',
            password: '',
            userErr: false,
            pwdErr: false
        };
    }

    phoneCall(phone_number){
      Linking.openURL(`tel:${phone_number}`)
    }

    policy(){
      this.props.navigation.navigate('Policy');
    }

    terms(){
      this.props.navigation.navigate('Terms');
    }

    editProfile(){
      this.props.navigation.navigate('EditProfile');
    }
    
    render(){
        return (
            <View style={styles.container}>
              <ScrollView>
                <View style={styles.callSection}>
                  
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>鶴見本店</Text>
                  </View>
                  <View>
                    <TouchableHighlight
                      style={[styles.submit, {backgroundColor: '#eb9392', paddingTop: 14, paddingBottom: 14}]}
                      onPress={() => this.phoneCall('0120-060-716')}>
                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                          <Image source={require("../assets/images/phone-call.png")} style={{width: 18, height: 18}} />
                          <Text style={[styles.submitText, {fontWeight: 'bold', paddingLeft: 15, fontSize: 20}]}>0120-060-716</Text>
                          <SimpleLineIcons name="arrow-right" size={14} color="white" style={{position: 'absolute', right: 20}} />
                        </View>
                    </TouchableHighlight>
                  </View>
                  <View style={{alignItems: 'center', marginTop: 20}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>大阪北店(高槻)</Text>
                  </View>
                  
                  <View>
                    <TouchableHighlight style={[styles.submit, {backgroundColor: '#fcaa84', paddingTop: 14, paddingBottom: 14}]} onPress={() => this.phoneCall('0120-090-716')} underlayColor='#fff'>
                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                          <Image source={require("../assets/images/phone-call.png")} style={{width: 18, height: 18}} />
                          <Text style={[styles.submitText, {fontWeight: 'bold', paddingLeft: 15, fontSize: 20}]}>0120-090-716</Text>
                          <SimpleLineIcons name="arrow-right" size={14} color="white" style={{position: 'absolute', right: 20}} />
                        </View>
                    </TouchableHighlight>
                  </View>
                  <View style={{alignItems: 'center', marginTop: 20}}>
                    <Text>営業時間　9:30～20:00 </Text>
                    <Text>水曜日定休</Text>
                  </View>
                </View>
                
                <View style={{height: 80}}>

                </View>
              
              </ScrollView>
              <Cal data={this.props.navigation} />
              
            </View>
        );
    }
    
}

PhoneCall.navigationOptions = {
  title: '電話をかける',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  callSection: {
    padding: 10,
    paddingTop: 25
  },
  termsSection: {
    justifyContent: "center",
    paddingLeft: 10
  },
  submit:{
    marginBottom:10,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:30,
  },
  submitText:{
      color:'#fff',
      textAlign:'center',
  }
});

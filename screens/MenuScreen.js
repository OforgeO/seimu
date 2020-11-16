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


export default class MenuScreen extends React.Component {
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
                  <View>
                    <Text style={{color:'#acacac', paddingBottom: 7}}>運営会社</Text>
                    <Text style={{fontWeight: 'bold',fontSize: 20, paddingBottom: 5}}>株式会社SEIMU</Text>
                    <Text style={{fontSize: 12}}>〒538-0035大阪府大阪巿鶴見区浜4丁目18-14</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 13, paddingBottom: 13, borderBottomWidth: 1,borderBottomColor: '#acacac' }}>
                    <SimpleLineIcons name="arrow-right" size={14} color="#acacac"/>
                    <Text> 会社概要</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20, paddingBottom:12}}>
                    <Text style={{color: '#acacac'}}>お電話でのお問い合わせ   </Text>
                    <Text style={{fontSize: 10}}>営業時問 : 9:30~20:00  </Text>
                    <Text style={{fontSize: 10}}>定休日 : 水曜曰</Text>
                  </View>
                  <View>
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
                  <View>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>大阪北店(高槻)</Text>
                  </View>
                  <View>
                    <TouchableHighlight
                      style={[styles.submit, {backgroundColor: '#fcaa84', paddingTop: 14, paddingBottom: 14}]}
                      onPress={() => this.phoneCall('0120-090-716')}
                      underlayColor='#fff'>
                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center'}}>
                          <Image source={require("../assets/images/phone-call.png")} style={{width: 18, height: 18}} />
                          <Text style={[styles.submitText, {fontWeight: 'bold', paddingLeft: 15, fontSize: 20}]}>0120-090-716</Text>
                          <SimpleLineIcons name="arrow-right" size={14} color="white" style={{position: 'absolute', right: 20}} />
                        </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={[styles.termsSection, {borderTopColor: '#acacac', borderTopWidth: 1, paddingTop: 15, paddingBottom: 15}]}>
                  <TouchableOpacity onPress={() => this.editProfile()}>
                    <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                      <Text style={{color: '#5a5a5a'}}>マイページ</Text>
                      <SimpleLineIcons name="arrow-right" size={18} color="#acacac" style={{paddingRight: 15, color: '#acacac', fontWeight: 300}}/>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.termsSection, {borderTopColor: '#acacac', borderTopWidth: 1, paddingTop: 15, paddingBottom: 15}]}>
                  <TouchableOpacity onPress={() => this.policy()}>
                    <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                      <Text style={{color: '#5a5a5a'}}>プライバシーポリシー</Text>
                      <SimpleLineIcons name="arrow-right" size={18} color="#acacac" style={{paddingRight: 15, color: '#acacac', fontWeight: 300}}/>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.termsSection, {borderColor: '#acacac', borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 15, paddingBottom: 15}]}>
                  <TouchableOpacity onPress={() => this.terms()}>
                    <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
                      <Text style={{color: '#5a5a5a'}}>利用規約</Text>
                      <SimpleLineIcons name="arrow-right" size={18} color="#acacac" style={{paddingRight: 15, color: '#acacac', fontWeight: 300}}/>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{height: 80}}>

                </View>
              
              </ScrollView>
              <Cal data={this.props.navigation} />
              
            </View>
        );
    }
    
}

MenuScreen.navigationOptions = {
  title: 'メニュー',
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

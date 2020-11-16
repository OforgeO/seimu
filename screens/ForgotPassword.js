import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { showToast } from '../components/Global';
import { forgotPwd } from '../components/Api';
import Icon from "react-native-vector-icons/FontAwesome";

export default class ForgotPassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            email: '',
        };
    }

    send(){
        this.setState({loaded: false});
        forgotPwd(this.state.email)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false){
                showToast('メールが存在しません!');
                return;
            } else{
                this.props.navigation.goBack();
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }
    
    render(){
        return (
        
            <View style={styles.container}>
                <View>
                    <Text style={{fontSize: 18}}>メールアドレスを入力してください</Text>
                </View>
                <View style={{marginTop: 30}}>
                    <TextInput 
                        style={styles.editInput}
                        returnKeyType="next"
                        autoCapitalize="none"
                        keyboardType={'email-address'}
                        onChangeText={val=>this.setState({email : val})}
                        onSubmitEditing={() => this.send()}
                        placeholder='example@seimu.com'
                    />
                </View>
                
                <TouchableOpacity onPress={() => {this.send()}}>
                    <View style={styles.pwdBorder}>
                        <Text style={{color: 'black', fontSize: 20}}>送る</Text>
                        <Icon name={'chevron-right'} size={18} style={{color: '#f2aead', fontWeight: 300, position: 'absolute', right: 20}} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    
}

ForgotPassword.navigationOptions = {
    title: 'ID/パスワードをお忘れの方は',
    headerRight: <View></View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  pwdBorder: {
    borderRadius: 30,
    borderColor: '#f2aead',
    borderWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'center'
  },
  editInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    fontSize: 18,
    marginBottom: 10
  },
});

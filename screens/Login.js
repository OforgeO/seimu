import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  AsyncStorage,
  KeyboardAvoidingView
} from 'react-native';
import { showToast } from '../components/Global';
import { signIn } from '../components/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { SimpleLineIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: '',
            password: '',
            userErr: false,
            pwdErr: false,
            loaded: true
        };
    }
    componentDidMount(){
        
    }
    async signup(){
        await SecureStore.setItemAsync('socket', '1')
        this.props.navigation.push('Signup');
    }
    forgot(){
        this.props.navigation.push('ForgotPassword');
    }
    loginUser(){
        if(this.state.userId != '' && this.state.password != ''){
            this.setState({loaded: false});
            signIn(this.state.userId, this.state.password)
            .then(async (response) => {
                if(response.data == false){
                    this.setState({loaded: true});
                    showToast('ログインに失敗しました!');
                    return;
                } else{
                    await AsyncStorage.setItem('user', JSON.stringify(response.data[0]));
                    this.props.navigation.replace('Home');
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }else{
            if(this.state.userId == '')
                this.setState({userErr: true})
            else
                this.setState({userErr: false})
            if(this.state.password == '')
                this.setState({pwdErr: true})
            else
                this.setState({pwdErr: false})
        }
        
    }
    render(){
        return (
        
            <View style={styles.container}>
                <KeyboardAvoidingView bebehavior="padding"  style={styles.container}>
                    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                        <View style={styles.logoContainer}>
                            <Image
                                style={styles.logo}
                                source={require('../assets/images/logo.png')} />
                            <Text style={styles.labelText}>ユーザーID</Text>
                            <TextInput 
                                placeholder="ユーザーID"
                                placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                returnKeyType="next"
                                autoCapitalize="none"
                                keyboardType='email-address'
                                autoCorrect={false}
                                style={this.state.userErr? [styles.input, styles.invalid] : [styles.input]} 
                                onChangeText={userId=>this.setState({userId})}
                                onSubmitEditing={() => this.txtPwd.focus()}
                                />
                            <Text style={styles.labelText}>パスワード</Text>
                            <TextInput 
                                placeholder="パスワード"
                                placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                secureTextEntry
                                returnKeyType="go"
                                autoCapitalize="none"
                                style={this.state.pwdErr? [styles.input, styles.invalid] : [styles.input]} 
                                ref={ref => {this.txtPwd = ref;}}
                                onChangeText={password=>this.setState({password})}
                                onSubmitEditing={() => this.loginUser()}
                                />
                            
                            <View style={{width: "80%"}}>
                                <View style={{borderRadius: 30, overflow: 'hidden'}}>
                                    <TouchableOpacity onPress={() => this.loginUser()} style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={[styles.btnText, {backgroundColor:'#004097'}]}>ログイン </Text>
                                        <SimpleLineIcons name={'arrow-right'} color={'white'} style={{position: 'absolute', right: 25}}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height: 20}}></View>
                                <View style={{borderRadius: 30, overflow: 'hidden'}}>
                                    <TouchableOpacity onPress={() => this.signup()} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
                                        <Text style={[styles.btnText, {backgroundColor:'#0058ce'}]}>新規会員登録</Text>
                                        <SimpleLineIcons name={'arrow-right'} color={'white'} style={{position: 'absolute', right: 25}}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height: 20}}></View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{color: 'black'}}>ID/パスワードをお忘れの方は</Text>
                                    <TouchableOpacity onPress={() => { this.forgot();} }>
                                        <Text style={{color: 'black', textDecorationLine:'underline'}}>こちら</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{position: 'absolute', bottom: 20, fontSize: 11}}>Copyright(c) 株式会社SEIMU All Rights Reserved</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Login.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
      marginBottom: 20
  },
  logoContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  formContainer: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 40,
      paddingRight: 40
  },
  input: {
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.4 )',
      marginBottom: 20,
      paddingHorizontal: 10,
      borderColor: '#bcbcbc',
      borderWidth: 1,
      width: "80%"
  },
  btnText: {
      backgroundColor: '#000',
      padding: 15,
      width: "100%",
      borderRadius: 30,
      color: '#fff',
      textAlign: 'center',
  },
  labelText: {
      paddingBottom: 10,
      width: "80%",
      textAlign: "left"
  },
  invalid: {
    borderWidth: 1,
    borderColor: 'red'
  }
});

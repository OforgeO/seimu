import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput
} from 'react-native';
import Cal from './Cal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { changePwd } from '../components/Api';
import { showToast } from '../components/Global';

export default class ChangePassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user_info:[],
            visible: false,
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
            oldPwdErr: false,
            newPwdErr: false
        };
    }

    async componentDidMount(){
        const userInfo = JSON.parse(await AsyncStorage.getItem('user'));
        this.setState({user_info: userInfo})
    }

    changePwd(){
        if(this.state.oldPwd == ''){
            this.state.oldPwdErr = true;
            this.setState({oldPwdErr: true})
        }else{
            this.state.oldPwdErr = false;
            this.setState({oldPwdErr: false})
        }
        if(this.state.newPwd == '' || this.state.confirmPwd == '' || this.state.newPwd != this.state.confirmPwd){
            this.state.newPwdErr = true;
            this.setState({newPwdErr: true})
        }else{
            this.state.newPwdErr = false;
            this.setState({newPwdErr: false})
        }
        if(this.state.oldPwdErr == false && this.state.newPwdErr == false){
            this.setState({visible: true})
            changePwd(this.state.user_info.user_id, this.state.oldPwd, this.state.newPwd)
            .then((response) => {
                this.setState({visible: false});
                if(response.data == false){
                    showToast('パスワードの変更に失敗しました！');
                    return;
                } else{
                    this.props.navigation.goBack();
                }
            })
            .catch((error) => {
                this.setState({visible: false});
                showToast();
            });
        }
    }
    
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.infoSection}>
                    <View>
                        <View style={styles.pb}>
                            <Text style={{color: '#ccc'}}>以前のパスワード</Text>
                        </View>
                        <View>
                            <TextInput style={this.state.oldPwdErr? [styles.editInput, styles.err]: [styles.editInput]} 
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                ref={ref => {this.txtPwd = ref;}}
                                onChangeText={val=>this.setState({oldPwd: val})}
                                onSubmitEditing={() => this.newPwd.focus()}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={styles.pb}>
                            <Text style={{color: '#ccc'}}>新しいパスワード</Text>
                        </View>
                        <View>
                            <TextInput style={this.state.newPwdErr? [styles.editInput, styles.err]: [styles.editInput]} 
                                returnKeyType="next"
                                autoCapitalize="none"
                                secureTextEntry
                                ref={ref => {this.newPwd = ref;}}
                                onChangeText={val=>this.setState({newPwd: val})}
                                onSubmitEditing={() => this.confirmPwd.focus()}></TextInput>
                        </View>
                    </View>
                    <View>
                        <View style={styles.pb}>
                            <Text style={{color: '#ccc'}}>パスワードを認証する</Text>
                        </View>
                        <View>
                            <TextInput style={this.state.newPwdErr? [styles.editInput, styles.err]: [styles.editInput]} 
                                returnKeyType="go"
                                autoCapitalize="none"
                                secureTextEntry
                                ref={ref => {this.confirmPwd = ref;}}
                                onChangeText={val=>this.setState({confirmPwd: val})}
                                onSubmitEditing={() => this.changePwd()}></TextInput>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.changePwd()}>
                        <View style={styles.pwdBorder}>
                            <Text style={{color: '#f2aead', fontSize: 16}}>パスワードを変更する</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 70}}></View>
              
                <Cal data={this.props.navigation} />
                
                <Spinner_bar color={'#27cccd'} visible={this.state.visible} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

ChangePassword.navigationOptions = {
  title: 'パスワードを変更',
  headerRight: <View></View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pb:{
      paddingBottom: 8
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
  infoSection: {
      padding: 20
  },
  editInput: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingBottom: 10,
      fontSize: 18,
      marginBottom: 10
  },
  err: {
    borderBottomWidth: 1,
    borderColor: 'red'
  }
});

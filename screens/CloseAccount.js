import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { closeAccount } from '../components/Api';
import { showToast } from '../components/Global';


export default class CloseAccount extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user_info:[],
            reason: '',
            visible: false,
        };
    }

    async componentDidMount(){
        
        const userInfo = JSON.parse(await AsyncStorage.getItem('user'));
        this.setState({user_info: userInfo})
    }

    closeAccount(){
        this.setState({visible: true})
        closeAccount(this.state.user_info.id, this.state.reason)
        .then(async (response) => {
            await AsyncStorage.setItem('user', '');
            this.setState({visible: false});
            this.props.navigation.replace('Login');
        })
        .catch((error) => {
            this.setState({visible: false});
            showToast();
        });
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.infoSection}>
                    <View>
                        <View style={styles.pb}>
                            <Text style={{color: '#ccc'}}>閉鎖の理由</Text>
                        </View>
                        <View>
                            <TextInput style={[styles.editInput,{height: 100}]} 
                                returnKeyType="go"
                                multiline
                                numberOfLines={5}
                                onChangeText={val=>this.setState({reason: val})}
                                
                            />
                        </View>
                    </View>
                    
                    <TouchableOpacity onPress={() => this.closeAccount()}>
                        <View style={styles.pwdBorder}>
                            <Text style={{color: '#f2aead', fontSize: 16}}>アカウントを閉じる</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 70}}></View>
                <Spinner_bar color={'#27cccd'} visible={this.state.visible} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

CloseAccount.navigationOptions = {
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
});

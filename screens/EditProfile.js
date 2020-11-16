import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Cal from './Cal';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { editProfile } from '../components/Api';
import { showToast } from '../components/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

export default class EditProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user_info:[],
            main_addr: '',
            loaded: true
        };
    }

    async componentDidMount(){
        const userInfo = JSON.parse(await AsyncStorage.getItem('user'));
        console.log(userInfo)
        this.setState({user_info: userInfo})
        this.setState({main_addr : userInfo['often_use_phone']})
    }

    changePwd(){
        this.props.navigation.navigate('ChangePassword');
    }

    closeAccount(){
        this.props.navigation.navigate('CloseAccount');
    }

    editProfile(){
        this.setState({loaded: false});
        editProfile(this.state.user_info)
        .then(async (response) => {
            this.setState({loaded: true});
            if(response.data == false){
                showToast('プロファイルの編集に失敗しました！');
                return;
            } else{
                const tempUser = this.state.user_info;
                await AsyncStorage.setItem('user', JSON.stringify(this.state.user_info));
                this.setState({user_info: tempUser})
                showToast("登録情報を変更しました", "success");
            }
        })
        .catch((error) => {
            this.setState({loaded: true});
            showToast();
        });
    }

    changeVal(key, val){
        this.state.user_info[key] = val;
        if(key == 'email')
            this.state.user_info['user_id'] = val;
        if(key == 'often_use_phone')
            this.setState({main_addr : val})
    }
    
    render(){
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                    <View style={{flex:1}}>
                        <KeyboardAvoidingView behavior="padding">
                           <ScrollView>
                                <View style={styles.idPart}>
                                    <Text style={[styles.pb, {color: '#ccc'}]}>ユーザーID</Text>
                                    <Text style={styles.pb, {fontSize: 18}}>{this.state.user_info.user_id}</Text>
                                    <TouchableOpacity onPress={() => this.changePwd()}>
                                        <View style={styles.pwdBorder}>
                                            <Text style={{color: '#f2aead', fontSize: 16}}>パスワードを変更する</Text>
                                            <Icon name={'chevron-right'} size={18} style={{color: '#f2aead', fontWeight: 300, position: 'absolute', right: 20}} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.closeAccount()}>
                                        <View style={styles.pwdBorder}>
                                            <Text style={{color: '#f2aead', fontSize: 16}}>アカウントを閉じる</Text>
                                            <Icon name={'chevron-right'} size={18} style={{color: '#f2aead', fontWeight: 300, position: 'absolute', right: 20}} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                
                
                                <View style={styles.infoSection}>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>お名前</Text>
                                        </View>
                                        
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.name+"　"+this.state.user_info.name1} 
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                onChangeText={val=>this.changeVal('name',val)}
                                                onSubmitEditing={() => this.unamekata.focus()}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>フリガナ</Text>
                                        </View>
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.name_kata+"　"+this.state.user_info.name_kata1}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.unamekata = ref;}}
                                                onChangeText={val=>this.changeVal('name_kata',val)}
                                                onSubmitEditing={() => this.postcode.focus()}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>住所</Text>
                                        </View>
                                        <View>
                                            {
                                                this.state.user_info.postcode != undefined && this.state.user_info.postcode.includes("〒") ?
                                                <TextInput 
                                                    style={[styles.editInput,{borderBottomWidth: 0}]}
                                                    defaultValue={this.state.user_info.postcode}
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    ref={ref => {this.postcode = ref;}}
                                                    onChangeText={val=>this.changeVal('postcode',val)}
                                                    onSubmitEditing={() => this.postAddr.focus()}
                                                />
                                                :
                                                <TextInput 
                                                    style={[styles.editInput,{borderBottomWidth: 0}]}
                                                    defaultValue={"〒"+this.state.user_info.postcode}
                                                    returnKeyType="next"
                                                    autoCapitalize="none"
                                                    ref={ref => {this.postcode = ref;}}
                                                    onChangeText={val=>this.changeVal('postcode',val)}
                                                    onSubmitEditing={() => this.postAddr.focus()}
                                                />
                                            }
                                            
                                        </View>
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.postAddr}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.postAddr = ref;}}
                                                onChangeText={val=>this.changeVal('postAddr',val)}
                                                onSubmitEditing={() => this.birth.focus()}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>生年月日</Text>
                                        </View>
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.birth}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.birth = ref;}}
                                                onChangeText={val=>this.changeVal('birth',val)}
                                                onSubmitEditing={() => this.phone1.focus()}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>携帯番号</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', display:'flex', alignItems:'center'}}>
                                            <TextInput 
                                                style={[styles.editInput, styles.phoneInput]}
                                                keyboardType={'numeric'}
                                                defaultValue={this.state.user_info.phone_1}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.phone1 = ref;}}
                                                onChangeText={val=>this.changeVal('phone_1',val)}
                                                onSubmitEditing={() => this.home_phone.focus()}
                                            />
                                            <Text style={{marginBottom: 10, paddingBottom: 10}}>&nbsp;-&nbsp;</Text>
                                            <TextInput 
                                                style={[styles.editInput, styles.phoneInput]}
                                                keyboardType={'numeric'}
                                                defaultValue={this.state.user_info.phone_2}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.phone1 = ref;}}
                                                onChangeText={val=>this.changeVal('phone_2',val)}
                                                onSubmitEditing={() => this.home_phone.focus()}
                                            />
                                            <Text style={{marginBottom: 10, paddingBottom: 10}}>&nbsp;-&nbsp;</Text>
                                            <TextInput 
                                                style={[styles.editInput, styles.phoneInput]}
                                                keyboardType={'numeric'}
                                                defaultValue={this.state.user_info.phone_3}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.phone1 = ref;}}
                                                onChangeText={val=>this.changeVal('phone_3',val)}
                                                onSubmitEditing={() => this.home_phone.focus()}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>自宅番号</Text>
                                        </View>
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.home_phone}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.home_phone = ref;}}
                                                onChangeText={val=>this.changeVal('home_phone',val)}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>希望お電話先</Text>
                                        </View>
                                        <View>
                                            <RNPickerSelect
                                                placeholder={{}}
                                                value={this.state.main_addr}
                                                style={picker}
                                                ref={ref => {this.often_use_phone = ref;}}
                                                onValueChange={(value) => {this.changeVal('often_use_phone', value);}}
                                                items={[
                                                    { label: '携帯電話', value: 0 },
                                                    { label: 'ご自宅', value: 1 },
                                                ]}
                                                Icon={() => {
                                                    return <Ionicons name="md-arrow-down" size={24} color="gray" />;
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.pb}>
                                            <Text style={{color: '#ccc'}}>メールアドレス</Text>
                                        </View>
                                        <View>
                                            <TextInput 
                                                style={styles.editInput}
                                                defaultValue={this.state.user_info.email}
                                                returnKeyType="next"
                                                autoCapitalize="none"
                                                ref={ref => {this.email = ref;}}
                                                onChangeText={val=>this.changeVal('email',val)}  
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => this.editProfile()}>
                                        <View style={styles.pwdBorder}>
                                            <Text style={{color: '#f2aead', fontSize: 16}}>登録情報を変更する</Text>
                                            <Icon name={'chevron-right'} size={18} style={{color: '#f2aead', fontWeight: 300, position: 'absolute', right: 20}} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                
                
                                <View style={{height: 70}}></View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                        <Cal data={this.props.navigation} />
                        
                        <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
    
}

EditProfile.navigationOptions = {
  title: 'マイページ',
  headerRight: <View></View>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  idPart:{
      borderBottomWidth: 1,
      borderColor: '#cccccc',
      padding: 20,
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
      flex: 1,
      flexDirection: 'row',
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
  
  phoneInput: {
      width: '30%'
  }
});
var picker = StyleSheet.create({
    inputIOS: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
        fontSize: 18,
        marginBottom: 10
    },
    inputAndroid: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
        fontSize: 18,
        marginBottom: 10
    },
})
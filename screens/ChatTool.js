import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Easing,
  Dimensions,
  Animated
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import io from "socket.io-client";
import Variables from '../constants/Variables';
import { getQAList, sendMsg } from '../components/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';
import Hyperlink from 'react-native-hyperlink'
import Constants from "expo-constants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const SOCKET_URL = Variables.serverAddr+':5011';
const qas = [[],[],[],[],[]];
const qaList = [[],[],[],[],[]];
const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 0
const offset = Platform.OS === 'ios' ? 0 : 20;
let userInfo = []
export default class ChatTool extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            property: [],
            socket: [],
            msgShow: false,
            msgContent: '',
            userInfo : [],
            loaded: true,
            admin_token: '',
            footerHeight : 0
        };
    }
    async componentDidMount() {
        if(Platform.OS == 'ios' && Expo.Constants.platform.ios.model.toLowerCase().includes("iphone x")){
            this.setState({footerHeight : 25});
        }
        this.state.socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        this.state.socket.on('connect', () => {
            setTimeout(() => {
                var index = -2;
                var title = '';
                var key = new Date().getTime();
                this.setState({property: [...this.state.property, {index, key, title }]})
            }, 1500);
        });
        this.state.socket.on('chat_message', data => {
            let result = JSON.parse(data);
            if(result.dir == 0 && result.is_initial == 0 && result.is_finish == 0 && result.text == ''){
                if(result.admin_token != ''){
                    this.setState({admin_token : result.admin_token});
                }
                this.setState({msgShow: true});
            }else if(result.dir == 0 && result.is_initial == 0 && result.is_finish == 0 && result.text != ''){
                var index = -4;
                var title = result.text;
                var key = result.key;
                var admin_name = result.admin_name;
                var avatar = result.admin_avatar_link
                this.setState({property: [...this.state.property, {index, key, title, admin_name, avatar}]});
            }else if(result.dir == 1 && result.is_initial == 0 && result.is_finish == 0 && result.text != ''){
                var index = -3;
                var title = this.state.msgContent;
                var key = result.key;
                this.setState({property: [...this.state.property, {index, key, title}]});
            }else if(result.is_finish == 1){
                this.setState({msgShow: false});
                var index = -2;
                var title = '';
                var key = new Date().getTime();
                this.setState({property: [...this.state.property, {index, key, title }]})
            }
        })

        userInfo = JSON.parse(await AsyncStorage.getItem('user'));
        this.setState({userInfo : userInfo});

        this.state.socket.on('QA info', data => {
            var choose_qa = data.res.data;
            var index = -1;
            var title = '';
            var key = data.res.key;
            this.setState({property: [...this.state.property, {index, key, title, choose_qa}]});
            setTimeout(() => {
                var index = -2;
                var title = '';
                var key = data.res.key1;
                this.setState({property: [...this.state.property, {index, key, title }]})
            }, 1500);
        });
        
        getQAList(this.state.userId, this.state.password)
        .then((response) => {
            response.data.map((item) => {
                if(item.category == 1){
                    qas[0].push(item.question);
                    qaList[0].push(item);
                }
                if(item.category == 2){
                    qas[1].push(item.question);
                    qaList[1].push(item);
                }
                if(item.category == 3){
                    qas[2].push(item.question);
                    qaList[2].push(item);
                }
                if(item.category == 4){
                    qas[3].push(item.question);
                    qaList[3].push(item);
                }
                if(item.category == 5){
                    qas[4].push(item.question);
                    qaList[4].push(item);
                }
            })
        });
    }

    toggleModal(){
        this.setState({visible: true});
    }

    closeModal(){
        this.setState({visible: false});
    }

    property(index, title){
        if(!this.state.msgShow){
            if(index < 5){
                var key = Math.floor(Math.random() * Math.floor(1000000));
                var choose_qa = [];
                this.setState({property: [...this.state.property, {index, key, title, choose_qa }]});
            }else {
                var key = Math.floor(Math.random() * Math.floor(1000000));
                var title = 'お待ちください';
                var index = -6;
                this.setState({property: [...this.state.property, {index, key, title }]})
                var obj = {
                    admin_token: '',
                    user_id : this.state.userInfo.id,
                    text: '',
                    dir: 1,
                    is_initial: 1,
                    username: this.state.userInfo.name,
                    is_finish: 0
                }
                //this.setState({msgShow: true})
                sendMsg(obj)
                .then((response) => {
                })
                .catch((error) => {
                    showToast();
                });
            }        
        }
    }

    renderQAs(type){
        return this.state.property.map((val) => {
            if(val['index'] ==  -2){
                return <View key={val['key']} style={{marginTop: 10}}>
                        <View style={{flexDirection: 'row', paddingBottom: 10}}>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnLeft]}>
                                <TouchableOpacity onPress={() => this.property(0,'物件を探している')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>物件をさがしている</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnRight]}>
                                <TouchableOpacity onPress={() => this.property(1, '家を売りたい')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>家を売りたい</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', paddingBottom: 10}}>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnLeft]}>
                                <TouchableOpacity onPress={() => this.property(2, 'お金についての相談')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>お金についての相談</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnRight]}>
                                <TouchableOpacity onPress={() => this.property(3, '店舗についての質問')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>店舗についての質問</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnLeft]}>
                                <TouchableOpacity onPress={() => this.property(4, 'その他の質問・相談')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>その他の質問・相談</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.chatToolBtn, styles.chatToolBtnRight]}>
                                <TouchableOpacity onPress={() => this.property(5, '相談')}>
                                    <View style={styles.chatToolBtnSec}>
                                        <Text style={{color: 'white', fontWeight: 'bold'}}>相談</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            } else if(val['index'] == -3 || val['index'] == -6){
                return <QAs key={val['key']} data={val['index']} title={val['title']} socket={this.state.socket}/>
            }else if(val['index'] == -4){
                return <QAs key={val['key']} data={val['index']} title={val['title']} socket={this.state.socket} admin_name={val['admin_name']} avatar={val['avatar']}/>
            }else{
                return <QAs key={val['key']} data={val['index']} title={val['title']} socket={this.state.socket} choose_qa={val['choose_qa']} />
            }
        })   
    }

    sendMsg(){
        var obj = {
            admin_token: this.state.admin_token,
            user_id : this.state.userInfo.id,
            text: this.state.msgContent,
            dir: 1,
            is_initial: 0,
            username: this.state.userInfo.name,
            is_finish: 0
        }
        
        sendMsg(obj)
        .then((response) => {
            this.setState({msgContent : ''})
        })
        .catch((error) => {
            showToast();
        });
       
    }

    doQuestion(){
        this.setState({msgShow: false});
        this.setState({msgContent : ''})
        var obj = {
            admin_token: this.state.admin_token,
            user_id : this.state.userInfo.id,
            text: '',
            dir: 1,
            is_initial: 0,
            username: this.state.userInfo.name,
            is_finish: 1
        }
        var index = -2;
        var title = '';
        var key = new Date().getTime();
        //this.setState({property: [...this.state.property, {index, key, title }]})
        sendMsg(obj)
        .then((response) => {   
        })
        .catch((error) => {
            showToast();
        });
    }

    render(){
      return (
        <View style={this.state.footerHeight == 0 ? [styles.chatTool] : [styles.chatTool, {bottom: 100}]}>
            <TouchableOpacity onPress={() => this.toggleModal()} style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.chat}>
                    <Image source={require('../assets/images/chat.png')} style={{width: 22, height: 22}} />
                </View>
                <View>
                    <Text style={{color: 'white'}}>チャットでご相談</Text>
                </View>
                <Image source={require('../assets/images/chatmark.png')} style={{width: 22, height: 10, position: 'absolute', right: 23, bottom: -16}} />
            </TouchableOpacity>
            
            <Modal isVisible={this.state.visible} style={styles.bottomModal} onRequestClose={() => {this.closeModal()}}>
                <View style={styles.modalContent}>
                    <ImageBackground source={require('../assets/images/chat_bg.png')} style={{width: '100%', height: '100%'}} resizeMode="stretch">
                        <View style={styles.modalHeader}>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>チャットでご相談</Text>
                            <TouchableOpacity onPress={() => this.closeModal()}>
                                <Text style={{color: 'white', fontWeight: 'bold'}}>閉じる</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={this.state.msgShow ? [styles.modalBody, styles.chatScrollHeight] : [styles.modalBody, styles.chatScrollHeight1,{paddingBottom: 15}]}>
                            <KeyboardAvoidingView behavior="padding" style={{flex:1,paddingBottom: -10}} contentContainerStyle={{flex:1,paddingBottom: -10}} keyboardVerticalOffset={keyboardVerticalOffset}>
                                <ScrollView style={[styles.chatScrollPadding, ]}
                                    ref={ref => this.scrollView = ref}
                                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                                        this.scrollView.scrollToEnd({animated: true, duration: 200});
                                    }}>
                                    <View style={{flex: 1,flexDirection: 'column',justifyContent: 'space-between'}}>
                                        <View style={{paddingTop: 10}}>
                                            <Text>ご不明な点がありましたら、チャットでお答えします。</Text>
                                            <Text>ご相談はどういった內容ですか？</Text>
                                        </View>
                                        <View style={styles.renderPart}>
                                            {this.renderQAs()}
                                        </View>
                                        {
                                        this.state.msgShow ?
                                            <View style={[styles.chatSendSection]}>
                                                <TextInput style={styles.msgInput}
                                                    returnKeyType="go"
                                                    defaultValue={this.state.msgContent}
                                                    onChangeText={val=>this.setState({msgContent: val})}
                                                    onSubmitEditing={() => this.sendMsg()}
                                                />
                                                <TouchableOpacity onPress={() => this.sendMsg()}>
                                                    <Text style={styles.sendMsg}>メッセーヅを送る</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.doQuestion()}>
                                                    <Text style={styles.doQuestion}>質問する</Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                            : null
                                        }
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>        
                        </View>
                    </ImageBackground>    
                </View>
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </Modal>
            
        </View>
        
      );
    }
}

class QAs extends Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Animated.timing(
            // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
                toValue: 1, 
                duration: 1000,
                easing: Easing.out(Easing.quad)
            }, // Configuration
        ).start(); // Don't forget start!
        
    }

    dropdown_renderRow(rowData, rowID, highlighted) {
        return (
          <TouchableHighlight underlayColor='cornflowerblue'>
            <View style={styles.dropdown_row}>
              <Text style={[styles.dropdown_text1, highlighted && {color: 'mediumaquamarine'}]}>
                {`${rowData}`}
              </Text>
            </View>
          </TouchableHighlight>
        );
    }
    
    dropdown_renderSeparator(rowID) {
        if (rowID == qas[this.props.data].length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_separator} key={key} />);
    }

    dropdown_onSelect(idx, value){
        console.log(idx);
        this.props.socket.emit('getQA', { id: qaList[this.props.data][idx].id, userId : userInfo['id']});
    }

    render(){
        let qaDrop = <ModalDropdown style={styles.dropdown}
                                    dropdownStyle={styles.dropdown_dropdown}
                                    dropdownTextStyle={{color: 'black'}}
                                    enableEmptySections={true}
                                    textStyle={styles.dropdown_text}
                                    renderRow={this.dropdown_renderRow.bind(this)}
                                    renderSeparator={(rowID) => this.dropdown_renderSeparator(rowID)}
                                    defaultValue={this.props.title}
                                    options={qas[this.props.data]}
                                    onSelect={(idx, value) => this.dropdown_onSelect(idx, value)}/>
        const animateBotStyle = {
            transform: [{
                translateX: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                }),
            }],
            opacity: this.state.fadeAnim
        }
        const animateAdminStyle = {
            transform: [{
                translateX: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                }),
            }],
            opacity: this.state.fadeAnim
        }
        if(this.props.data == -1){
            return (
                <Animated.View style={[styles.adminSection, animateAdminStyle,{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
                    <View style={styles.botLogo}>
                        <Image style={styles.logo} source={require('../assets/images/bot_logo.png')} />
                        <Text style={styles.botName}>SEIMU</Text>
                    </View>
                    <View style={styles.adminChat}>
                        <Icon name={'caret-left'}
                            color={'white'}
                            style={{paddingTop: 10}}
                            size={26} />
                        <View style={styles.adminChatText}>
                            <Text style={styles.chatTextSize}>{this.props.choose_qa.answer}</Text>
                        </View>
                    </View>
                </Animated.View>
            )
        }else if(this.props.data == -3){
            return (
                <Animated.View style={[styles.adminSection, animateBotStyle, {alignItems: 'flex-end'}]}>
                    <View style={[styles.adminChat,{width: '100%', justifyContent: 'flex-end'}]}>
                        <Hyperlink linkStyle={ { color: '#2980b9', textDecorationLine: 'underline'} } linkDefault={ true }>
                            <View style={[styles.adminChatText, {backgroundColor: '#aeda3d'}]}>
                                <Text style={styles.chatTextSize}>{this.props.title}</Text>
                            </View>
                        </Hyperlink>
                        <Icon name={'caret-right'}
                            color={'#aeda3d'}
                            style={{paddingTop: 10}}
                            size={26} />
                    </View>
                </Animated.View>
            )
        }else if(this.props.data == -4){
            return (
                <Animated.View style={[styles.adminSection, animateAdminStyle,{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
                    <View style={styles.botLogo}>
                        
                        {
                            this.props.avatar == ''?
                            <Image style={styles.logo} source={require('../assets/images/bot_logo.png')} />
                            :
                            <Image style={styles.logo} source={{uri: Variables.serverAddr+':5010'+this.props.avatar}} />
                        }
                        {
                            this.props.admin_name == ''?
                            <Text style={styles.botName}>SEIMU</Text>
                            :
                            <Text style={styles.botName}>{this.props.admin_name}</Text>
                        }
                    </View>
                    <View style={styles.adminChat}>
                        <Icon name={'caret-left'}
                            color={'white'}
                            style={{paddingTop: 10}}
                            size={26} />
                        <Hyperlink linkStyle={ { color: '#2980b9', textDecorationLine: 'underline'} } linkDefault={ true }>
                            <View style={styles.adminChatText}>
                                <Text style={styles.chatTextSize}>{this.props.title}</Text>
                            </View>
                        </Hyperlink>
                    </View>
                </Animated.View>
            )
        }else if(this.props.data == -6){
            return (
                <Animated.View style={[styles.adminSection, animateAdminStyle,{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}]}>
                    <View style={styles.botLogo}>
                        <Image style={styles.logo} source={require('../assets/images/bot_logo.png')} />
                        <Text style={styles.botName}>SEIMU</Text>
                    </View>
                    <View style={styles.adminChat}>
                        <Icon name={'caret-left'}
                            color={'white'}
                            style={{paddingTop: 10}}
                            size={26} />
                        <View style={styles.adminChatText}>
                            <Text style={styles.chatTextSize}>{this.props.title}</Text>
                        </View>
                    </View>
                </Animated.View>
            )
        }else if(this.props.data >= 0){
            return (<View>
                    {qaDrop}
                </View>
            )
        }
        
    }
}

export function getScreenWidth() {
    return SCREEN_WIDTH;
}
export function getScreenHeight() {
    return SCREEN_HEIGHT;
}


const styles = StyleSheet.create({
  
  chatTool: {
    backgroundColor: '#0058cf',
    borderRadius: 30,
    position: 'absolute',
    bottom: 70,
    right: 5,
    justifyContent: "center",
    alignItems:"center",
    flex: 1,
    flexDirection: 'row',
    padding: 7,
    zIndex: 9999999
  },
  chat:{
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems:"center",
    marginRight: 5,
  },
  modalContent: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 3,
    borderColor: '#004097',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
  modalHeader: {
    backgroundColor: '#004097',
    width: '100%',
    paddingLeft: 15,
    paddingTop: 10, 
    paddingBottom: 10,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBody: {
      paddingTop: 15,
      paddingBottom: 0
  },
  chatToolBtn: {
    width: '50%',
  },
  chatToolBtnLeft:{
    paddingRight: 5,
  },
  chatToolBtnRight:{
    paddingLeft: 5,
  },
  chatToolBtnSec: {
      backgroundColor: '#004097',
      paddingBottom: 20,
      paddingTop: 20,
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center',
      width: '100%'
  },
  dropdown: {
    marginTop: 15,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: '#004097',
  },
  dropdown_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_text1: {
    marginVertical: 6,
    marginHorizontal: 6,
    textAlignVertical: 'center',
  },
  dropdown_dropdown: {
    width: getScreenWidth() - 86,
    height: 350,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_row: {
    flexDirection: 'row',
  },
  dropdown_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  dropdown_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
  botSection: {
    paddingTop: 15,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    alignItems: 'flex-end',
  },
  botChat: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
  },
  adminSection: {
    paddingTop: 15,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    
  },
  adminChat: {
    display: 'flex',
    width: '83%',
    flexDirection: 'row',
  },
  chatText: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  adminChatText: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  chatTextSize: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  chatScrollHeight: {
      height: getScreenHeight() - 95 - offset,
  },
  chatScrollHeight1: {
    height: getScreenHeight() - 103 - offset,
  },
  chatScrollPadding: {
    paddingLeft: 10,
    paddingRight: 10
  },
  chatSendSection: {
      padding: 10,
      backgroundColor: 'white',
      marginTop: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginLeft: -20,
      marginRight: -10
  },
  doQuestion:{
    backgroundColor: '#aeda3d',
    padding: 10,
    marginLeft: 10,
    fontSize: 12
  },
  sendMsg: {
    color: 'white',
    backgroundColor: '#004097',
    padding: 10,
    fontSize: 12
  },
  msgInput: {
      backgroundColor: '#ecf6ff',
      borderWidth: 1,
      borderColor: '#bcd1e9',
      width: getScreenWidth() - 260,
      fontSize: 12,
      textAlign: 'left',
      justifyContent: "flex-start", 
      paddingLeft: 10,
      paddingRight: 10,
      color: 'black'
  },
  botLogo: {
    width: '17%',
  },
  botName: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    paddingTop: 8
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 'auto'
  },
  topScroll: {
      height: getScreenHeight() - 100
  },
  renderPart: {
      minHeight: getScreenHeight() - 220
  }
});

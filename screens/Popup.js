import React, { Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import { getPopups, eventView } from '../components/Api';
import Variables from '../constants/Variables';

let userInfo = [];
export default class Popup extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            popupList: [],
        };
    }

    async componentDidMount(){
        userInfo = JSON.parse(await AsyncStorage.getItem('user'));
        getPopups(userInfo.id)
        .then(async (response) => {
            
            if(response.data != false){
                var prev_id = '';
                var is_exist = 0;
                for(var i = 0;i<response['data'].length;i++){
                    if(i != 0 && prev_id != response['data'][i]['user_id_list'] && is_exist == 1){
                        this.setState({popupList : [...this.state.popupList, response['data'][i]]})
                        is_exist = 0;
                    }
                    var ids = response['data'][i]['user_id_list'];
                    id_list = ids.split(',');
                    
                    for(var j = 0;j<id_list.length;j++){
                        if(id_list[j] == userInfo.id && is_exist != 2){
                            is_exist = 1;
                            break;
                        }
                        
                    }
                    if(is_exist == 1 && response['data'][i]['user_id'] == userInfo.id){
                        is_exist = 2;
                        break;
                    }
                        
                    prev_id = response['data'][i]['user_id_list'];
                }
                if(is_exist == 1){
                    this.setState({popupList : [...this.state.popupList, response['data'][response['data'].length-1]]})
                }
            }
            
        })
        .catch((error) => {
            
        });
    }
    renderPopups(){
        return this.state.popupList.map((popup) => {
            return <PopupEvent key={popup.id} data={popup} visible={true} />
        })
    }

    render(){
      return (
        <View style={styles.chatTool}>
            {this.renderPopups()}
        </View>
        
      );
    }
}

class PopupEvent extends Component{
    constructor(props){
        super(props);
        this.state ={
            visible: false
        };
        this.setState({visible: this.props.visible})
    }

    componentDidMount(){
        this.setState({visible: this.props.visible})
    }

    closeModal(){
        this.setState({visible: false});
        eventView(userInfo.id,this.props.data.id)
        .then(async (response) => {
            
        })
        .catch((error) => {
        });
    }

    

    render() {
        return (
            <Modal isVisible={this.state.visible} style={styles.bottomModal}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => this.closeModal(this.props.data.id)} style={styles.close}>
                        <View>
                            <Icon name="times-circle" size={22} color={'#4d4d4d'} />
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.eventTitle}>
                        <Text style={styles.title}>
                            {this.props.data.event_name}
                        </Text>
                    </View>
                    <View style={{paddingTop: 15, paddingBottom: 15}}>
                        <Image style={{width: '100%', height: 150}} resizeMode="contain" source={{uri: Variables.serverAddr+':5010'+this.props.data.image}} />
                    </View>
                    <View style={styles.eventDesc}>
                        <Text style={{color: '#888787'}}>{this.props.data.event_content}</Text>
                    </View>
                    
                    <View style={styles.pwdBorder}>
                        <Text style={{color: 'black', fontSize: 16}}>詳細を見る</Text>
                        <Icon name={'chevron-right'} size={18} style={{color: 'black', fontWeight: 300, position: 'absolute', right: 20}} />
                    </View>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    chatTool: {
        position: 'absolute',
        justifyContent: "center",
        alignItems:"center",
        flex: 1,
        flexDirection: 'row',
        padding: 7,
        zIndex: 9999999
    },
    bottomModal: {
        justifyContent: 'center',
        margin: 0,
    },
    modalContent: {
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        backgroundColor: 'white'
    },
    close: {
        position: 'absolute',
        borderRadius: 11,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'white',
        right:-8,
        top: -8,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999999
    },
    eventTitle:{
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 20
    },
    title:{
        fontSize: 20
    },
    eventDesc: {
        paddingTop: 10,
        textAlign: 'center'
    },
    pwdBorder: {
        borderRadius: 30,
        borderColor: '#d1d1d1',
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center'
    },
});

import React, { Component } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Dimensions, ImageBackground, Easing, TextInput, AsyncStorage, Animated } from 'react-native';
import io from "socket.io-client";
import Icon from "react-native-vector-icons/FontAwesome";
const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('window');
export function getScreenHeight() {
    return SCREEN_HEIGHT;
}
import * as Progress from 'react-native-progress';
import * as SecureStore from 'expo-secure-store';
import RadioForm from 'react-native-simple-radio-button';
import Variables from '../constants/Variables';
import { signup, getUserInfo, callZip, getQuestion } from '../components/Api';
import { showToast } from '../components/Global';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import RNPickerSelect from 'react-native-picker-select';
import { CheckBox } from 'react-native-elements';
import Constants from "expo-constants";
import DateTimePicker from '@react-native-community/datetimepicker';
const SOCKET_URL = Variables.serverAddr+':5011';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0
let myEmail = '';
let userInfo = {
    user_name_1 : '',
    user_name_2: '',
    user_name_kata_1: '',
    user_name_kata_2: '',
    postCode: '',
    city: '',
    street: '',
    birth: 0,
    phone1: '',
    phone2: '',
    phone3: '',
    hphone: '',
    mainAddr: -1,
    email: '',
    proInputVal: '',
    proVal: '',
    hope1: null,
    hope2: null,
    hope3: null,
    hopeP1: null,
    hopeP2: null,
    hopeP3: null,
    hopeVal: '',
    budget: 0,
    monthBudget: null,
    desc: '',
    pushToken: '',
    thing: null,
    floor: null,
    floorPlan: null,
    garage: null,
    desireLine: '',
    desireMin: null,
    mortgage: null,
    alone: null,
    prevYearBudget: null,
    prevYearBudget1: null,
    prevYearBudget2: null,
    companyName: '',
    companyName1: '',
    companyName2: '',
    employmentIput: '',
    employmentIput1: '',
    employmentIput2: '',
    service: null,
    service1: null,
    service2: null,
    employment: null,
    employment1: null,
    employment2: null,
    curType: null,
    curRent: null,
    planSell: null,
    resetMortgage:'',
    family1: 0,
    family2: 0,
    family3: 0,
    reference: null,
    addrPlanSale: '',
    password: '',
    confirmPassword: '',
    move_in : ''
};
let proBtns = [false,false,false,false,false];
let thingBtns = [false,false,false,false];
let curTypeBtns = [false,false,false];
let planSellBtns = [false,false,false];
let thingListBtns = [false,false,false,false];
let mortgagaBtns = [false,false];
let allonBtns = [false,false,false];
let hopeBtns = [false,false,false,false,false,false];
let proInput = false;
let curStep = 0;
let proList = ['新築戸建', '中古戸建', '中古マンション', '土地'];
let budgetList = [
    {label: '～1,000万円まで', value: 0},
    {label: '1,000～1,500万円', value: 1},
    {label: '1,500～2,000万円', value: 2},
    {label: '2,000～2,500万円', value: 3},
    {label: '2,500～3,000万円', value: 4},
    {label: '3,000～3,500万円', value: 5},
    {label: '3,500～4,000万円', value: 6},
    {label: '4,000～4,500万円', value: 7},
    {label: '4,500～5,000万円', value: 8},
    {label: '5,000万円以上', value: 9},
]
let monthList = [
    {label: '～3 万円まで', value: 0},
    {label: '3～4万円', value: 1},
    {label: '4～5万円', value: 2},
    {label: '5～6万円', value: 3},
    {label: '7～8万円', value: 4},
    {label: '9 ～10万円', value: 5},
    {label: '10万円以上', value: 6},
]
let radio_props = [
    {label: '携帯電話   ', value: 0 },
    {label: 'ご自宅', value: 1 }
];
let floorList = [
    {label: '3 階建て', value: 0},
    {label: '2 階建て', value: 1},
    {label: '1 階建て', value: 2},
]
let floorPlanList = [
    {label: '3LDK', value: 0},
    {label: '4LDK', value: 1},
    {label: '5LDK 以上', value: 2},
]
let garageList = [
    {label: '1 台', value: 0},
    {label: '2 台', value: 1},
    {label: '3 台', value: 2},
    {label: '4 台', value: 3},
    {label: '5 台 以上', value: 4},
    {label: '所持しない', value: 5},
]
let desireMinList1 = [
    {label: '気にしない', value: 0},
    {label: '10 分以下', value: 1},
    {label: '15 分以下', value: 2},
    {label: '20 分以下', value: 3},
]
let desireMinList2 = [
    {label: '5 分以下', value: 0},
    {label: '10 分以下', value: 1},
    {label: '15 分以下', value: 2},
    {label: '気にしない', value: 3},
]
let prevYearBudgetList = [
    {label: '100 万円以下', value: 0},
    {label: '100 万円～ 200 万円', value: 1},
    {label: '200 万円～ 300 万円', value: 2},
    {label: '300 万円～ 400 万円', value: 3},
    {label: '400 万円～ 500 万円', value: 4},
    {label: '500 万円～ 600 万円', value: 5},
    {label: '600 万円～ 700 万円', value: 6},
    {label: '700 万円～ 800 万円', value: 7},
    {label: '800 万円～ 900 万円', value: 8},
    {label: '900 万円～ 1,000 万円', value: 9},
    {label: '1,000 万円以上', value: 10},
]
let serviceList = [
    {label: '5 年以上', value: 0},
    {label: '5 年', value: 1},
    {label: '4 年', value: 2},
    {label: '3 年', value: 3},
    {label: '2 年', value: 4},
    {label: '1 年', value: 5},
    {label: '1 年未満', value: 6},
]
let employmentList = [
    {label: '正社員', value: 0},
    {label: '契約社員', value: 1},
    {label: '派遣社員', value: 2},
    {label: '自営業（個人）', value: 3},
    {label: '自営業（法人）', value: 4},
    {label: 'その他', value: 5},
]
let curRentList = [
    {label: '5 万円以下', value: 0},
    {label: '6 万円台', value: 1},
    {label: '7 万円台', value: 2},
    {label: '8 万円台', value: 3},
    {label: '9 万円台', value: 4},
    {label: '10 万円台', value: 5},
    {label: '11 万円台', value: 6},
    {label: '12 万円台', value: 7},
    {label: '13 万円台', value: 8},
    {label: '14 万円台', value: 9},
    {label: '15 万円以上', value: 10},
]
let familyList = [
    {label: '0人', value: 0},
    {label: '1人', value: 1},
    {label: '2人', value: 2},
    {label: '3人', value: 3},
    {label: '4人', value: 4},
    {label: '5人', value: 5},
    {label: '6人', value: 6},
    {label: '7人', value: 7},
    {label: '8人', value: 8},
    {label: '9人', value: 9},
    {label: '10人', value: 10},
]
let referenceList = [
    {label: 'ここが最初です', value: 0},
    {label: '1 ～ 5 件', value: 1},
    {label: '5 ～ 10 件', value: 2},
    {label: '10 件以上', value: 3},
]
let thingList = [
    '戸建て', 'マンション ', '土地', 'その他'
]
let socketSet = 0;
let japan_city = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
export default class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questions: [],
            answers: [],
            socket: null,
            height: 0,
            step: 1,
            progress: 0,
            curCntAnswer: 0,
            curQAStatus: 0,
            totalCnt: 12,
            loaded: true
        };
    }

    registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          return;
        }
        try {
          userInfo['pushToken'] = await Notifications.getExpoPushTokenAsync(); 
        } catch (error) {
          console.log(error);
        }
    };

    

    async componentDidMount() {
        await this.registerForPushNotificationsAsync();
        socketSet = await SecureStore.getItemAsync('socket')
        this.state.socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        if(socketSet == '1'){
            await SecureStore.setItemAsync('socket', '2')
            socketSet = 2;
            this.state.socket.emit('step', {step: 1});
        }
        
        this.state.socket.on('receive step', data => {
            curStep = data.res.step;
            this.setState({questions: [...this.state.questions, data.res]});
            if(this.state.curQAStatus != 0){
                this.setState({curQAStatus: 0})
            }
            
            setTimeout(() => {
                if(data.res.next == 0){
                    if(data.res.step == 20){
                        this.setState({curCntAnswer: 0})
                        this.setState({totalCnt: 30});
                        this.animate(this.state.curCntAnswer);
                    }
                    if(data.res.step == 3)
                        this.state.socket.emit('step', {step: data.res.step+1, kname1: data.res.kname1, kname2: data.res.kname2});
                    else
                        this.state.socket.emit('step', {step: data.res.step+1});
                }
                else if(data.res.next == 1){
                    if(data.res.step != 8){
                        this.setState({curQAStatus: 1});
                        if(data.res.step != 19){
                            this.setState({ curCntAnswer : this.state.curCntAnswer+1})
                            this.animate(this.state.curCntAnswer);
                        }
                    }
                    
                    this.state.socket.emit('user answer', {step: data.res.step, kname1: data.res.kname1, kname2: data.res.kname2});
                }
            }, 1200);
        })
        
        this.state.socket.on('user answer', data => {
            if(data.res.type != 'bot' && data.res.step == 3){
                userInfo['user_name_kata_1'] = data.res.kname1;
                userInfo['user_name_kata_2'] = data.res.kname2;
            }
            this.setState({questions: [...this.state.questions, data.res]});
        })
        
    }

    animate(cnt) {
        let progress = 0;
        if(cnt > 0)
            progress = cnt/this.state.totalCnt;
        this.setState({ indeterminate: false });
        this.setState({ progress });
    }
    

    renderBotQA(){
        if(this.state.questions.length == 0){
            return null;
        }else{
            return this.state.questions.map((question) =>  {
                return <BotQA key={question.question} data={question.question} type={question.type} step={question.step} socket={this.state.socket} kname1={question.kname1} kname2={question.kname2}
                    />
                }
            )
        }
    }

    tutorial(){
        getUserInfo(userInfo['email'])
        .then(async (response) => {
            await AsyncStorage.setItem('user', JSON.stringify(response.data[0]));
            this.props.navigation.push('Tutorial');
        });
    }

    closeModal(){
        this.props.navigation.goBack();
        userInfo = {
            user_name_1 : '',
            user_name_2: '',
            user_name_kata_1: '',
            user_name_kata_2: '',
            postCode: '',
            city: '',
            street: '',
            birth: 0,
            phone1: '',
            phone2: '',
            phone3: '',
            hphone: '',
            mainAddr: -1,
            email: '',
            proInputVal: '',
            proVal: '',
            hope1: null,
            hope2: null,
            hope3: null,
            hopeP1: null,
            hopeP2: null,
            hopeP3: null,
            hopeVal: '',
            budget: 0,
            monthBudget: null,
            desc: '',
            pushToken: '',
            thing: null,
            floor: null,
            floorPlan: null,
            garage: null,
            desireLine: '',
            desireMin: null,
            mortgage: null,
            alone: null,
            prevYearBudget: null,
            prevYearBudget1: null,
            prevYearBudget2: null,
            companyName: '',
            companyName1: '',
            companyName2: '',
            employmentIput: '',
            employmentIput1: '',
            employmentIput2: '',
            service: null,
            service1: null,
            service2: null,
            employment: null,
            employment1: null,
            employment2: null,
            curType: null,
            curRent: null,
            planSell: null,
            resetMortgage:'',
            family1: 0,
            family2: 0,
            family3: 0,
            reference: null,
            addrPlanSale: '',
            password: '',
            confirmPassword: ''
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/images/chat_bg.png')} style={{width: '100%', height: Dimensions.get('window').height}}>
                    
                        <View style={{flex:1, paddingTop: Constants.statusBarHeight}}>
                            <View style={styles.chatSection}>
                                <KeyboardAvoidingView behavior="position">
                                    <ScrollView
                                    ref={ref => this.scrollView = ref}
                                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                                        this.scrollView.scrollToEnd({animated: true});
                                    }}>
                                        <View style={styles.container}>
                                            {this.renderBotQA()}
                                        </View>
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </View>
                            
                            <Progress.Bar progress={this.state.progress} width={SCREEN_WIDTH} height={40} 
                                unfilledColor={'#fff'} color={'#c7dc59'} borderColor={'white'}>
                            </Progress.Bar>
                            <View style={styles.bottomQuestionCnt}>
                                <Text style={styles.curProgress}>
                                    {this.state.curCntAnswer} / {this.state.totalCnt}
                                </Text>
                            </View>
                            {
                                this.state.totalCnt == 30 ? 
                                <View style={styles.skip}>
                                    <TouchableOpacity onPress={() => this.tutorial()}>
                                        <Text>
                                            SKIP
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                            }
                            
                        </View>
                    
                    <TouchableOpacity onPress={() => this.closeModal()} style={styles.close}>
                        <View>
                            <Icon name="times-circle" size={22} color={'#4d4d4d'} />
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }   
}

class BotQA extends Component {
    constructor(props){
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0), // init opacity 0
            user_name_1_err: false,
            user_name_2_err: false,
            user_name_kata_1_err: false,
            user_name_kata_2_err: false,
            postCode_err: false,
            city_err: false, 
            street_err:false,
            postCode: '',
            city: '',
            street: '',
            birth_err: false,
            phone1_err: false,
            phone2_err: false,
            phone3_err: false,
            hphone_err: false,
            email_err: false,
            hope1: null,
            hope2: null,
            hope3: null,
            proInput_err: false,
            mortgage_err : false,
            allon_err : false,
            prevYearBudget_err: false,
            prevYearBudget1_err: false,
            prevYearBudget2_err: false,
            service_err: false,
            service1_err: false,
            service2_err: false,
            employment_err: false,
            employment1_err: false,
            employment2_err: false,
            employmentInput: false,
            employmentInput1: false,
            employmentInput2: false,
            proBtns : [false,false,false,false,false],
            thingBtns : [false,false,false,false],
            curTypeBtns : [false,false,false],
            planSellBtns: [false,false,false],
            thingListBtns: [false,false,false,false],
            mortgagaBtns: [false,false],
            allonBtns: [false,false,false],
            hopeBtns : [false,false,false,false,false,false],
            resetMortgageBtns : false,
            checkAddrPlanSale: false,
            pwd_err : false,
            pwd_match_err: false,
            checkingBtn: false,
            area_list : [
                ['鶴見区', '城東区', '旭区', '都島区', '東淀川区', '淀川区', '西淀川区', '北区', '中央区', '阿倍野区', '天王寺区', '東住吉区', '住吉区', '住之江区', '西区', '福島区', '港区', '此花区', '大正区', '西成区', '浪速区', '生野区', '東成区', '平野区'],
                ['高槻市', '茨木市', '摂津市', '吹田市', '豊中市', '箕面市', '池田市', '豊能町', '島本町', '能勢町'],
                ['枚方市', '寝屋川市', '守口市', '門真市', '交野市', '東大阪市', '八尾市', '大東市', '四條畷市', '柏原市'],
                ['堺市堺区', '堺市西区', '堺市中区', '堺市北区', '堺市東区', '堺市南区', '堺市美原区', '松原市', '泉大津市', '岸和田市', '藤井寺市', '羽曳野市', '太子町', '江南町', '富田林市', '大阪狭山市', '千早赤坂村', '河内長野市', '高石市', '和泉市', '忠岡町', '岸和田市', '貝塚市', '熊取町', '泉佐野市', '田尻町', '泉南市', '阪南市', '岬町'],
                ['京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県', '近畿圏外'],
                []],
            hope_list: [],
            budget_err: false,
            monthBudget_err: false,
            floorList_err: false,
            thing_err: false,
            calendar_show: false,
        };
        this.state.hopeBtns = hopeBtns;
        this.state.proBtns = proBtns;
        this.state.hope1 = userInfo['hope1'];
        this.state.hope2 = userInfo['hope2'];
        this.state.hope3 = userInfo['hope3'];
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

    onChange = (event, selectedDate) =>{
        userInfo['move_in'] = this.curDate(selectedDate)
        if(Platform.OS == 'android')
            this.setState({calendar_show: false})
    }

    proClick(index){
        proBtns[index] = !proBtns[index];
        this.setState({proBtns: proBtns})
        if(proBtns[4])
            proInput = true;
        else
            proInput = false;
    }

    thingClick(index, step){
        thingBtns = [false,false,false,false];
        thingBtns[index] = !thingBtns[index];
        userInfo['thing'] = index;
        this.setState({thingBtns: thingBtns})

        if(thingBtns[0])
            this.props.socket.emit('step', {step: step+1, email : myEmail, data:'新築戸建て'});
        else if(thingBtns[1])
            this.props.socket.emit('step', {step: step+1, email : myEmail, data:'中古戸建て'});
        else if(thingBtns[2])
            this.props.socket.emit('step', {step: 24, email : myEmail, data:'中古マンション'});
        else if(thingBtns[3])
            this.props.socket.emit('step', {step: 26, email : myEmail, data:'土地'});
    }

    mortgageClick(index){
        mortgagaBtns = [false,false];
        mortgagaBtns[index] = !mortgagaBtns[index];
        userInfo['mortgage'] = index;
        this.setState({mortgagaBtns: mortgagaBtns})
    }

    allonClick(index){
        allonBtns = [false,false,false];
        allonBtns[index] = !allonBtns[index];
        userInfo['allon'] = index;
        this.setState({allonBtns: allonBtns})
    }

    curTypeClick(index){
        curTypeBtns = [false,false,false];
        curTypeBtns[index] = !curTypeBtns[index];
        userInfo['curType'] = index;
        this.setState({curTypeBtns: curTypeBtns})
    }

    planSellClick(index){
        planSellBtns = [false,false,false];
        planSellBtns[index] = !planSellBtns[index];
        userInfo['planSell'] = index;
        this.setState({planSellBtns: planSellBtns})
    }

    thingListClick(index){
        thingListBtns = [false,false,false];
        thingListBtns[index] = !thingListBtns[index];
        userInfo['thingType'] = index;
        this.setState({thingListBtns: thingListBtns})
    }

    hopeClick(index){
        hopeBtns[index] = !hopeBtns[index];
        if(hopeBtns[5]){
            this.setState({checkingBtn : true})
        }else{
            this.setState({checkingBtn : false})
            
            this.setState({hopeBtns: hopeBtns})
            this.state.hope_list = [];
            this.setState({hope_list: []});
            let hopeList = []
            for(var i = 0; i< hopeBtns.length;i++){
                if(hopeBtns[i]){
                    for(var j = 0;j< this.state.area_list[i].length;j++){
                        let temp = { label:this.state.area_list[i][j], value: this.state.area_list[i][j]};
                        hopeList.push(temp)
                    }
                }
            }
            this.setState({hope_list: hopeList})
        }
        
    }

    getAddrFromZip(postCode){
        callZip(postCode.substr(0,3))
        .then(async (response) => {
            var zipStr = response.replace("$yubin(", '');
            var zipStr = zipStr.replace(");",'');
            var zipList = JSON.parse(zipStr);
            let post_city = '';
            if(zipList[postCode][1] != undefined){
                if(zipList[postCode][0] != undefined){
                    post_city = japan_city[zipList[postCode][0] - 1];
                }
                userInfo['city'] = post_city + ' ' + zipList[postCode][1];
                this.setState({city: zipList[postCode][1]});
            }else{
                userInfo['city'] = post_city;
            }
            if(zipList[postCode][3] != undefined){
                userInfo['street'] = zipList[postCode][3];
                this.setState({street: zipList[postCode][3]});
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    curDate(time) {
        var today = new Date(time);
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10)
            dd = "0" + dd;
        if (mm < 10)
            mm = "0" + mm;
        var buffer = yyyy + "-" + mm + "-" + dd;
        return buffer;
    }

    userAnswer(step){
        if(userInfo['user_name_1'] == ''){
            this.state.user_name_1_err = true;
            this.setState({user_name_1_err: true});
        }else{
            this.state.user_name_1_err = false;
            this.setState({user_name_1_err: false});
        }
        if(userInfo['user_name_2'] == ''){
            this.state.user_name_2_err = true;
            this.setState({user_name_2_err: true});
        }else{
            this.state.user_name_2_err = false;
            this.setState({user_name_2_err: false});
        }

        if(userInfo['user_name_kata_1'] == ''){
            this.state.user_name_kata_1_err = true;
            this.setState({user_name_kata_1_err: true});
        }else{
            var letter = /^[\u30a0-\u30ff]+$/;
            if(userInfo['user_name_kata_1'].match(letter) == null){
                this.state.user_name_kata_1_err = true;
                this.setState({user_name_kata_1_err: true});
            }else{
                this.state.user_name_kata_1_err = false;
                this.setState({user_name_kata_1_err: false});
            }
        }
        if(userInfo['user_name_kata_2'] == ''){
            this.state.user_name_kata_2_err = true;
            this.setState({user_name_kata_2_err: true});
        }else{
            var letter = /^[\u30a0-\u30ff]+$/;
            if(userInfo['user_name_kata_2'].match(letter) == null){
                this.state.user_name_kata_2_err = true;
                this.setState({user_name_kata_2_err: true});
            }else{
                this.state.user_name_kata_2_err = false;
                this.setState({user_name_kata_2_err: false});
            }
        }

        if(userInfo['postCode'] == ''){
            this.state.postCode_err = true;
            this.setState({postCode_err: true});
        }else{
            this.state.postCode_err = false;
            this.setState({postCode_err: false});
        }

        if(userInfo['city'] == ''){
            this.state.city_err = true;
            this.setState({city_err: true});
        }else{
            this.state.city_err = false;
            this.setState({city_err: false});
        }
        if(userInfo['street'] == ''){
            this.state.street_err = true;
            this.setState({street_err: true});
        }else{
            this.state.street_err = false;
            this.setState({street_err: false});
        }
        
        
        if(userInfo.birth == '' || userInfo.birth.length != 8){
            this.state.birth_err = true;
            this.setState({birth_err: true});
        }else{
            let bdate = userInfo.birth[0]+userInfo.birth[1]+userInfo.birth[2]+userInfo.birth[3]+"-"+userInfo.birth[4]+userInfo.birth[5]+"-"+userInfo.birth[6]+userInfo.birth[7];
            if(bdate >= '1900-01-01' && bdate <= '2050-01-01'){
                this.state.birth_err = false;
                this.setState({birth_err: false});
            }else{
                this.state.birth_err = true;
                this.setState({birth_err: true});
            }
        }

        if(userInfo['phone1'] == '' || userInfo['phone1'].length != 3){
            this.state.phone1_err = true;
            this.setState({phone1_err: true});
        }else{
            this.state.phone1_err = false;
            this.setState({phone1_err: false});
        }

        if(userInfo['phone2'] == '' || userInfo['phone2'].length != 4){
            this.state.phone2_err = true;
            this.setState({phone2_err: true});
        }else{
            this.state.phone2_err = false;
            this.setState({phone2_err: false});
        }

        if(userInfo['phone3'] == '' || userInfo['phone3'].length != 4){
            this.state.phone3_err = true;
            this.setState({phone3_err: true});
        }else{
            this.state.phone3_err = false;
            this.setState({phone3_err: false});
        }

        if(userInfo['hphone'] != '' && userInfo['hphone'].length != 10){
            this.state.hphone_err = true;
            this.setState({hphone_err: true})
        }else{
            this.state.hphone_err = false;
            this.setState({hphone_err: false})
        }

        if(userInfo['email'] == '' || !this.validateEmail(userInfo['email'])){
            this.state.email_err = true;
            this.setState({email_err: true});
        }else{
            this.state.email_err = false;
            this.setState({email_err: false});
        }

        var pwd_letters = /^[0-9a-zA-Z]+$/;
        if(userInfo['password'].length < 8 || userInfo['password'].length > 20 || !userInfo['password'].match(pwd_letters)){
            this.state.pwd_err = true;
            this.setState({pwd_err: true})
        }else{
            this.state.pwd_err = false;
            this.setState({pwd_err: false});
        }

        if(userInfo['password'] != userInfo['confirmPassword']){
            this.state.pwd_match_err = true;
            this.setState({pwd_match_err: true})
        }else{
            this.state.pwd_match_err = false;
            this.setState({pwd_match_err: false})
        }

        if(userInfo['proInputVal'] == '' && this.state.proBtns[4]){
            this.state.proInput_err = true;
            this.setState({proInput_err: true});
        }else{
            this.state.proInput_err = false;
            this.setState({proInput_err: false});
        }

        if(userInfo['budget'] == null ){
            this.state.budget_err = true;
            this.setState({budget_err: true});
        }else{
            this.state.budget_err = false;
            this.setState({budget_err: false});
        }

        if(userInfo['monthBudget'] == null ){
            this.state.monthBudget_err = true;
            this.setState({monthBudget_err: true});
        }else{
            this.state.monthBudget_err = false;
            this.setState({monthBudget_err: false});
        }

        if(userInfo['floor'] == null ){
            this.state.floorList_err = true;
            this.setState({floorList_err: true});
        }else{
            this.state.floorList_err = false;
            this.setState({floorList_err: false});
        }

        if(userInfo['mortgage'] == null){
            this.state.mortgage_err = true;
            this.setState({mortgage_err: true});
        }else{
            this.state.mortgage_err = false;
            this.setState({mortgage_err: false});
        }

        if(userInfo['allon'] == null){
            this.state.allon_err = true;
            this.setState({allon_err: true});
        }else{
            this.state.allon_err = false;
            this.setState({allon_err: false});
        }

        if(userInfo['prevYearBudget'] == null && (userInfo['allon'] ==1 || userInfo['allon'] ==3)){
            this.state.prevYearBudget_err = true;
            this.setState({prevYearBudget_err: true});
        }else{
            this.state.prevYearBudget_err = false;
            this.setState({prevYearBudget_err: false});
        }
        if(userInfo['prevYearBudget1'] == null && userInfo['allon'] ==2 && step == 33){
            this.state.prevYearBudget1_err = true;
            this.setState({prevYearBudget1_err: true});
        }else{
            this.state.prevYearBudget1_err = false;
            this.setState({prevYearBudget1_err: false});
        }
        if(userInfo['prevYearBudget2'] == null && userInfo['allon'] ==2 && step == 37){
            this.state.prevYearBudget2_err = true;
            this.setState({prevYearBudget2_err: true});
        }else{
            this.state.prevYearBudget2_err = false;
            this.setState({prevYearBudget2_err: false});
        }
        
        if(step == 2 && step == curStep && this.state.user_name_1_err == false && this.state.user_name_2_err == false){
            this.props.socket.emit('step', {step: step+1, uname1: userInfo['user_name_1'], uname2: userInfo['user_name_2']});
        }
        if(step == 3 && step == curStep && this.state.user_name_kata_1_err == false && this.state.user_name_kata_2_err == false)
            this.props.socket.emit('step', {step: step+1});
        if(step == 4 && this.state.postCode_err == false && this.state.city_err == false && this.state.street_err == false){
            if(step == curStep)
                this.props.socket.emit('step', {step: step+1});
        }
        if(step == 5 && step == curStep && this.state.birth_err == false){
            this.props.socket.emit('step', {step: step+1});
        }
        if(step == 6 && step == curStep && this.state.phone1_err == false && this.state.phone2_err == false && this.state.phone3_err == false){
            if(userInfo['hphone'] != '' && this.state.hphone_err == false)
                this.props.socket.emit('step', {step: step+1});
            else if(this.state.hphone_err == false)
                this.props.socket.emit('step', {step: 10});
        }
        if(step == 8 && step == curStep){
            this.props.socket.emit('step', {step: step+1});
        }
        if(step == 10 && step == curStep && this.state.email_err == false)
            this.props.socket.emit('step', {step: step+1});
        if(step == 11 && step == curStep && this.state.pwd_err == false && this.state.pwd_match_err == false)
            this.props.socket.emit('step', {step: step+1});
        if(step == 13 && step == curStep && this.state.proInput_err == false){
            let is_exist = 0;
            for(var i = 0;i<5;i++){
                if(this.state.proBtns[i]){
                    if(i != 4){
                        if(is_exist != 0)
                            userInfo['proVal'] = userInfo['proVal'] + ',';
                        userInfo['proVal'] = userInfo['proVal'] + proList[i];
                    }
                    else{
                        if(is_exist == 0)
                            userInfo['proVal'] = userInfo['proInputVal'];
                        else
                            userInfo['proVal'] = userInfo['proVal'] + ',' + userInfo['proInputVal'];
                    }
                    is_exist++;
                }
            }
            if(is_exist){
                this.props.socket.emit('step', {step: step+1});
            }
        }
        if(step == 14 && step == curStep && (this.state.hope1 != null || this.state.hope2 != null || this.state.hope3 != null))
            this.props.socket.emit('step', {step: step+1});
        if(step == 15 && step == curStep && userInfo['budget'] != null)
            this.props.socket.emit('step', {step: step+1});
        if(step == 16 && step == curStep && userInfo['monthBudget'] != null)
            this.props.socket.emit('step', {step: step+1});
        if(step == 18 && step == curStep)
            this.props.socket.emit('step', {step: step+1});
        if(step == 19 && step == curStep){
            this.setState({loaded: false});
            signup(userInfo)
            .then((response) => {
                this.setState({loaded: true});
                if(response.data == false){
                    showToast('メールは既に存在します!');
                    return;
                } else{
                    myEmail = userInfo['email'];
                    this.props.socket.emit('step', {step: step+1});
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
        if(step == 22 && step == curStep){
            this.setState({thing_err: false})
            if(thingBtns[0])
                this.props.socket.emit('step', {step: step+1, email : myEmail, data:'新築戸建て'});
            else if(thingBtns[1])
                this.props.socket.emit('step', {step: step+1, email : myEmail, data:'中古戸建て'});
            else if(thingBtns[2])
                this.props.socket.emit('step', {step: 24, email : myEmail, data:'中古マンション'});
            else if(thingBtns[3])
                this.props.socket.emit('step', {step: 26, email : myEmail, data:'土地'});
            else
                this.setState({thing_err: true})
        }
        if(step == 23 && step == curStep){
            this.props.socket.emit('step', {step: 24, email : myEmail, data:userInfo['floor'] === null ? '' : floorList[userInfo['floor']]['label']});
        }
        if(step == 24 && step == curStep){
            this.props.socket.emit('step', {step: 25, email : myEmail, data:userInfo['floorPlan'] === null ? '' : floorPlanList[userInfo['floorPlan']]['label']});
        }
        if(step == 25 && step == curStep){
            this.props.socket.emit('step', {step: 26, email : myEmail, data:userInfo['garage'] === null ? '' : garageList[userInfo['garage']]['label']});
        }
        if(step == 26 && step == curStep){
            this.props.socket.emit('step', {step: 27, email : myEmail, data:userInfo['desireLine']});
        }
        if(step == 27 && step == curStep){
            if(thingBtns[0] || thingBtns[1] || thingBtns[3])
                this.props.socket.emit('step', {step: 28, email : myEmail, data:userInfo['desireMin'] === null ? '' : desireMinList1[userInfo['desireMin']]['label']});
            else
                this.props.socket.emit('step', {step: 28, email : myEmail, data:userInfo['desireMin'] === null ? '' : desireMinList2[userInfo['desireMin']]['label']});
        }
        if(step == 28 && step == curStep){
            if(Platform.OS == 'android')
                this.setState({calendar_show : false})
            this.props.socket.emit('step', {step: step + 1, email: myEmail, data: userInfo['move_in']});
        }
        if(step == 29 && step == curStep && !this.state.mortgage_err){
            if(userInfo['mortgage'] == 0)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:'利用しています'});
            else if(userInfo['mortgage'] == 1)
                this.props.socket.emit('step', {step: 43, email : myEmail, data:'利用していません'});
        }
        if(step == 30 && step == curStep && !this.state.allon_err){
            if(userInfo['allon'] == 0)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:'1 人'});
            else if(userInfo['allon'] == 2)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:'未定'});
            else if(userInfo['allon'] == 1)
                this.props.socket.emit('step', {step: 35, email : myEmail, data:'2 人'});
        }
        if(step == 31 && step == curStep && !this.state.prevYearBudget_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['prevYearBudget'] === null ? '' : prevYearBudgetList[userInfo['prevYearBudget']]['label']});
        }
        if(step == 32 && step == curStep){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['companyName']});
        }
        if(step == 33 && step == curStep && !this.state.service_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['service'] === null ? '' : serviceList[userInfo['service']]['label']});
        }
        if(step == 34 && step == curStep && !this.state.employment_err){
            if(userInfo['employment'] != 5)
                this.props.socket.emit('step', {step: 43, email : myEmail, data:userInfo['employment'] === null ? '' : employmentList[userInfo['employment']]['label']});
            else
                this.props.socket.emit('step', {step: 43, email : myEmail, data:userInfo['employmentIput']});
        }
        if(step == 35 && step == curStep && !this.state.prevYearBudget1_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['prevYearBudget1'] === null ? '' : prevYearBudgetList[userInfo['prevYearBudget1']]['label']});
        }
        if(step == 36 && step == curStep){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['companyName1']});
        }
        if(step == 37 && step == curStep && !this.state.service1_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['service1'] === null ? '' : serviceList[userInfo['service1']]['label']});
        }
        if(step == 38 && step == curStep && !this.state.employment1_err){
            if(userInfo['employment1'] != 5)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['employment1'] === null ? '' : employmentList[userInfo['employment1']]['label']});
            else
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['employmentIput1']});
        }
        if(step == 39 && step == curStep && !this.state.prevYearBudget2_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['prevYearBudget2'] === null ? '' : prevYearBudgetList[userInfo['prevYearBudget2']]['label']});
        }
        if(step == 40 && step == curStep){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['companyName2']});
        }
        if(step == 41 && step == curStep && !this.state.service2_err){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['service2'] === null ? '' : serviceList[userInfo['service2']]['label']});
        }
        if(step == 42 && step == curStep && !this.state.employment2_err){
            if(userInfo['employment2'] != 5)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['employment2'] === null ? '' : employmentList[userInfo['employment2']]['label']});
            else
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['employmentIput2']});
        }
        if(step == 43 && step == curStep){
            if(userInfo['curType'] == 0)
                this.props.socket.emit('step', {step: 44, email : myEmail, data:'賃貸'});
            else if(userInfo['curType'] == 1)
                this.props.socket.emit('step', {step: 45, email : myEmail, data:'持ち家'});
            else if(userInfo['curType'] == 2)
                this.props.socket.emit('step', {step: 50, email : myEmail, data:'その他'});
        }
        if(step == 44 && step == curStep){
            this.props.socket.emit('step', {step: 50, email : myEmail, data:userInfo['curRent'] === null ? '' : curRentList[userInfo['curRent']]['label']});
        }
        if(step == 45 && step == curStep){
            if(userInfo['planSell'] == 0)
                this.props.socket.emit('step', {step: 46, email : myEmail, data:'はい'});
            else if(userInfo['planSell'] == 1)
                this.props.socket.emit('step', {step: 50, email : myEmail, data:'いいえ'});
            else if(userInfo['planSell'] == 2)
                this.props.socket.emit('step', {step: 50, email : myEmail, data:'未定'});
        }
        if(step == 46 && step == curStep && userInfo['thingType'] != null){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['thingType'] === null ? '' : thingList[userInfo['thingType']]});
        }
        if(step == 47 && step == curStep){
            if(this.state.checkAddrPlanSale)
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:'現在お住いの住所と同上'});
            else
                this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['addrPlanSale']});
        }
        if(step == 48 && step == curStep){
            if(this.state.resetMortgageBtns)
                this.props.socket.emit('step', {step: 50, email : myEmail, data:'未定'});
            else
                this.props.socket.emit('step', {step: 50, email : myEmail, data:userInfo['resetMortgage']+'万円'});
        }
        if(step == 50 && step == curStep){
            var temp = '大人'+familyList[userInfo['family1']]['label']+', 子供 小学生以下'+familyList[userInfo['family2']]['label']+', 子供 中学生以上'+familyList[userInfo['family3']]['label'];
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:temp});
        }
        if(step == 51 && step == curStep){
            this.props.socket.emit('step', {step: step + 1, email : myEmail, data:userInfo['reference'] === null ? '' : referenceList[userInfo['reference']]['label']});
        }
        
        if(userInfo['hope1'] != '' && userInfo['hope1'] != null){
            this.searchHope('hope1', userInfo['hope1']);
        }
        if(userInfo['hope2'] != '' && userInfo['hope2'] != null){
            this.searchHope('hope2', userInfo['hope2']);
        }
        if(userInfo['hope3'] != '' && userInfo['hope3'] != null){
            this.searchHope('hope3', userInfo['hope3']);
        }
    }

    searchHope(key, value){
        for(var i = 0;i<this.state.area_list.length;i++){
            for(var j = 0;j<this.state.area_list[i].length;j++){
                if(value == this.state.area_list[i][j]){
                    if(key == 'hope1'){
                        userInfo['hopeP1'] = i+1;
                        userInfo['hope1'] = j+1;
                        userInfo['hopeVal'] = this.state.area_list[i][j];
                    }
                    if(key == 'hope2'){
                        userInfo['hopeP2'] = i+1;
                        userInfo['hope2'] = j+1;
                        if(userInfo['hopeVal'] != '')
                            userInfo['hopeVal'] = userInfo['hopeVal'] + "," + this.state.area_list[i][j];
                        else
                            userInfo['hopeVal'] = this.state.area_list[i][j];
                    }
                    if(key == 'hope3'){
                        userInfo['hopeP3'] = i+1;
                        userInfo['hope3'] = j+1;
                        if(userInfo['hopeVal'] != '')
                            userInfo['hopeVal'] = userInfo['hopeVal'] + "," + this.state.area_list[i][j];
                        else
                            userInfo['hopeVal'] = this.state.area_list[i][j];
                    }
                    break;
                }
            }
        }
    }

    changeVal(key, value){
        if(key == 'employment'){
            if(value == 5)
                this.setState({employmentInput: true});
            else
                this.setState({employmentInput: false});
        }
        if(key == 'employment1'){
            if(value == 5)
                this.setState({employmentInput1: true});
            else
                this.setState({employmentInput1: false});
        }
        if(key == 'employment2'){
            if(value == 5)
                this.setState({employmentInput2: true});
            else
                this.setState({employmentInput2: false});
        }
        if(key == 'postCode' && value.length == 7)
            this.getAddrFromZip(value)
        userInfo[key] = value;

    }

    tutorial(){
        getUserInfo(userInfo['email'])
        .then(async (response) => {
            await AsyncStorage.setItem('user', JSON.stringify(response.data[0]));
            this.props.navigation.push('Tutorial');
        });
    }

    render(){
        const animateUserStyle = {
            transform: [{
                translateX: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                  }),
            }],
            opacity: this.state.fadeAnim
        }
        const animateBotStyle = {
            transform: [{
                translateX: this.state.fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                }),
            }],
            opacity: this.state.fadeAnim
        }
        let touchBtn = <View style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => this.userAnswer(this.props.step)} style={styles.btnSection}>
                <Text style={styles.confirmBtn} >次へ</Text>
            </TouchableOpacity>
        </View>;
        let sendBtn = <View style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}>
            
            <TouchableOpacity onPress={() => this.userAnswer(this.props.step)} style={styles.btnSection}>
                <Text style={styles.confirmBtn} >送信する</Text>
            </TouchableOpacity>
        </View>;

        
        
        if(this.props.type == 'bot'){
            if(this.props.step != 8)
                return (
                    <Animated.View style={[styles.botSection, animateBotStyle]}>
                        <View style={styles.botLogo}>
                            <Image style={styles.logo} source={require('../assets/images/bot_logo.png')} />
                            <Text style={styles.botName}>SEIMU</Text>
                        </View>
                        <View style={styles.botChat}>
                            <Image source={require("../assets/images/bot-mark.png")} style={{marginTop: 5, width: 15, marginLeft: 5}} resizeMode="contain" />
                            <View style={styles.chatText}>
                                <Text style={styles.chatTextSize}>{this.props.data}</Text>
                            </View>
                        </View>
                    </Animated.View>
                )
            else
                return (
                    <Animated.View style={[styles.botSection, animateBotStyle]}>
                        <View style={styles.botLogo}>
                            <Image style={styles.logo} source={require('../assets/images/bot_logo.png')} />
                            <Text style={styles.botName}>SEIMU</Text>
                        </View>
                        <View style={styles.botChat}>
                            <Image source={require("../assets/images/bot-mark.png")} style={{marginTop: 5, width: 15}} resizeMode="contain" />
                            <View style={[styles.chatText,{height: 60}]}>
                                <RadioForm
                                    radio_props={radio_props}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    animation={false}
                                    initial={-1}
                                    buttonColor={'#f59392'}
                                    selectedButtonColor={'#f59392'}
                                    onPress={(val) => {
                                        this.changeVal('mainAddr',val)
                                        this.userAnswer(this.props.step)
                                    }}
                                    />
                            </View>
                        </View>
                    </Animated.View>
                )   
        }
        else{
            if(this.props.step == 2)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={styles.inputPart}>
                                <TextInput
                                    style={this.state.user_name_1_err? [styles.nameInput, styles.invalid, styles.halfWidth]:[styles.nameInput, styles.halfWidth]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('user_name_1',val)}
                                    placeholder='姓（漢字）'
                                    onSubmitEditing={() => this.uname.focus()}/>
                                <TextInput 
                                    style={this.state.user_name_2_err? [styles.nameInput, styles.invalid, styles.halfWidth]:[styles.nameInput, styles.halfWidth]} 
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('user_name_2', val)}
                                    placeholder='名（漢字）'
                                    ref={ref => {this.uname = ref;}}
                                    onSubmitEditing={() => {this.userAnswer(this.props.step);}}
                                    />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 3)  
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={styles.inputPart}>
                                <TextInput
                                    style={this.state.user_name_kata_1_err? [styles.nameInput, styles.invalid, styles.halfWidth]:[styles.nameInput, styles.halfWidth]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    defaultValue={userInfo['user_name_kata_1']}
                                    onChangeText={val=>this.changeVal('user_name_kata_1',val)}
                                    placeholder='姓（カナ）'
                                    ref={ref => {this.ukname1 = ref;}}
                                    onSubmitEditing={() => this.ukname.focus()}/>
                                <TextInput 
                                    style={this.state.user_name_kata_2_err? [styles.nameInput, styles.invalid, styles.halfWidth]:[styles.nameInput, styles.halfWidth]} 
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    defaultValue={userInfo['user_name_kata_2']}
                                    onChangeText={val=>this.changeVal('user_name_kata_2',val)}
                                    placeholder='名（カナ）'
                                    ref={ref => {this.ukname = ref;}}
                                    onSubmitEditing={() => this.userAnswer(this.props.step)}/>
                            </View>
                            <View style={this.state.user_name_kata_1_err || this.state.user_name_kata_2_err ? {display:'flex'} : {display:'none'}}>
                                <Text style={{color: '#de4540'}}>姓名（カナ）に使用できない文字が含まれています。</Text>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 4)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View >
                                <View style={{paddingBottom: 10}}>
                                    <Text>郵便番号</Text>
                                </View>
                                <View style={{paddingBottom: 10}}>
                                    <TextInput
                                        style={this.state.postCode_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        keyboardType={'numeric'}
                                        onChangeText={val=>this.changeVal('postCode', val)}
                                        onSubmitEditing={() => this.userAnswer(this.props.step)}
                                        placeholder='5380035(ハイフンなし)'/>
                                </View>
                                <View style={{paddingBottom: 10}}>
                                    <Text>都道府県市区町村</Text>
                                </View>
                                <View style={{paddingBottom: 10}}>
                                    <TextInput
                                        style={this.state.city_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        defaultValue={userInfo['city']}
                                        onChangeText={val=>this.changeVal('city', val)}
                                        placeholder='住所'/>
                                </View>
                                <View style={{paddingBottom: 10}}>
                                    <Text>番地以降</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={this.state.street_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        defaultValue={userInfo['street']}
                                        onChangeText={val=>this.changeVal('street', val)}
                                        placeholder='住所'/>
                                </View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 5)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <View>
                                    <TextInput
                                        style={this.state.birth_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                        returnKeyType="go"
                                        keyboardType={'numeric'}
                                        onChangeText={val=>this.changeVal('birth', val)}
                                        onSubmitEditing={() => {this.userAnswer(this.props.step);this.phone1.focus()}}
                                        placeholder='19890101'/>
                                </View>
                                <View style={{paddingTop: 10}}>
                                    <Text>例 : 1989年1月1日生まれ&rarr;19890101</Text>
                                </View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 6)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{paddingBottom: 10}}>
                                <Text>携帯電話</Text>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                                <TextInput
                                    style={this.state.phone1_err? [styles.nameInput, styles.invalid, styles.thirdWidth]:[styles.nameInput, styles.thirdWidth]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    keyboardType={'numeric'}
                                    onChangeText={(val)=>{
                                        this.changeVal('phone1', val)
                                        if(val.length >= 3)
                                            this.phone2.focus()
                                    }}
                                    placeholder='000'
                                    maxLength={3}
                                    ref={ref => {this.phone1 = ref;}}
                                    onSubmitEditing={() => this.phone2.focus()}/>
                                
                                    <Text>&nbsp;-&nbsp;</Text>
                                
                                <TextInput
                                    style={this.state.phone2_err? [styles.nameInput, styles.invalid, styles.thirdWidth]:[styles.nameInput, styles.thirdWidth]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    keyboardType={'numeric'}
                                    onChangeText={(val)=>{
                                        this.changeVal('phone2', val)
                                        if(val.length >= 4)
                                            this.phone3.focus()
                                    }}
                                    placeholder='0000'
                                    maxLength={4}
                                    ref={ref => {this.phone2 = ref;}}
                                    onSubmitEditing={() => this.phone3.focus()}/>
                                
                                    <Text>&nbsp;-&nbsp;</Text>
                                
                                <TextInput
                                    style={this.state.phone3_err? [styles.nameInput, styles.invalid, styles.thirdWidth]:[styles.nameInput, styles.thirdWidth]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    keyboardType={'numeric'}
                                    onChangeText={(val)=>{
                                        this.changeVal('phone3', val)
                                        if(val.length >= 4)
                                            this.hphone.focus()
                                    }}
                                    placeholder='0000'
                                    maxLength={4}
                                    ref={ref => {this.phone3 = ref;}}
                                    onSubmitEditing={() => this.hphone.focus()}/>
                            </View>
                            <View style={{paddingBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
                                <Text>ご自宅</Text>
                                <View style={{backgroundColor: '#65abcf', marginLeft: 15, paddingVertical: 3, paddingHorizontal: 10}}>
                                    <Text style={{color: 'white'}}>任意</Text>
                                </View>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={this.state.hphone_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    keyboardType={'numeric'}
                                    onChangeText={val=>this.changeVal('hphone', val)}
                                    placeholder='1234567890'
                                    ref={ref => {this.hphone = ref;}}
                                    onSubmitEditing={() => this.userAnswer(this.props.step)}/>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 10)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View >
                                <TextInput
                                    style={this.state.email_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    keyboardType={'email-address'}
                                    onChangeText={val=>this.changeVal('email', val)}
                                    onSubmitEditing={() => this.userAnswer(this.props.step)}
                                    placeholder='メールアドレスを入力'/>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Text>※入力いただくアドレスが、ログインにお使いいただくIDになります。</Text>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 11)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View >
                                <TextInput
                                    style={this.state.pwd_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                    secureTextEntry={true}
                                    onChangeText={val=>this.changeVal('password', val)}
                                    onSubmitEditing={() => this.confirmPwd.focus()}
                                    placeholder='半角英数字8~20文字で入力してください。'/>
                            </View>
                            <View style={{marginTop: 10}}>
                                <TextInput
                                    style={this.state.pwd_err? [styles.nameInput, styles.invalid]:[styles.nameInput]} 
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    placeholderTextColor='rgba(0, 0, 0, 0.4 )'
                                    ref={ref => {this.confirmPwd = ref;}}
                                    secureTextEntry={true}
                                    onChangeText={val=>this.changeVal('confirmPassword', val)}
                                    onSubmitEditing={() => this.userAnswer(this.props.step)}
                                    placeholder='確認のため、パスワードを再入力してください。'/>
                            </View>
                            {
                                this.state.pwd_err ?
                                <View>
                                    <Text style={{color: 'red', paddingTop: 10}}>8桁で正しく入力してください</Text>
                                </View>
                                :
                                this.state.pwd_match_err ?
                                <View>
                                    <Text style={{color: 'red', paddingTop: 10}}>パスワードと再入力パスワードが一致しません。</Text>
                                </View>
                                :
                                null
                            }
                            
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 13)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <Text>ご希望の物件を選択してください。</Text>
                            </View>
                            <View>
                                <Text>＊複数選択可</Text>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.proClick(0)}>
                                        <Text style={this.state.proBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[0]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.proClick(1)}>
                                        <Text style={this.state.proBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[1]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.proClick(2)}>
                                        <Text style={this.state.proBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[2]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.proClick(3)}>
                                        <Text style={this.state.proBtns[3]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[3]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.proClick(4)}>
                                        <Text style={this.state.proBtns[4]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>その他</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                </View>
                            </View>
                            <View style={proInput? {paddingTop: 10, display:'flex'} : {paddingTop: 10, display: 'none'}}>
                                <TextInput
                                    style={this.state.proInput_err? [styles.nameInput, styles.invalid, {paddingLeft: 10}]:[styles.nameInput, {paddingLeft: 10}]} 
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('proInputVal', val)}>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 14)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <Text>ご希望のエリアを選択してください。</Text>
                            </View>
                            <View>
                                <Text>＊複数選択可</Text>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(0)}>
                                        <Text style={this.state.hopeBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>大阪市内エリア</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(1)}>
                                        <Text style={this.state.hopeBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>北大阪エリア</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(2)}>
                                        <Text style={this.state.hopeBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>東部大阪エリア</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(3)}>
                                        <Text style={this.state.hopeBtns[3]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>南大阪エリア</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(4)}>
                                        <Text style={this.state.hopeBtns[4]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>大阪府外エリア</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.hopeClick(5)}>
                                        <Text style={this.state.hopeBtns[5]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>検討中</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.inputSection, {marginTop: 10}]}>
                            {
                                this.state.checkingBtn ?
                                null
                                :
                                <View>
                                    <RNPickerSelect
                                        placeholder={{label:"第一候補", value: ''}}
                                        style={picker}
                                        onValueChange={(itemValue) => {this.changeVal('hope1', itemValue); this.setState({hope1: itemValue})}}
                                        items={this.state.hope_list}
                                    />
                                    <View style={{height: 10}}></View>
                                    <RNPickerSelect
                                        placeholder={{label:"第二候補", value: ''}}
                                        style={picker}
                                        onValueChange={(itemValue) => {this.changeVal('hope2', itemValue); this.setState({hope2: itemValue})}}
                                        items={this.state.hope_list}
                                    />
                                    <View style={{height: 10}}></View>
                                    <RNPickerSelect
                                        placeholder={{label:"第三候補", value: ''}}
                                        style={picker}
                                        onValueChange={(itemValue) => {this.changeVal('hope3', itemValue); this.setState({hope3: itemValue})}}
                                        items={this.state.hope_list}
                                    />
                                </View>
                            }
                            
                            
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 15)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.budget_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['budget'] = itemValue;this.setState({budget: itemValue})}}
                                    items={budgetList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 16)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.monthBudget_err? [styles.invalid]:[]}>   
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['monthBudget'] = itemValue;this.setState({monthBudget: itemValue})}}
                                    items={monthList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 18)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{paddingBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
                                <Text>ご質問・ご要望</Text>
                                <View style={{backgroundColor: '#65abcf', marginLeft: 15, paddingVertical: 3, paddingHorizontal: 10}}>
                                    <Text style={{color: 'white'}}>任意</Text>
                                </View>
                            </View>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('desc', val)}
                                    placeholder='質問・要望などがございましたらご記入ください。'>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 19)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name={'square'}/>
                                <Text>  ご入力内容</Text>
                            </View>
                            <View>
                                <Text>お名前: {userInfo['user_name_1']}{userInfo['user_name_2']}</Text>
                            </View>
                            <View>
                                <Text>フリガナ: {userInfo['user_name_kata_1']}{userInfo['user_name_kata_2']}</Text>
                            </View>
                            <View>
                                <Text>住所: {userInfo['postCode']}</Text>
                                {
                                   userInfo['city'] != '' ? <Text>{userInfo['city']}{userInfo['street']}</Text> : null
                                }
                            </View>
                            <View>
                                <Text>生年月日: {userInfo['birth']}</Text>
                            </View>
                            <View>
                                <Text>携帯電話: {userInfo['phone1']}{userInfo['phone2']}{userInfo['phone3']}</Text>
                            </View>
                            {
                                userInfo['hphone'] == '' ? null : <View><Text>自宅電話: {userInfo['hphone']}</Text><Text>希望お電話先: {radio_props[userInfo['mainAddr']]['label']}</Text></View>
                            }
                            <View>
                                <Text>メールアドレス: {userInfo['email']}</Text>
                            </View>
                            <View>
                                <Text>希望物件: {userInfo['proVal']}</Text>
                            </View>
                            <View>
                                <Text>希望エリア: {userInfo['hopeVal']}</Text>
                            </View>
                            <View>
                                <Text>予算: {budgetList[userInfo['budget']]['label']}</Text>
                            </View>
                            <View>
                                <Text>月々の支払額: {monthList[userInfo['monthBudget']]['label']}</Text>
                            </View>
                            {
                                userInfo['desc'] == '' ? null : 
                                <View>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name={'caret-down'} /><Text>  ご質問・ご要望</Text>
                                    </View>
                                    <Text>
                                        {userInfo['desc']}
                                    </Text>
                                </View>
                            }
                            <View style={styles.policySection}>
                                <Text style={styles.policy}>
                                    以下では、株式会社seimu（以下当社といいます。）が管理、運営するすべてのサイト・サービス（以下「本サービス」といいます。）を利用する客さま（以下「利用者」といいます。）と当社との間に適用される条件等を定めています。利用者が本サービスを利用する制には、以下の内容に同意の上、ご利用いただくようお願いします。お、当社は、適宜、以下の内容を変更することができるものとします。プライバシーポリシー
                                </Text>
                            </View>
                            {sendBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 22)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.thingClick(0, this.props.step)} >
                                        <Text style={this.state.thingBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[0]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.thingClick(1, this.props.step)} >
                                        <Text style={this.state.thingBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[1]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.thingClick(2, this.props.step)} >
                                        <Text style={this.state.thingBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[2]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.thingClick(3, this.props.step)} >
                                        <Text style={this.state.thingBtns[3]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{proList[3]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 23)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>   
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['floor'] = itemValue;}}
                                    items={floorList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 24)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['floorPlan'] = itemValue;}}
                                    items={floorPlanList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 25)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['garage'] = itemValue;}}
                                    items={garageList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 26)
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('desireLine', val)}>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            else if(this.props.step == 27){
                if(thingBtns[0] || thingBtns[1] || thingBtns[3]){
                    return (
                        <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                            <View style={styles.inputSection}>
                                <View>
                                    <RNPickerSelect
                                        placeholder={{label:"選択する", value: ''}}
                                        style={picker}
                                        onValueChange={(itemValue) => {userInfo['desireMin'] = itemValue;}}
                                        items={desireMinList1}
                                    />
                                </View>
                                {touchBtn}
                            </View>
                        </Animated.View>
                    )
                }else{
                    return (
                        <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                            <View style={styles.inputSection}>
                                <View>
                                    <RNPickerSelect
                                        placeholder={{label:"選択する", value: ''}}
                                        style={picker}
                                        onValueChange={(itemValue) => {userInfo['desireMin'] = itemValue;}}
                                        items={desireMinList2}
                                    />
                                </View>
                                {touchBtn}
                            </View>
                        </Animated.View>
                    )
                }
            }
            else if(this.props.step == 28){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => this.setState({calendar_show : !this.state.calendar_show})} >
                                    <Text style={styles.proBtn}>日付を選択する</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.calendar_show ?
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    timeZoneOffsetInMinutes={0}
                                    mode={"date"}
                                    locale="ja"
                                    display="calendar"
                                    value={userInfo['move_in'] == '' ? new Date() : new Date(userInfo['move_in'])}
                                    onChange = {this.onChange}
                                />
                                :
                                null
                            }
                            {
                                Platform.OS == 'android' && userInfo['move_in'] != ''?
                                <Text style={styles.chatTextSize}>{userInfo['move_in']}</Text>
                                :
                                null
                            }
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 29){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.userAnswer(this.props.step);this.mortgageClick(0);}} >
                                        <Text style={this.state.mortgagaBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>利用しています</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.userAnswer(this.props.step);this.mortgageClick(1);}} >
                                        <Text style={this.state.mortgagaBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>利用していません</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 30){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.allonClick(0);}} >
                                        <Text style={this.state.allonBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>1 人</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.allonClick(1);}} >
                                        <Text style={this.state.allonBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>2 人</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.allonClick(2);}} >
                                        <Text style={this.state.allonBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>未定</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 31){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.prevYearBudget_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['prevYearBudget'] = itemValue;}}
                                    items={prevYearBudgetList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 32){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('companyName', val)}>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 33){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.service_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['service'] = itemValue;}}
                                    items={serviceList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 34){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.employment_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['employment'] = itemValue; this.changeVal('employment', itemValue);}}
                                    items={employmentList}
                                />
                            </View>
                            {
                                this.state.employmentInput ?
                                <View style={{marginTop: 10}}>
                                    <TextInput
                                        style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                        multiline
                                        numberOfLines={5}
                                        autoCapitalize="none"
                                        onChangeText={val=>this.changeVal('employmentIput', val)}>
                                    </TextInput>
                                </View>
                                : null
                            }
                            
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 35){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.prevYearBudget1_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['prevYearBudget1'] = itemValue;}}
                                    items={prevYearBudgetList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 36){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('companyName1', val)}>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 37){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.service1_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['service1'] = itemValue;}}
                                    items={serviceList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 38){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.employment1_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {this.changeVal('employment1', itemValue);}}
                                    items={employmentList}
                                />
                            </View>
                            {
                                this.state.employmentInput1 ?
                                <View style={{marginTop: 10}}>
                                    <TextInput
                                        style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                        multiline
                                        numberOfLines={5}
                                        autoCapitalize="none"
                                        onChangeText={val=>this.changeVal('employmentIput1', val)}>
                                    </TextInput>
                                </View>
                                : null
                            }
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 39){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.prevYearBudget2_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['prevYearBudget2'] = itemValue;}}
                                    items={prevYearBudgetList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 40){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('companyName2', val)}>
                                </TextInput>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 41){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.service2_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['service2'] = itemValue;}}
                                    items={serviceList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 42){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={this.state.employment2_err? [styles.invalid]:[]}>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {this.changeVal('employment2', itemValue);}}
                                    items={employmentList}
                                />
                            </View>
                            {
                                this.state.employmentInput2 ?
                                <View style={{marginTop: 10}}>
                                    <TextInput
                                        style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                        multiline
                                        numberOfLines={5}
                                        autoCapitalize="none"
                                        onChangeText={val=>this.changeVal('employmentIput2', val)}>
                                    </TextInput>
                                </View>
                                : null
                            }
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 43){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.curTypeClick(0)} >
                                        <Text style={this.state.curTypeBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>賃貸</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.curTypeClick(1)} >
                                        <Text style={this.state.curTypeBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>持ち家</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.curTypeClick(2)} >
                                        <Text style={this.state.curTypeBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>その他</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1}}></View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                ) 
            }
            else if(this.props.step == 44){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['curRent'] = itemValue;}}
                                    items={curRentList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 45){
                return(
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.planSellClick(0)} >
                                        <Text style={this.state.planSellBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>はい</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.planSellClick(1)} >
                                        <Text style={this.state.planSellBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>いいえ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => this.planSellClick(2)} >
                                        <Text style={this.state.planSellBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>未定</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 46){
                return(
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.thingListClick(0)}} >
                                        <Text style={this.state.thingListBtns[0]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{thingList[0]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.thingListClick(1)}} >
                                        <Text style={this.state.thingListBtns[1]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{thingList[1]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.thingListClick(2)}} >
                                        <Text style={this.state.thingListBtns[2]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{thingList[2]}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.thingListClick(3)}} >
                                        <Text style={this.state.thingListBtns[3]? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>{thingList[3]}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 47){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <TextInput
                                    style={[styles.nameInput, {justifyContent: "flex-start", height: 100, textAlignVertical: 'top'}]} 
                                    multiline
                                    numberOfLines={5}
                                    autoCapitalize="none"
                                    onChangeText={val=>this.changeVal('addrPlanSale', val)}>
                                </TextInput>
                            </View>
                            <View>
                                <CheckBox
                                    title='現在お住いの住所と同上'
                                    checked={this.state.checkAddrPlanSale}
                                    onPress={() => this.setState({checkAddrPlanSale: !this.state.checkAddrPlanSale})}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 48){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={[styles.nameInput, styles.thirdWidth]}
                                    returnKeyType="next"
                                    keyboardType={'numeric'}
                                    onChangeText={val=>this.changeVal('resetMortgage',val)}
                                    />
                                <Text>万円</Text>
                            </View>
                            <View style={{flex: 2,flexDirection: 'row',width: '100%', paddingTop: 10}}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity onPress={() => {this.setState({resetMortgageBtns: !this.state.resetMortgageBtns})}} >
                                        <Text style={this.state.resetMortgageBtns? [styles.proBtn, styles.proBtnClicked] : [styles.proBtn]}>未定</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1}}></View>
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                    
                )
            }
            else if(this.props.step == 50){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <Text>大人</Text>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['family1'] = itemValue;}}
                                    items={familyList}
                                />
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text>子供 小学生以下</Text>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['family2'] = itemValue;}}
                                    items={familyList}
                                />
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text>子供 中学生以上</Text>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['family3'] = itemValue;}}
                                    items={familyList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else if(this.props.step == 51){
                return (
                    <Animated.View style={[styles.userChatSection, animateUserStyle]}>
                        <View style={styles.inputSection}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{label:"選択する", value: ''}}
                                    style={picker}
                                    onValueChange={(itemValue) => {userInfo['reference'] = itemValue;}}
                                    items={referenceList}
                                />
                            </View>
                            {touchBtn}
                        </View>
                    </Animated.View>
                )
            }
            else
                return (
                    <View style={{justifyContent: 'center', width: '50%', marginTop: 15, marginLeft: '25%'}}>
                        {
                            /*<TouchableOpacity onPress={() => this.tutorial()}>
                                <View style={{backgroundColor: '#df4543', padding: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: 'white'}}>アプリTOPへ</Text>
                                </View>
                            </TouchableOpacity>*/
                        }
                    </View>
                )
        }
    }
}

Signup.navigationOptions = {
    header: null,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomQuestionCnt: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 20 : 10,
      left: 10,
      zIndex: 999
  },
  curProgress: {
      color: '#000',
      paddingLeft: 10,
      paddingTop: 10,
  },
  skip: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 20 : 10,
      right: 10
  },
  chatSection: {
      width: '100%',
      height: Platform.OS === 'ios' ? getScreenHeight() - Constants.statusBarHeight - 44: getScreenHeight() - Constants.statusBarHeight - 42,
      paddingBottom: 20
  },
  botSection: {
      paddingTop: 35,
      paddingBottom: 0,
      paddingLeft: 20,
      paddingRight: 20,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start'
  },
  botLogo: {
      width: '17%',
      justifyContent: 'center',
      alignItems: 'center'
  },
  botChat: {
      width: '83%',
      display: 'flex',
      flexDirection: 'row',
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
      margin: 'auto'
  },
  chatText: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 15,
      paddingBottom: 15,
  },
  chatTextSize: {
      fontSize: 13,
      color: '#000',
      fontWeight: 'bold',
  },
  userChatSection: {
    paddingTop: 35,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  },
  inputSection: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  btnSection: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: '#df2d2b',
      width: '60%',
  },
  confirmBtn: {
      color: '#fff',
      paddingVertical: 10,
      textAlign: 'center',
      borderRadius: 20,
      margin: 'auto',
      alignSelf: 'center',
  },
  inputPart: {
      display: 'flex',
      flexDirection: 'row'
  },
  halfWidth: {
      width: '50%',
  },
  nameInput: {
        width: '100%',
        padding: 10,
        paddingLeft: 15,
        marginRight:3,
        fontSize: 13,
        borderWidth: 1,
        borderColor: '#f8babb',
        backgroundColor: '#fde3e4',
        color: '#000',
        fontWeight:'bold'
    },
  invalid: {
      borderWidth: 1,
      borderColor: 'red'
  },
  thirdWidth: {
      width: '30%'
  },
  proBtn: {
      color: 'black',
      textAlign: 'center',
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: '#fde3e4',
      marginRight: 10,
      fontWeight: 'bold'
  },
  proBtnClicked: {
      backgroundColor: '#f79393',
      color: 'white'
  },
  picker: {
    height: 40, 
    width: '100%', 
    backgroundColor: '#fde3e4', 
  },
  policySection: {
    backgroundColor: '#eee',
    padding: 10,
    height: 150,
  },
  policy: {
    fontSize: 11
  },
  close: {
    position: 'absolute',
    borderRadius: 11,
    right:5,
    top: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999999
},
});
var picker = StyleSheet.create({
    inputIOS: {
        height: 40, width: '100%', backgroundColor: '#fde3e4', borderColor: '#fde3e4', color: 'black', paddingLeft: 15
    },
    inputAndroid: {
        height: 40, width: '100%', backgroundColor: '#fde3e4', borderColor: '#fde3e4', color: 'black', paddingLeft: 15
    },
})
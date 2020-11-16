import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  AsyncStorage
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import uuid from 'uuid';
import { Context } from '../constants/Context';
import { createEvent } from '../components/Api';
import { showToast } from '../components/Global';

export default class CreateTask extends Component {
  state = {
    selectedDay: {
      [`${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`]: {
        selected: true,
        selectedColor: '#2E66E7',
      },
    },
    currentDay: moment().format(),
    taskText: '',
    notesText: '',
    keyboardHeight: 0,
    visibleHeight: Dimensions.get('window').height,
    alarmTime: moment().format('hh:mm'),
    isDateTimePickerVisible: false,
    creatTodo: {},
    createEventAsyncRes: '',
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide
    );
    
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      visibleHeight:
        Dimensions.get('window').height - e.endCoordinates.height - 30,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      visibleHeight: Dimensions.get('window').height,
    });
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleCreateEventData = async value => {
    const {
      state: {
        currentDay,
        taskText,
        notesText,
        alarmTime,
      },
      props: { navigation },
    } = this;
    const { currentDate } = navigation.state.params;
    const creatTodo = {
      todoList: [
        {
          key: uuid(),
          title: taskText,
          notes: notesText,
          date: `${moment(currentDay).format('YYYY')}-${moment(currentDay).format('MM')}-${moment(currentDay).format('DD')}`,
          alarm: {
            time: alarmTime,
          },
          color: `rgb(${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))},${Math.floor(Math.random() * Math.floor(256))})`,
        },
      ],
    };
    
    const user_info = JSON.parse(await AsyncStorage.getItem('user'));
    createEvent(creatTodo.todoList, user_info.id)
    .then((response) => {
        //this.setState({loaded: true});
        if(response.data == false){
          showToast('イベントの作成に失敗しました!');
          return;
        } else{
          navigation.state.params.updateCurrentTask();
          navigation.navigate('MyCalendar');
        }
    })
    .catch((error) => {
        //this.setState({loaded: true});
        showToast();
    });
  };

  _handleDatePicked = date => {
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    this.setState({
      alarmTime: hour+":"+minute,
    });
    this._hideDateTimePicker();
  };

  render() {
    const {
      state: {
        selectedDay,
        currentDay,
        taskText,
        notesText,
        alarmTime,
        isDateTimePickerVisible,
      },
      props: { navigation },
    } = this;

    return (
      <Context.Consumer>
        {value => (
          <>
            <DateTimePicker
              isVisible={isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              mode="time"
            />
            <View style={styles.container}>
            <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
              <View>
              <KeyboardAvoidingView behavior="position">
                <ScrollView>
                  <View style={styles.calenderContainer}>
                    <CalendarList style={{ width: '100%',height: 350,}}
                      current={currentDay}
                      minDate={moment().format()}
                      horizontal
                      pastScrollRange={0}
                      pagingEnabled
                      calendarWidth={350}
                      onDayPress={day => {
                        this.setState({
                          selectedDay: {
                            [day.dateString]: {
                              selected: true,
                              selectedColor: '#2E66E7',
                            },
                          },
                          currentDay: day.dateString,
                        });
                        this.getTimeList(day.dateString);
                      }}
                      monthFormat="yyyy MMMM"
                      hideArrows
                      markingType="simple"
                      theme={{
                        selectedDayBackgroundColor: '#2E66E7',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#2E66E7',
                        backgroundColor: '#eaeef7',
                        calendarBackground: '#eaeef7',
                        textDisabledColor: '#d9dbe0',
                      }}
                      markedDates={selectedDay}
                    />
                  </View>
                  
                    <View style={styles.taskContainer}>
                      
                        <TextInput style={styles.title} onChangeText={text => this.setState({ taskText: text })} value={taskText} placeholder="件名"
                          returnKeyType="next" onSubmitEditing={() => this.desc.focus()}
                        />
                      
                      <View style={styles.notesContent} />
                      <View>
                        <Text style={styles.notes}>メモ</Text>
                        <TextInput style={{ height: 25, fontSize: 19, marginTop: 3, }}
                          onChangeText={text => this.setState({ notesText: text }) }
                          value={notesText}
                          ref={ref => {this.desc = ref;}}
                          returnKeyType="next"
                          placeholder="メモ"
                        />
                      </View>
                      <View style={styles.seperator} />
                      <View>
                        <Text style={{ color: '#9CAAC4',fontSize: 16,fontWeight: '600',}}>時間</Text>
                        <TouchableOpacity
                          onPress={() => this._showDateTimePicker()}
                          style={{height: 25,marginTop: 3,}}
                        >
                          <Text style={{ fontSize: 19 }}>
                            {alarmTime}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  <TouchableOpacity
                    disabled={taskText === ''}
                    style={[styles.createTaskButton,{backgroundColor:taskText === ''? 'rgba(46, 102, 231,0.5)': '#2E66E7',zIndex: 9999999, marginBottom: 80},]}
                    onPress={async () => {this._handleCreateEventData(value);}}
                  >
                    <Text style={{fontSize: 18,textAlign: 'center',color: '#fff',}}>
                      イベントを作成する
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
              </View>
              </TouchableWithoutFeedback>
            </View>
          </>
        )}
      </Context.Consumer>
    );
  }
}

CreateTask.navigationOptions = {
  headerTitle: 'イベントを作成',
  headerRight: <View></View>
};

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  seperator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  notes: {
    color: '#9CAAC4',
    fontSize: 16,
    fontWeight: '600',
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 20,
  },
  learn: {
    height: 23,
    width: 51,
    backgroundColor: '#F8D557',
    justifyContent: 'center',
    borderRadius: 5,
  },
  design: {
    height: 23,
    width: 59,
    backgroundColor: '#62CCFB',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    width: 83,
    backgroundColor: '#4CD565',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 250,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
  },
  calenderContainer: {
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  newTask: {
    alignSelf: 'center',
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#eaeef7',
  },
});
import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import moment from 'moment';
import * as Calendar from 'expo-calendar';

import CalendarStrip from 'react-native-calendar-strip';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Context } from '../constants/Context';
import { Task } from '../components/Task';
import Icon from "react-native-vector-icons/FontAwesome";
import { getEvents, deleteEvent, updateEvent } from '../components/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { showToast } from '../components/Global';

export default class MyCalendar extends Component {
  state = {
    datesWhitelist: [
      {
        start: moment('1970-01-01'),
        end: moment().add(365, 'days'), // total 4 days enabled
      },
    ],
    todoList: [],
    markedDate: [],
    currentDate: `${moment().format('YYYY')}-${moment().format('MM')}-${moment().format('DD')}`,
    isModalVisible: false,
    selectedTask: null,
    isDateTimePickerVisible: false,
    loaded: false,
    user_info: []
  };

  async componentDidMount(){
    let userInfo = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({user_info : userInfo});
    this._updateCurrentTask();
  }

  componentWillUnmount(){
  }

  _handleModalVisible = () => {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
    });
  };

  _updateCurrentTask = async currentDate => {
    try {
      this.setState({loaded: false});
      getEvents(this.state.user_info.id)
      .then((response) => {
          const todoList = response.data.filter((item) => {
            if(this.state.currentDate == item.date){
              return true;
            }
            return false;
          })
          const markDot = response.data.map((item) => {
            return {
              date: item.date,
              dots: [
                {
                  color: "#2E66E7",
                  key: "e5ead4e0-ca3c-408f-8b9d-3d9b030d3df1",
                  selectedDotColor: "#2E66E7",
                }
              ]
            }
          });
          this.setState({markedDate: markDot})
          this.setState({todoList: todoList})
          this.setState({loaded: true});
          return;
      })
      .catch((error) => {
          this.setState({loaded: true});
          showToast();
      });
    } catch (error) {
      // Error retrieving data
    }
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    const { selectedTask } = this.state;
    const prevSelectedTask = { ...selectedTask };
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    prevSelectedTask.time = hour+":"+minute;
    this.setState({
      selectedTask: prevSelectedTask,
    });

    this._hideDateTimePicker();
  };
  
  _getEvent = async () => {
    const { selectedTask } = this.state;
  };

  _findCalendars = async () => {
    const calendars = await Calendar.getCalendarsAsync();

    return calendars;
  };

  _createNewCalendar = async () => {
    const calendars = await this._findCalendars();
    const newCalendar = {
      title: 'test',
      entityType: Calendar.EntityTypes.EVENT,
      color: '#2196F3',
      sourceId:
        Platform.OS === 'ios'
          ? calendars.find(cal => cal.source && cal.source.name === 'Default')
              .source.id
          : undefined,
      source:
        Platform.OS === 'android'
          ? {
              name: calendars.find(
                cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
              ).source.name,
              isLocalAccount: true,
            }
          : undefined,
      name: 'test',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
      ownerAccount:
        Platform.OS === 'android'
          ? calendars.find(
              cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
            ).ownerAccount
          : undefined,
    };

    let calendarId = null;

    try {
      calendarId = await Calendar.createCalendarAsync(newCalendar);
    } catch (e) {
      Alert.alert(e.message);
    }

    return calendarId;
  };

  deleteSelectedTask(curDate, curTask){
    deleteEvent(curTask)
    .then((response) => {
        this._updateCurrentTask(curDate);
        return;
    })
    .catch((error) => {
        showToast();
    });
  }

  updateSelectedTask(curDate, curTask){
    updateEvent(curTask)
    .then((response) => {
        this._updateCurrentTask(curDate);
        
        return;
    })
    .catch((error) => {
        showToast();
    });
  }

  render() {
    const {
      state: {
        datesWhitelist,
        markedDate,
        todoList,
        isModalVisible,
        selectedTask,
        isDateTimePickerVisible,
        currentDate,
        loaded
      },
      props: { navigation },
    } = this;

    return (
      <Context.Consumer>
        {value => (
          <>
            {selectedTask !== null && (
              <Task isModalVisible={isModalVisible}>
                <DateTimePicker
                  isVisible={isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                  mode="time"
                />
                <View style={styles.taskContainer}>
                  <TouchableOpacity onPress={() => this._handleModalVisible()} style={{position: 'absolute', right: 10, top: 10}}>
                    <Icon name={'times'} size={18}/>
                  </TouchableOpacity>
                  <TextInput style={styles.title}
                    onChangeText={text => {
                      const prevSelectedTask = { ...selectedTask };
                      prevSelectedTask.title = text;
                      this.setState({selectedTask: prevSelectedTask,});
                    }}
                    value={selectedTask.title}
                    placeholder="件名"
                  />
                  <View style={styles.notesContent} />
                  <View>
                    <Text style={{color: '#9CAAC4',fontSize: 16,fontWeight: '600',}}>
                    メモ
                    </Text>
                    <TextInput style={{fontSize: 19,marginTop: 3,color: 'black'}}
                      onChangeText={text => {
                        let prevSelectedTask = { ...selectedTask };
                        prevSelectedTask.note = text;
                        this.setState({
                          selectedTask: prevSelectedTask,
                        });
                      }}
                      value={selectedTask.note}
                      placeholder="メモ"
                    />
                  </View>
                  <View style={styles.sepeerator} />
                  <View>
                    <Text style={{color: '#9CAAC4',fontSize: 16,fontWeight: '600',}}>
                    時間
                    </Text>
                    <TouchableOpacity
                      onPress={() => this._showDateTimePicker()}
                      style={{height: 25,marginTop: 3,}}
                    >
                      <Text style={{ fontSize: 19 }}>
                        {selectedTask.time}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center',}}>
                    <TouchableOpacity
                      onPress={async () => {
                        this._handleModalVisible();
                        await this.updateSelectedTask(currentDate,selectedTask);
                        this._updateCurrentTask(currentDate);
                      }}
                      style={styles.updateButton}
                    >
                      <Text style={{fontSize: 18,textAlign: 'center',color: '#fff',}}>
                      編集
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        this._handleModalVisible();
                        await this.deleteSelectedTask(currentDate,selectedTask);
                        this._updateCurrentTask(currentDate);
                      }}
                      style={styles.deleteButton}
                    >
                      <Text style={{fontSize: 18,textAlign: 'center',color: '#fff',}}>
                      削除
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Task>
            )}
            <View style={{flex: 1,}}>
              <CalendarStrip
                ref={ref => {this.calenderRef = ref;}}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{
                  type: 'background',
                  duration: 200,
                  highlightColor: '#ffffff',
                }}
                style={{ height: 150,paddingTop: 20,paddingBottom: 20,}}
                calendarHeaderStyle={{ color: '#000000' }}
                dateNumberStyle={{ color: '#000000', paddingTop: 10 }}
                dateNameStyle={{ color: '#BBBBBB' }}
                highlightDateNumberStyle={{
                  color: '#fff',
                  backgroundColor: '#2E66E7',
                  marginTop: 10,
                  height: 35,
                  width: 35,
                  textAlign: 'center',
                  borderRadius: 17.5,
                  overflow: 'hidden',
                  paddingTop: 6,
                  fontWeight: '400',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                highlightDateNameStyle={{ color: '#2E66E7' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey', paddingTop: 10 }}
                datesWhitelist={datesWhitelist}
                iconLeft={require('../assets/images/left-arrow.png')}
                iconRight={require('../assets/images/right-arrow.png')}
                iconContainer={{ flex: 0.1 }}
                markedDates={markedDate}
                onDateSelected={date => {
                  const selectedDate = `${moment(date).format('YYYY')}-${moment(date).format('MM')}-${moment(date).format('DD')}`;
                  this._updateCurrentTask(selectedDate);
                  this.setState({
                    currentDate: selectedDate,
                  });
                }}
              />
              
              <View style={{ width: '100%',height: Dimensions.get('window').height - 280,}}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20, }} >
                  {todoList.map(item => (
                    <TouchableOpacity
                      onPress={() => {this.setState({selectedTask: item,isModalVisible: true,},() => {this._getEvent();});}}
                      key={item.id}
                      style={styles.taskListContent}
                    >
                      <View style={{marginLeft: 13,}}>
                        <View style={{flexDirection: 'row',alignItems: 'center',}}>
                          <View style={{height: 12,width: 12,borderRadius: 6,backgroundColor: '#f2aead',marginRight: 8,}}/>
                          <Text style={{color: '#554A4C',fontSize: 20,fontWeight: '700',}}>
                            {item.title}
                          </Text>
                        </View>
                        <View>
                          <View style={{ flexDirection: 'row', marginLeft: 20, }} >
                            <Text style={{color: '#BBBBBB',fontSize: 14,marginRight: 5,}}>
                              {`${moment(item.date).format('YYYY')}/${moment(item.date).format('MM')}/${moment(item.date).format('DD')}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{height: 80,width: 5,backgroundColor: '#f2aead',borderRadius: 5,}}/>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </>
          
        )}
        
      </Context.Consumer>
      
    );
  }
}


MyCalendar.navigationOptions = {
  headerTitle: 'マイカレンダー',
  headerRight: <View></View>
};

/*
<TouchableOpacity
                onPress={() =>
                  navigation.navigate('CreateTask', {
                    updateCurrentTask: this._updateCurrentTask,
                    currentDate,
                    createNewCalendar: this._createNewCalendar,
                  })
                }
                style={styles.viewTask}
              >
                <Image source={require('../assets/images/plus.png')} style={{ height: 30, width: 30, }} />
              </TouchableOpacity>
*/

const styles = StyleSheet.create({
  taskListContent: {
    height: 100,
    width: 327,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#2E66E7',
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewTask: {
    position: 'absolute',
    bottom: 80,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: '#2E66E7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E66E7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    width: 100,
    height: 38,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#2E66E7',
    width: 100,
    height: 38,
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: 20,
  },
  sepeerator: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 10,
  },
  notesContent: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#979797',
    alignSelf: 'center',
    marginVertical: 10,
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
    borderColor: '#5DD976',
    borderLeftWidth: 1,
    paddingLeft: 8,
    fontSize: 19,
    color: 'black'
  },
  taskContainer: {
    
    width: 327,
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
});
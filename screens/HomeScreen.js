import React, { Component }  from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions
} from 'react-native';
import Swiper from "react-native-web-swiper";
import { FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import Cal from './Cal';
import { getNewTsurumi, getNewOsaka, getPopTsurumi, getPopOsaka } from '../components/Api';
import { WebView } from 'react-native-webview';
import Spinner_bar from 'react-native-loading-spinner-overlay';

const DATA = [
  {
    id: '1',
    title: 'エスリノーヴ・ツャトー鶴見',
    image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=beautiful-beauty-blue-bright-414612.jpg&fm=jpg',
    description: '大阪府大阪巿鶴見区今津中4丁目',
    size: '2LDK 54.64m²',
    budget: '1,380',
    is_new: 1
  },
  {
    id: '2',
    title: 'エスリノーヴ・ネオコーポ阿倍野',
    image: 'https://cloud.ielove.jp/image/sale/128c98e/1164_28774_3_1000_1000.jpg',
    description: '大阪府大阪巿阿倍野区天王寺町北３丁目',
    size: '3LDK 58.05m²',
    budget: '2,080',
    is_new: 1
  },
  {
    id: '3',
    title: 'エスツリーズ枚方・禁野本町2丁目~限定1区画',
    image: 'https://cloud.ielove.jp/image/sale/ed552d28/1164_28422_1_1000_1000.jpg',
    description: '大阪府枚方禁野本町2丁目',
    size: '4LDK 105.91m²',
    budget: '4,880',
    is_new: 0
  },
  {
    id: '4',
    title: 'エスツリーズ枚方・禁野本町2丁目~限定1区画',
    image: 'https://cloud.ielove.jp/image/sale/4c5137ac/1164_28421_16_1000_1000.jpg',
    description: '大阪府枚方禁野本町2丁目',
    size: '209.28m²',
    budget: '2,900',
    is_new: 0
  },
];

const TOPDATA = [
  {
    id: '1',
    title: 'エスリノーヴ・ツャトー鶴見',
    image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=beautiful-beauty-blue-bright-414612.jpg&fm=jpg',
    addr: '大阪府大阪巿鶴見区今津中4丁目',
    addr1: '生四丁目駅徒歩8分',
    size: '4LDK/97.70m²',
    budget: '4,280',
    rank: 1
  },
  {
    id: '2',
    title: 'エスリノーヴ・ネオコーポ阿倍野',
    image: 'https://cloud.ielove.jp/image/sale/128c98e/1164_28774_3_1000_1000.jpg',
    addr: '大阪府大阪巿阿倍野区天王寺町北３丁目',
    addr1: '今福駅見徒歩6分',
    size: '4LDK/104.50m²',
    budget: '3,480',
    rank: 2
  },
];

const RANKDATA = [
  {
    id: '3',
    title: 'エスリノーヴ・ツャトー鶴見',
    image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=beautiful-beauty-blue-bright-414612.jpg&fm=jpg',
    addr: '大阪府大阪巿鶴見区今津中4丁目',
    addr1: '生四丁目駅徒歩8分',
    size: '4LDK/97.70m²',
    budget: '4,280',
    rank: 3
  },
  {
    id: '4',
    title: 'エスリノーヴ・ネオコーポ阿倍野',
    image: 'https://cloud.ielove.jp/image/sale/128c98e/1164_28774_3_1000_1000.jpg',
    addr: '大阪府大阪巿阿倍野区天王寺町北３丁目',
    addr1: '今福駅見徒歩6分',
    size: '4LDK/104.50m²',
    budget: '3,480',
    rank: 4
  },
  {
    id: '5',
    title: 'エスリノーヴ・ネオコーポ阿倍野',
    image: 'https://cloud.ielove.jp/image/sale/128c98e/1164_28774_3_1000_1000.jpg',
    addr: '大阪府大阪巿阿倍野区天王寺町北３丁目',
    addr1: '今福駅見徒歩6分',
    size: '4LDK/104.50m²',
    budget: '3,480',
    rank: 5
  },
];
const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT
} = Dimensions.get('window');
const bannerHeight = SCREEN_WIDTH * 0.326 + 1;
export default class HomeScreen extends React.Component {    
    constructor(props){
        super(props);
        this.state = {
          visible: false,
          loaded: true,
          newTsurumi: null,
          newOsaka: null,
          popTsurumi: null,
          popOsaka: null
        };
    }

    static navigationOptions = ({navigation}) => ({
      headerTitle: <Image style={{width:70, height: 30, flex: 1}} resizeMode="contain" source={require('../assets/images/logo.png')}/>,
      headerRight: <TouchableOpacity style={{marginRight: 10}} onPress={()=>navigation.navigate('MenuScreen')}><View style={{ alignItems: 'center'}}><SimpleLineIcons name={'menu'} size={26} color={'#004097'} /><Text style={{color: '#004097'}}>メニュー</Text></View></TouchableOpacity>,
      headerLeft: <View style={{width: 20}}></View>,
      headerTitleStyle: {
          textAlign: 'center',
          flexGrow:1,
          alignSelf:'center',
      },
      headerStyle: {
          backgroundColor: 'white',
      },
      headerTintColor: 'black',
    });

    async componentDidMount(){
      getNewTsurumi()
      .then((response) => {
          var temp = JSON.parse(response);
          this.setState({newTsurumi: temp})
      });

      getNewOsaka()
      .then((response) => {
          var temp = JSON.parse(response);
          this.setState({newOsaka: temp})
      });

      getPopTsurumi()
      .then((response) => {
          var temp = JSON.parse(response);
          this.setState({popTsurumi: temp})
      });

      getPopOsaka()
      .then((response) => {
          var temp = JSON.parse(response);
          this.setState({popOsaka: temp})
      });
    }

    renderNewTsurimi(){
      return this.state.newTsurumi.map((newInfo, index) => {
        return <View style={styles.newPart}>
          {
            index < 2 ?
            <View style={styles.isNew}>
              <Image style={{width: 40, height: 40}} source={require('../assets/images/new.png')} />
            </View>
            : null
          }
          <View style={{width: '100%', paddingBottom: 5}}>
            <Image style={{width: '100%', height: 100}} resizeMode="stretch" source={{uri: newInfo.property_image}} />
          </View>
          <View style={[styles.title]}>
            <Text numberOfLines={2} style={{ fontSize: 18}}>{newInfo.property_name}</Text>
          </View>
          <View style={[styles.description]}>
            <Text numberOfLines={2} style={{color:'#acacac'}}>{newInfo.property_address}</Text>
          </View>
          <View style={{paddingTop: 10}}>
            <Text>{newInfo.property_area}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={[styles.price]}>{newInfo.property_price.replace('万円', '')}</Text>
            <Text> 万円</Text>
          </View>
          <View style={styles.isMark}></View>
        </View>
      })
    }

    renderNewOsaka(){
      return this.state.newOsaka.map((newInfo, index) => {
        return <View style={styles.newPart}>
          {
            index < 2 ?
            <View style={styles.isNew}>
              <Image style={{width: 40, height: 40}} source={require('../assets/images/new.png')} />
            </View>
            : null
          }
          <View style={{width: '100%', paddingBottom: 5}}>
            <Image style={{width: '100%', height: 100}} resizeMode="stretch" source={{uri: newInfo.property_image}} />
          </View>
          <View style={[styles.title]}>
            <Text numberOfLines={2} style={{ fontSize: 18}}>{newInfo.property_name}</Text>
          </View>
          <View style={[styles.description]}>
            <Text numberOfLines={2} style={{color:'#acacac'}}>{newInfo.property_address}</Text>
          </View>
          <View style={{paddingTop: 10}}>
            <Text>{newInfo.property_area}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={[styles.price]}>{newInfo.property_price.replace('万円', '')}</Text>
            <Text> 万円</Text>
          </View>
          <View style={styles.isMark}></View>
        </View>
      })
    }

    renderPopTsurumi(){
      return this.state.popTsurumi.map((popInfo, index) => {
        return <View style={styles.rankPart}>
          {
            index == 0?
            <View style={[styles.popRankingSection, {backgroundColor: '#f7d25d'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 8}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            index == 1?
            <View style={[styles.popRankingSection, {backgroundColor: '#c6c3be'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 8}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            index >= 2 ?
            <View style={[styles.popRankingSection, {backgroundColor: '#c7dc59'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 8}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            null
          }
          <View style={{width: '100%', paddingBottom: 5}}>
            <Image style={{width: '100%', height: 100}} resizeMode="stretch" source={{uri: popInfo.property_image}} />
          </View>
          <View style={[styles.title]}>
            <Text numberOfLines={2} style={{ fontSize: 18}}>{popInfo.property_name}</Text>
          </View>
          <View style={[styles.priceSection]}>
            <Text style={[styles.price]}>{popInfo.property_price.replace('万円', '')}</Text>
            <Text> 万円</Text>
          </View>
          <View style={[styles.topDesc, {paddingTop: 10}]}>
            <Text>新築ー戸建て</Text>
          </View>
          <View style={styles.topDesc}>
            <Text>{popInfo.property_area}</Text>
          </View>
          <View style={[styles.topDesc, {height: 50}]}>
            <Text numberOfLines={2}>{popInfo.property_address}</Text>
          </View>
          <View style={[styles.topDesc, {height: 50}]}>
            <Text numberOfLines={2}>{popInfo.property_access}</Text>
          </View>
          <View style={styles.isMark}></View>
        </View>
      })
    }

    renderPopOsaka(){
      return this.state.popOsaka.map((popInfo, index) => {
        return <View style={styles.rankPart}>
          {
            index == 0?
            <View style={[styles.popRankingSection, {backgroundColor: '#f7d25d'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 10}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            index == 1?
            <View style={[styles.popRankingSection, {backgroundColor: '#c6c3be'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 10}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            index >= 2 ?
            <View style={[styles.popRankingSection, {backgroundColor: '#c7dc59'}]}>
              <Image source={require('../assets/images/crown.png')} style={{width: 20, height: 15}}/>
              <Text style={{color: 'white', paddingLeft: 10}}>No.{index+1}</Text>
              <Text style={styles.popRanking}>pageview ranking</Text>
            </View>
            :
            null
          }
          <View style={{width: '100%', paddingBottom: 5}}>
            <Image style={{width: '100%', height: 100}} resizeMode="stretch" source={{uri: popInfo.property_image}} />
          </View>
          <View style={[styles.title]}>
            <Text numberOfLines={2} style={{ fontSize: 18}}>{popInfo.property_name}</Text>
          </View>
          <View style={[styles.priceSection]}>
            <Text style={[styles.price]}>{popInfo.property_price.replace('万円', '')}</Text>
            <Text> 万円</Text>
          </View>
          <View style={[styles.topDesc, {paddingTop: 10}]}>
            <Text>新築ー戸建て</Text>
          </View>
          <View style={styles.topDesc}>
            <Text>{popInfo.property_area}</Text>
          </View>
          <View style={[styles.topDesc, {height: 50}]}>
            <Text numberOfLines={2}>{popInfo.property_address}</Text>
          </View>
          <View style={[styles.topDesc, {height: 50}]}>
            <Text numberOfLines={2}>{popInfo.property_access}</Text>
          </View>
          <View style={styles.isMark}></View>
        </View>
      })
    }

    search(type){
      this.props.navigation.navigate('WebSearch', {type: type});
    }

    render(){
      return (
        <View style={styles.container}>

          <ScrollView style={styles.container}>
              {
                /*<View style={{ height: bannerHeight, width: '100%' }}>
                  <Swiper controlsEnabled={false} loop={true} timeout={5} controlsProps={{
                          dotsTouchable: false, 
                          prevPos: false, 
                          nextPos: false, 
                      }}
                      springConfig={{ speed: 1 }} >
                      <View style={styles.slideContainer}>
                          <Image style={{width: '100%', height: '100%', flex: 1}} resizeMode="contain" source={{uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/sa6624f678420b1ce/image/i30a107f3853265eb/version/1547265234/image.jpg'}} />
                      </View>
                      <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%', flex: 1}} resizeMode="contain" source={{uri: 'https://image.jimcdn.com/app/cms/image/transf/dimension=910x10000:format=jpg/path/sa6624f678420b1ce/image/i8100801d1ec75658/version/1570172070/image.jpg'}} />
                      </View>
                      <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%', flex: 1}} resizeMode="contain" source={{uri: 'https://image.jimcdn.com/app/cms/image/transf/dimension=910x10000:format=jpg/path/sa6624f678420b1ce/image/i50a0a56b15d6e9c5/version/1547428682/image.jpg'}} />  
                      </View>
                      <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%', flex: 1}} resizeMode="contain" source={{uri: 'https://madream.jp/bnr_indivi/123450_950_310.jpg'}} />
                      </View>
                  </Swiper>
                </View>*/
              }
              <View style={styles.newTitle}>
                <Text style={styles.newTitleText}>新着物件</Text>
                <Text style={{position: 'absolute', opacity: 0.3, color: 'white', fontSize: 26, fontWeight: 'bold',right: 0}}>new select</Text>
              </View>
              <View style={styles.newTsurumi}>
                <Text style={styles.newTitleText}>鶴見本店</Text>
              </View>
              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row'}}>
                  {
                    this.state.newTsurumi != null ?
                    this.renderNewTsurimi()
                    :
                    null
                  }
                  
                </View>
              </ScrollView>
              <View style={styles.newTitle}>
                <Text style={styles.newTitleText}>新着物件</Text>
                <Text style={{position: 'absolute', opacity: 0.3, color: 'white', fontSize: 26, fontWeight: 'bold',right: 0}}>new select</Text>
              </View>
              <View style={styles.newOsaka}>
                <Text style={styles.newTitleText}>大阪北店（高槻）</Text>
              </View>
              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row'}}>
                  {
                    this.state.newOsaka != null ?
                    this.renderNewOsaka()
                    :
                    null
                  }
                  
                </View>
              </ScrollView>
              <View style={{width: '100%', padding: 20}}>
                <TouchableOpacity onPress={() => this.search(1)}>
                  <Image source={{uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/sa6624f678420b1ce/image/i43dc5d66a3d691aa/version/1533361137/image.jpg'}} style={{height: 60, width: '100%'}} resizeMode="stretch" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.search(2)}>
                  <Image source={{uri: 'https://image.jimcdn.com/app/cms/image/transf/none/path/sa6624f678420b1ce/image/i7a02f9d50fb106d8/version/1533283722/image.jpg'}} style={{height: 60, width: '100%', marginTop: 10}} resizeMode="stretch" />
                </TouchableOpacity>
              </View>
              <View style={styles.newTitle}>
                <Text style={styles.newTitleText}>人気物件</Text>
                <Text style={{position: 'absolute', opacity: 0.3, color: 'white', fontSize: 26, fontWeight: 'bold',right: 0}}>ranking</Text>
              </View>
              <View style={styles.newTsurumi}>
                <Text style={styles.newTitleText}>鶴見本店</Text>
              </View>
              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row'}}>
                  {
                    this.state.popTsurumi != null ?
                    this.renderPopTsurumi()
                    :
                    null
                  }
                </View>
              </ScrollView>
              <View style={styles.newTitle}>
                <Text style={styles.newTitleText}>人気物件</Text>
                <Text style={{position: 'absolute', opacity: 0.3, color: 'white', fontSize: 26, fontWeight: 'bold',right: 0}}>ranking</Text>
              </View>
              <View style={styles.newOsaka}>
                <Text style={styles.newTitleText}>大阪北店（高槻）</Text>
              </View>
              <ScrollView horizontal={true}>
                <View style={{flexDirection: 'row'}}>
                  {
                    this.state.popOsaka != null ?
                    this.renderPopOsaka()
                    :
                    null
                  }
                </View>
              </ScrollView>
              
              <View style={{height: 80}}>

              </View>
          </ScrollView>
          <Cal data={this.props.navigation} />
          
          
          <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
        </View>
      );
    }
}

/*HomeScreen.navigationOptions = {
  headerTitle: <Image style={{width:70, height: 30, flex: 1}} resizeMode="contain" source={require('../assets/images/logo.png')}/>,
  headerRight: <TouchableOpacity><View><FontAwesome5 name={'crown'} color={'#004097'} /></View></TouchableOpacity>
};*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '100%'
  },
  newTitle: {
    height: 40,
    backgroundColor: '#93bcea',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newTsurumi:{
    height: 30,
    backgroundColor: '#e99695',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newOsaka:{
    height: 30,
    backgroundColor: '#fbab84',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newTitleText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  newPart: {
    width: 200,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    borderLeftColor: '#e2e2e2',
    borderLeftWidth: 1,
    padding: 20,
  },
  rankPart: {
    width: 200,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    borderLeftColor: '#e2e2e2',
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  mainStore: {
    color: '#acacac',
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: '#acacac',
    borderWidth: 1,
    textAlign: 'center',
    marginTop: 10,
    width: '70%'
  },
  title: {
    paddingTop: 10,
    height: 60
  },
  listTitle: {
    paddingTop: 10
  },
  description: {
    paddingTop: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#acacac',
    height: 60
  },
  isMark: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderBottomColor: '#4b8fda',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  isNew: {
    position: 'absolute',
    zIndex: 99999
  },
  topDesc: {
    paddingBottom: 10
  },
  rankListPart: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    borderBottomColor:'#acacac',
    borderBottomWidth: 1
  },
  popRanking: {
    position: 'absolute', 
    color: 'white', 
    opacity: 0.5, 
    right: 0, 
    fontSize: 10.5
  },
  popRankingSection: {
    flexDirection: 'row', 
    alignItems:'center', 
    paddingVertical: 5, 
    paddingLeft: 10, 
    marginTop: 5, 
    marginBottom: 10, 
    height: 30
  },
  price: {
    color: '#ec9292',
    fontWeight: 'bold', 
    fontSize: 25
  },
  priceSection: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    borderBottomColor:'#acacac', 
    borderBottomWidth: 1, 
    paddingBottom: 10, 
    marginTop: 10
  }
});

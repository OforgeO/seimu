import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Swiper from "react-native-web-swiper";

export default class Tutorial extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {};
    }
    skip(){
        this.props.navigation.push('Home');
    }
    
    render(){
        return (
            <View style={styles.container}>
                <Swiper controlsProps={{
                        dotsTouchable: true, 
                        prevPos: false, 
                        nextPos: false, 
                    }}>
                    <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%'}} resizeMode="contain" source={require('../assets/images/slide1.png')} />
                    </View>
                    <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%'}} resizeMode="contain" source={require('../assets/images/slide2.png')} />
                    </View>
                    <View style={styles.slideContainer}>
                        <Image style={{width: '100%', height: '100%'}} resizeMode="contain" source={require('../assets/images/slide3.png')} />
                    </View>
                    <View style={styles.slideContainer}>
                        <TouchableOpacity onPress={() => this.skip()} style={{width: '100%', height: '100%'}}>
                            <Image style={{width: '100%', height: '100%'}} resizeMode="contain" source={require('../assets/images/slide4.png')} />
                        </TouchableOpacity>
                    </View>
                </Swiper>
            </View>
        );
    }
    
}

Tutorial.navigationOptions = ({navigation})=> ({
    headerRight: <TouchableOpacity onPress={() => navigation.push('Home')}><Text style={{paddingRight: 10, color: '#fff'}}>SKIP</Text></TouchableOpacity>,
    headerLeft: <Text></Text>,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
});

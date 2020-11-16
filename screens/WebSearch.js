import React from 'react';
import { WebView } from 'react-native-webview';

import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default class WebSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        visible: true ,
        link: ''
    };
  }

  componentDidMount(){
      if(this.props.navigation.getParam('type') == 1)
        this.setState({link : 'https://www.seimu.co.jp/search/index/?search=%E3%82%A8%E3%82%B9%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA&orderby=modified&limit=10&class%5B%5D=b2&originClass=b2%2Cb1%2Cb3%2C&nw=0&pF=0&pC=0&saleHistoryChangeDate=0&aF=0&aC=0&tcF=0&tcC=0&kj=0&wT=0&years=0&pD=0&img=0&movie=0&panorama=0&tN=%E3%82%A8%E3%82%B9%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA&lmt=10&orderby=modified&publicbkn=&params=&paramResetFlg=1'})
      else if(this.props.navigation.getParam('type') == 2)
        this.setState({link : 'https://www.seimu.co.jp/freesearch/%E3%83%AA%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0/?orderby=lpc'})
  }
 
  showSpinner() {
    this.setState({ visible: true });
  }
 
  hideSpinner() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <View
        style={this.state.visible === true ? styles.stylOld : styles.styleNew}>
        {
          this.state.visible ? (
            <ActivityIndicator
              color="#009688"
              size="large"
              style={styles.ActivityIndicatorStyle}
            />
          ) : null
        }
        {
            this.state.link != '' ?
            <WebView
                style={styles.WebViewStyle}
                source={{ uri: this.state.link }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                useWebKit={true}
                onLoadStart={() => this.showSpinner()}
                onLoad={() => this.hideSpinner()}
            />
            :
            null
        }
        
      </View>
    );
  }
}

WebSearch.navigationOptions = {
  title: '',
};

const styles = StyleSheet.create({
  stylOld: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleNew: {
    flex: 1,
  },
  WebViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
});
import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, ActivityIndicator, View } from 'react-native';

export default class NewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
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
 
        <WebView
          style={styles.WebViewStyle}
          source={{ uri: 'https://m.seimu.co.jp/topics/' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          useWebKit={true}
          onLoadStart={() => this.showSpinner()}
          onLoad={() => this.hideSpinner()}
        />
      </View>
    );
  }
}

NewsScreen.navigationOptions = {
  title: '新着情報',
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
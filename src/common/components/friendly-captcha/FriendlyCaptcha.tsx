import { observer } from 'mobx-react';
import React from 'react';
import WebView from 'react-native-webview';

const CaptchaHTML = require('./Captcha.html');

export default observer(function FriedlyCaptcha() {
  return (
    <WebView
      source={CaptchaHTML}
      // source={{ uri: 'http://192.168.1.33:3000/Captcha.html' }}
      originWhitelist={['*']}
      onMessage={event => {
        console.log('MESSAGE =======>', event.nativeEvent.data);
      }}
    />
  );
});

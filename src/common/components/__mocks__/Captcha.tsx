import React, { Component } from 'react';
import { View } from 'react-native';

export default class Captcha extends Component<{ onResult: (string) => void }> {
  show() {
    this.props.onResult(
      JSON.stringify({
        jwtToken: 'FAFA',
        clientText: 'some45',
      }),
    );
  }

  hide() {}

  render() {
    return <View />;
  }
}

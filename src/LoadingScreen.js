import React, {
  Component
} from 'react';

import FastImage from 'react-native-fast-image';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';

import { ComponentsStyle } from './styles/Components';
import { CommonStyle } from './styles/Common';


export default class LoadingScreen extends Component {

  static navigationOptions = {
    header: props => <View style={ { backgroundColor: '#FFF' }} />,
  }

  render() {
    return (
      <View style={[{ backgroundColor: '#FFF' } ,CommonStyle.flexContainerCenter, CommonStyle.padding2x]}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={ComponentsStyle.logo}
          source={require('./assets/logos/logo.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
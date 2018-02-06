import React, {
  Component,
} from 'react';

import {
  View,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import PhotoView from 'react-native-photo-view';

import { CommonStyle } from '../styles/Common';

/**
 * Full screen image viewer
 */
export default class ViewImageScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={styles.header}>
        <Icon size={36} name="ios-close" onPress={() => navigation.goBack()} style={styles.iconclose}/>
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  })

  getSource() {
    return this.props.navigation.state.params.source;
  }

  render() {

    const source = this.getSource();

    return (
      <PhotoView
        source={source}
        minimumZoomScale={1}
        maximumZoomScale={3}
        androidScaleType="fitCenter"
        style={[CommonStyle.flexContainer, CommonStyle.backgroundBlack]} />
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000',
    paddingTop: Platform.OS == 'ios' ? 14 : 8,
  },
  iconclose: {
    alignSelf: 'flex-end',
    padding: Platform.OS == 'ios' ? 10 : 8,
    color: '#FFF',
  },
});
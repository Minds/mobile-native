import React, { PureComponent } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from './../common/services/api.service';

import { post, remind } from '../newsfeed/NewsfeedService';

import MindsVideo from '../media/MindsVideo';
import colors from '../styles/Colors';

/**
 * Capture preview
 */
export default class CapturePreview extends PureComponent {
  /**
   * Render
   */
  render() {
    let body = null;
    switch (this.props.type) {
      case 'image/gif':
      case 'image/jpeg':
      default:
        body = <Image
          resizeMode='contain'
          source={{ uri: this.props.uri }}
          style={styles.preview}
        />
        break;
      case 'video/mp4':
        body = <View style={styles.preview}>
          <MindsVideo video={{ 'uri': this.props.uri }} />
        </View>
        break;
    }

    return (
      <View style={styles.wrapper}>
        {body}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
  },
});
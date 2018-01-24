import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, Text,Button, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import api from './../common/services/api.service';

import { post, remind, uploadAttachment } from '../newsfeed/NewsfeedService';

import MindsVideo from '../media/MindsVideo';
import colors from '../styles/Colors';

import {
  NavigationActions
} from 'react-navigation';

export default class CapturePreview extends Component {

  state = {
    uri: '',
    type: '',
  };

  componentWillMount() {
    this.setState({ 
      uri: this.props.uri,
      type: this.props.type
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ 
      uri: props.uri,
      type: props.type
    });
  }

  render() {

    return (
      <View style={styles.wrapper}>
        { this.state.type == 'image/jpeg' ?
            <Image
              source={{ uri : this.state.uri }}
              style={styles.preview}
              />
              : null
        }
        { this.state.type == 'video/mp4' ?
          <View style={styles.preview}>
            <MindsVideo video={{'uri': this.state.uri }}/>
          </View> 
          : null
        }
      </View>
    );
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  preview: {
    flex: 1,
  },
});
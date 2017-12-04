import React, {
  Component
} from 'react';
  
import { Icon } from 'react-native-elements'

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import {
  MINDS_URI
} from '../../config/Config';

import { getComments } from './comments/CommentsService';
import Comments from './comments/Comments';

export default class Actions extends Component {

  state = {
    comments: [],
    offset: '',
    loading: false,
    loadedComments: false,
    avatarSrc: { uri: MINDS_URI + 'icon/' },
  };

  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.actionIconWrapper}>
            <Icon color='rgb(96, 125, 139)' name='thumb-up' />
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon color='rgb(96, 125, 139)' name='thumb-down' />
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon color='rgb(96, 125, 139)' name='flash-on' />
          </View>
          <View style={styles.actionIconWrapper} onPress={this.loadComments}>
            <Icon style={styles.actionIcon} color={this.props.entity['comments:count'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='chat-bubble' onPress={this.loadComments} />
            <Text onPress={this.loadComments} style={styles.actionIconText}>{this.props.entity['comments:count']}</Text>
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon color='rgb(96, 125, 139)' name='repeat' />
          </View>
          {this.props.children}
        </View>
        <Comments loading={this.state.loading} loadedComments={this.state.loadedComments} comments={this.state.comments}></Comments> 
      </View>
    );
  }

  loadComments = () => {
    this.setState({
      loading: true,
      loadedComments: true
    })
    getComments(this.props.entity.entity_guid).then((data) => {
      this.setState({
        comments: data.comments,
        offset: data.offset,
        loading: false
      });
    })
    .catch(err => {
      console.log('error');
    })
  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  actionIcon: {
    
  },
  actionIconWrapper: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  actionIconText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 52,
    alignContent: 'center',
    justifyContent: 'center'
  },
});
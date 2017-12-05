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

import { observer, inject } from 'mobx-react/native';

import {
  MINDS_URI
} from '../../config/Config';

import { thumbActivity } from './ActionsService';
import { getComments } from './comments/CommentsService';
import Comments from './comments/Comments';

@inject('newsfeed')
@inject('user')
@observer
export default class Actions extends Component {

  state = {
    comments: [],
    loading: false,
    loadedComments: false,
    avatarSrc: { uri: MINDS_URI + 'icon/' },
    votedDown: false,
    votedUp: false,
  };

  
  componentWillMount() {
    let votedUp = false;
    let votedDown = false;
    let votedUpCount = 0;
    let votedDownCount = 0;
    
    if(this.props.entity['thumbs:up:user_guids'] && this.props.entity['thumbs:up:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedUp = true;
      votedUpCount = parseInt(this.props.entity['thumbs:up:count']);
    }
    if(this.props.entity['thumbs:down:user_guids'] && this.props.entity['thumbs:down:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedDown = true;
      votedDownCount = parseInt(this.props.entity['thumbs:down:count']);
    }

    this.setState({
      votedDown,
      votedUp,
      votedDownCount,
      votedUpCount
    })
  }
  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.actionIconWrapper}>
            <Icon onPress={this.toggleThumb.bind(this, 'thumbs:up')} color={this.state.votedUp ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-up' />
            <Text style={styles.actionIconText}>{this.state.votedUpCount}</Text>
          </View>
          <View style={styles.actionIconWrapper}>
            <Icon onPress={this.toggleThumb.bind(this, 'thumbs:down')} color={this.state.votedDown ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-down' />
            <Text style={styles.actionIconText}>{this.state.votedDownCount}</Text>
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
        <Comments guid={this.state.guid} loading={this.state.loading} loadedComments={this.state.loadedComments} comments={this.state.comments}></Comments> 
      </View>
    );
  }

  toggleThumb = (direction) => {
    if(direction == 'thumbs:up') {
      this.setState({ 
        votedUp : !this.state.votedUp,
        votedUpCount: this.state.votedUp? this.state.votedUpCount-1: this.state.votedUpCount+1})
    } else {
      this.setState({ 
        votedDown : !this.state.votedDown,
        votedDownCount: this.state.votedDown? this.state.votedDownCount-1: this.state.votedDownCount+1})
    }

    let arr = direction.split(':');

    thumbActivity(this.props.entity.guid, arr[1]).then((data) => {}).catch(err => {
        alert(err);
        if(direction == 'thumbs:up') {
          this.setState({ 
            votedUp : !this.state.votedUp,
            votedUpCount: this.state.votedUp? this.state.votedUpCount-1: this.state.votedUpCount+1})
        } else {
          this.setState({ 
            votedDown : !this.state.votedDown,
            votedDownCount: this.state.votedDown? this.state.votedDownCount-1: this.state.votedDownCount+1})
        }
      })
  }

  hasThumbedActivity = (direction) => {
    let guids = direction == 'up' ? this.props.entity['thumbs:up:user_guids'] : this.props.entity['thumbs:down:user_guids'];
    if (guids && guids.length > 0 && guids.indexOf(this.props.user.me.guid) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  loadComments = () => {
    let guid = this.props.entity.guid;
    if (this.props.entity.entity_guid)
      guid = this.props.entity.entity_guid;
    this.setState({
        loading: true,
        loadedComments: true,
        guid: guid,
      })
    getComments(guid).then((data) => {
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
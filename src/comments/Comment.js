import React, {
  Component
} from 'react';

import { Icon } from 'react-native-elements'

import {
  MINDS_URI
} from '../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import { thumbActivity } from '../newsfeed/activity/ActionsService';

import { observer, inject } from 'mobx-react/native';

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

@inject('user')
@observer
export default class Comment extends Component {

  state = {
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/' + 'icon/' + this.props.comment.ownerObj.guid }
  };

  componentWillMount() {
    let votedUp = false;
    let votedDown = false;
    let votedUpCount = 0;
    let votedDownCount = 0;

    if(this.props.comment['thumbs:up:user_guids'] && this.props.comment['thumbs:up:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedUp = true;
      votedUpCount = parseInt(this.props.comment['thumbs:up:count']);
    }
    if(this.props.comment['thumbs:down:user_guids'] && this.props.comment['thumbs:down:user_guids'].indexOf(this.props.user.me.guid) >= 0){
      votedDown = true;
      votedDownCount = parseInt(this.props.comment['thumbs:down:count']);
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
        <View style={styles.container}>
          <View style={styles.author}>
            <View style={{flex:1}}>
              <TouchableOpacity>
                <Image source={this.state.avatarSrc} style={styles.avatar}/>
              </TouchableOpacity>
            </View>
            <View style={{flex:6}}>
              <View style={{flex:4}}>
                <Text style={styles.username}> @{this.props.comment.ownerObj.username}</Text>
              </View>
              <View style={{flex:3}}>
                <Text style={styles.timestamp}> {this.formatDate(this.props.comment.time_created)}</Text>
              </View>
            </View>
            <View style={{flex:1, flexDirection: 'row'}}>
              <View style={styles.actionIconWrapper}>
                <Icon onPress={this.toggleThumb.bind(this, 'thumbs:up')} color={this.state.votedUp ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-up' size={16} />
                <Text style={styles.actionIconText}>{this.state.votedUpCount > 0 ? '(' + this.state.votedUpCount + ')' : ''}</Text>
              </View>
              <View style={styles.actionIconWrapper}>
                <Icon onPress={this.toggleThumb.bind(this, 'thumbs:down')} color={this.state.votedDown ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'}  name='thumb-down' size={16} />
                <Text style={styles.actionIconText}>{this.state.votedDownCount > 0 ? '(' + this.state.votedDownCount + ')' : ''}</Text>
              </View>
            </View>
            
          </View>
          <View style={styles.content}>
            <Text style={styles.message}>{this.props.comment.description}</Text>
          </View>
        </View>

    );
  }

  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }

  hasThumbedActivity = (direction) => {
    let guids = direction == 'up' ? this.props.entity['thumbs:up:user_guids'] : this.props.entity['thumbs:down:user_guids'];
    if (guids && guids.length > 0 && guids.indexOf(this.props.user.me.guid) >= 0) {
      return true;
    } else {
      return false;
    }
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
  
    thumbActivity(this.props.comment.guid, arr[1]).then((data) => {}).catch(err => {
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
}

const styles = StyleSheet.create({
  author: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  actionIconText: {
    position: 'relative',
    left: 5,
    fontSize: 10,
    alignContent: 'center',
    justifyContent: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8
  },
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionIconWrapper: {
    flex: 1,
    alignContent: 'flex-start',
    justifyContent: 'flex-start'
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  username: {
    fontWeight: 'bold',
  },
  message: {
    padding: 8,
    paddingLeft: 16
  },
  imageContainer: {
    flex: 1,
    alignItems: 'stretch',
    height: 200,
  },
  image: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});
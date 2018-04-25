import React, { Component } from 'react';

import {
  inject
} from 'mobx-react/native'
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {
  View,
  Text
} from 'react-native';

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

/**
 * News feed empty
 */
@inject('user')
export default class NewsfeedEmpty extends Component {

  /**
   * Render
   */
  render() {
    const newsfeed = this.props.newsfeed;
    const me = this.props.user.me;

    console.log(newsfeed.lastError)

    if (newsfeed.lastError) {
      return this.errorEmpty();
    }

    if (newsfeed.filter == 'subscribed') {
      return this.newUserEmpty();
    } else {
      return this.commonEmpty();
    }
  }

  /**
   * Empty message for new user
   */
  newUserEmpty() {
    const me = this.props.user.me;
    let design = null;

    if (me && me.hasBanner && !me.hasBanner()) { //TODO: check for avatar too
      design = <Text
        style={ComponentsStyle.emptyComponentLink}
        onPress={() => this.props.navigation.navigate('Channel', { username: 'me' })}
        >
        Design your channel
      </Text>
    }

    return (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <MIcon name="home" size={72} color='#444' />
          <Text style={ComponentsStyle.emptyComponentMessage}>Your newsfeed is empty</Text>
          {design}
          <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => this.props.navigation.navigate('Capture')}
            >
            Create a post
          </Text>
          <Text
            style={ComponentsStyle.emptyComponentLink}
            onPress={() => this.props.navigation.navigate('Discovery', { type: 'user' })}
            >
            Find channels
          </Text>
        </View>
      </View>
    );
  }

  /**
   * Common empty message
   */
  commonEmpty() {
    return (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Text style={ComponentsStyle.emptyComponentMessage}>This feed is empty</Text>
        </View>
      </View>
    );
  }

  /**
   * Common empty message
   */
  errorEmpty() {
    return (
      <View style={ComponentsStyle.emptyComponentContainer}>
        <View style={ComponentsStyle.emptyComponent}>
          <Text style={[ComponentsStyle.emptyComponentMessage, CommonStyle.colorDanger]}>Sorry, there was an error loading feed</Text>
        </View>
      </View>
    );
  }
}
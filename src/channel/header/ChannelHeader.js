import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { Button } from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../../config/Config';
import channelService from '../ChannelService';
import abbrev from '../../common/helpers/abbrev';
import FastImage from 'react-native-fast-image';
import ChannelActions from '../ChannelActions';

/**
 * Channel Header
 */

@observer
export default class ChannelHeader extends Component {

  /**
   * Get Channel Banner
   */
  getBannerFromChannel() {
    const channel = this.props.channel.channel;
    if (channel && channel.carousels) {
      return channel.carousels[0].src;
    }

    return `${MINDS_URI}fs/v1/banners/${channel.guid}/0/${channel.banner}/medium`;
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    const channel = this.props.channel.channel;
    return `${MINDS_URI}icon/${channel.guid}/large/${channel.icontime}`;
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    if(!!this.props.channel.channel.subscribed){
      return (
        <TouchableHighlight
          onPress={() => { console.log('press') }}
          underlayColor = 'transparent'
          style = {{margin:4, padding:5, alignItems:'center', borderRadius: 5,backgroundColor:'white', borderWidth:1, borderColor: "#4791d6"}}
          accessibilityLabel="Send a message to this channel"
        >
          <Text style={{color: '#4791d6'}} > MESSAGE </Text>
        </TouchableHighlight>
      );
    } else if (this.props.me.guid !== this.props.channel.channel.guid){
      return (
        <TouchableHighlight
          onPress={() => { this.subscribe() }}
          underlayColor = 'transparent'
          style = {{margin:4, padding:5, alignItems:'center', borderRadius: 5,backgroundColor:'white', borderWidth:1, borderColor: "#4791d6"}}
          accessibilityLabel="Subscribe to this channel"
        >
          <Text style={{color: '#4791d6'}} > SUBSCRIBE </Text>
        </TouchableHighlight>
      );
    } else {
        <View style={{width:40}}></View>
    }
  }

  subscribe() {
    let channel = this.props.channel.channel;
    this.props.channel.subscribe(channel.guid);
  }

  /**
   * Render Header
   */
  render() {

    const channel = this.props.channel.channel;
    const styles  = this.props.styles;
    const avatar  = { uri: this.getAvatar() };
    const iurl    = { uri: this.getBannerFromChannel() };

    return (
      <View>
        <FastImage source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>SUBSCRIBERS</Text>
              <Text style={styles.countervalue}>{abbrev(channel.subscribers_count, 0)}</Text>
            </View>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>VIEWS</Text>
              <Text style={styles.countervalue}>{abbrev(channel.impressions, 0)}</Text>
            </View>
          </View>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{channel.name.toUpperCase()}</Text>
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
            <View style={styles.buttonscol}>
              {this.getActionButton()}
              { this.props.me.guid !== this.props.channel.channel.guid? 
                <ChannelActions channel={this.props.channel} me={this.props.me}></ChannelActions> : <View></View>
              }             
            </View>
          </View>
          <Text style={styles.briefdescription}>{channel.briefdescription}</Text>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </View>
    )
  }
}

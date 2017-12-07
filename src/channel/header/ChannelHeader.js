import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import channelService from '../ChannelService';
import { MINDS_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';

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
    if(!!this.props.channel.subscribed){
      return (
        <Button
          onPress={() => { console.log('press') }}
          title="Message"
          color="#4791d6"
          accessibilityLabel="Learn more about this purple button"
        />
      );
    } else {
      return (
        <Button
          onPress={() => { this.subscribe() }}
          title="Subscribe"
          color="#4791d6"
          accessibilityLabel="Learn more about this purple button"
        />
      );
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
        <Image source={iurl} style={styles.banner} resizeMode="cover" />
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
              <Icon name="md-settings" size={15} />
            </View>
          </View>
          <Text style={styles.briefdescription}>{channel.briefdescription}</Text>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </View>
    )
  }
}

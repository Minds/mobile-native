import React, {
  Component
} from 'react';

import {
  StyleSheet,
  FlatList,
  Text,
  Image,
  View,
  ActivityIndicator
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../config/Config';

import abbrev from '../common/helpers/abbrev';

@inject('channel')
@observer
export default class ChannelScreen extends Component {

  componentWillMount() {
    this.props.channel.load(this.props.navigation.state.params.guid);
  }

  getBannerFromChannel() {
    const channel = this.props.channel.channel;
    if (channel && channel.carousels) {
      return channel.carousels[0].src;
    }

    return `${MINDS_URI}fs/v1/banners/${channel.guid}/0/${channel.banner}`;
  }

  getAvatar() {
    const channel = this.props.channel.channel;
    return `${MINDS_URI}icon/${channel.guid}/large/${channel.icontime}`;
  }

  render() {
    const channel = this.props.channel.channel;
    if (!channel.guid) {
      return (
      <ActivityIndicator size={'large'} />
      );
    }


    const name = this.props.navigation.state.params.guid;
    const avatar = {uri:this.getAvatar()};
    const iurl = {uri:this.getBannerFromChannel()};
    return (
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Image source={iurl} style={styles.banner} />
        </View>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.headertextcontainer}>
          <View style={{width: 120, paddingTop:50, alignItems: 'center'}}>
            <Text style={styles.name}>{channel.name}</Text>
          </View>
          <View style={styles.countercontainer}>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>SUBSCRIBERS</Text>
              <Text>{abbrev(channel.subscribers_count, 0)}</Text>
            </View>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>VIEWS</Text>
              <Text>{abbrev(channel.impressions, 0)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// style
const styles = StyleSheet.create({
  headertextcontainer: {
    padding: 8,
    flexDirection: 'row',
    flex: 1
  },
  name: {
    fontSize: 15,

  },
  countertitle: {
    color: '#666',
    fontSize: 10
  },
  banner: {
    flex: 1,
  },
  countercontainer: {
    flex: 1,
    flexDirection: 'row'
  },
  counter: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 150,
    height: 100,
    width: 100,
    borderRadius: 50
  },
  banner: {
    flex: 1,
    alignItems: 'stretch',
    height: 200,
  },
  headercontainer: {
    flexDirection: 'row',
  },
  container: {
    alignItems: 'flex-start',
    flex: 1,
    backgroundColor: '#FFF'
  }
});
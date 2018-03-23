import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import BoostActionBar from './BoostActionBar';
import ChannelCard from '../channel/card/ChannelCard';
import BlogCard from '../blogs/BlogCard';
import VideoCard from '../media/VideoCard';
import ImageCard from '../media/ImageCard';


import {
  Text,
  StyleSheet,
  View
} from 'react-native';

import Activity from '../newsfeed/activity/Activity'
import FastImage from 'react-native-fast-image';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import UserModel from '../channel/UserModel';
import GroupCard from '../groups/card/GroupCard';

export default class Boost extends Component {

  state = {

  };

  render() {

    return (
        <View style={styles.container}>
          { this.renderEntity() }
          { this.showBoostActionBar() }
        </View>
    );
  }

  showBoostActionBar() {
    return <BoostActionBar entity={this.props.boost} />
  }

  renderEntity() {
    const entity = this.props.boost.entity;

    switch (entity.type) {
      case 'activity':
        return <Activity entity={ActivityModel.create(entity)} hideTabs={true} navigation={this.props.navigation} />;
      case 'user':
        return <ChannelCard entity={UserModel.create(entity)} navigation={this.props.navigation} />;
      case 'group':
        return <GroupCard entity={UserModel.create(entity)} navigation={this.props.navigation} />;
      case 'object':

        switch (entity.subtype) {
          case 'blog':
            return <BlogCard entity={BlogModel.create(entity)} navigation={this.props.navigation} />;
          case 'image':
            return <ImageCard entity={entity} navigation={this.props.navigation} />;
          case 'video':
            return <VideoCard entity={ActivityModel.create(entity)} navigation={this.props.navigation} />
        }
    }
    return <Text>Entity {entity.type} {entity.subtype} not supported</Text>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
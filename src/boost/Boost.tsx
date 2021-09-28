//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import BoostActionBar from './BoostActionBar';
import ChannelCard from '../channel/card/ChannelCard';
import BlogCard from '../blogs/BlogCard';
import VideoCard from '../media/VideoCard';
import ImageCard from '../media/ImageCard';

import Activity from '../newsfeed/activity/Activity';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import UserModel from '../channel/UserModel';
import GroupCard from '../groups/card/GroupCard';
import GroupModel from '../groups/GroupModel';
import MText from '../common/components/MText';

/**
 * Boost console item
 */
export default class Boost extends Component {
  /**
   * Render
   */
  render() {
    return (
      <View style={styles.container}>
        {this.renderEntity()}
        {this.showBoostActionBar()}
      </View>
    );
  }

  showBoostActionBar() {
    return <BoostActionBar entity={this.props.boost} />;
  }

  renderEntity() {
    const entity = this.props.boost.entity;

    if (!entity) {
      return null;
    }

    switch (entity.type) {
      case 'activity':
        return (
          <Activity
            entity={ActivityModel.create(entity)}
            hideTabs={true}
            navigation={this.props.navigation}
          />
        );
      case 'user':
        return (
          <ChannelCard
            entity={UserModel.create(entity)}
            navigation={this.props.navigation}
          />
        );
      case 'group':
        return (
          <GroupCard
            entity={GroupModel.create(entity)}
            navigation={this.props.navigation}
          />
        );
      case 'object':
        switch (entity.subtype) {
          case 'blog':
            return (
              <BlogCard
                entity={BlogModel.create(entity)}
                navigation={this.props.navigation}
              />
            );
          case 'image':
            return (
              <ImageCard
                entity={ActivityModel.create(entity)}
                navigation={this.props.navigation}
              />
            );
          case 'video':
            return (
              <VideoCard
                entity={ActivityModel.create(entity)}
                navigation={this.props.navigation}
              />
            );
        }
    }
    return (
      <MText>
        Entity {entity.type} {entity.subtype} not supported
      </MText>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

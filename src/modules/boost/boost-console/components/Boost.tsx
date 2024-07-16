import { NavigationProp } from '@react-navigation/native';
import React, { Component } from 'react';
import { View } from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';

import { B1, B2 } from '~/common/ui';

import BlogCard from '~/blogs/BlogCard';
import BlogModel from '~/blogs/BlogModel';
import ChannelCard from '~/channel/card/ChannelCard';
import UserModel from '~/channel/UserModel';
import GroupCard from '~/groups/card/GroupCard';
import GroupModel from '~/groups/GroupModel';
import ImageCard from '~/media/ImageCard';
import VideoCard from '~/media/VideoCard';
import Activity from '~/newsfeed/activity/Activity';
import ActivityModel from '~/newsfeed/ActivityModel';
import BoostActionBar from './BoostActionBar';
import BoostModel from '../../models/BoostModel';
import sp from '~/services/serviceProvider';

interface BoostProps {
  boost: BoostModel;
  navigation: NavigationProp<any>;
}

/**
 * Boost console item
 */
export default class Boost extends Component<BoostProps> {
  /**
   * Render
   */
  render() {
    return (
      <View style={styles.container}>
        {this.renderEntity()}
        {this.showBoostActionBar()}
        {this.renderReason()}
      </View>
    );
  }

  renderReason() {
    return this.props.boost.rejection_reason &&
      this.props.boost.rejection_reason >= 0 ? (
      <View style={styles.rejection}>
        <IonIcon name="warning" style={styles.icon} size={18} />
        <B2>
          {sp.i18n.t(
            `boosts.rejectionReasons.${this.props.boost.rejection_reason}`,
          )}
        </B2>
      </View>
    ) : null;
  }

  showBoostActionBar() {
    return <BoostActionBar boost={this.props.boost} />;
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
            borderless
          />
        );
      case 'user':
        return (
          <ChannelCard
            entity={UserModel.create(entity)}
            // @ts-ignore
            navigation={this.props.navigation}
          />
        );
      case 'group':
        return (
          <GroupCard
            // @ts-ignore
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
                // @ts-ignore
                entity={ActivityModel.create(entity)}
                navigation={this.props.navigation}
              />
            );
          case 'video':
            return (
              <VideoCard
                // @ts-ignore
                entity={ActivityModel.create(entity)}
                navigation={this.props.navigation}
              />
            );
        }
    }
    return (
      <B1 space="L">
        Entity {entity.type} {entity.subtype} not supported
      </B1>
    );
  }
}

const styles = sp.styles.create({
  icon: ['colorSecondaryText', 'paddingRight'],
  rejection: [
    'padding2x',
    'rowJustifyCenter',
    'bcolorPrimaryBorder',
    'centered',
    'borderTop',
    'fullWidth',
  ],
  container: [
    'borderBottom6x',
    'flexContainer',
    'borderBottom3x',
    'bcolorPrimaryBorder',
  ],
});

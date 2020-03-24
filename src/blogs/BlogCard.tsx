import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  Avatar,
} from 'react-native-elements';

import FastImage from 'react-native-fast-image';
import formatDate from '../common/helpers/date';
import { CommonStyle as CS} from '../styles/Common';
import { FLAG_VIEW } from '../common/Permissions';
import Actions from '../newsfeed/activity/Actions';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Blog Card
 */
export default class BlogCard extends PureComponent {
  /**
   * Navigate to blog
   */
  navToBlog = () => {
    if (!this.props.navigation || !this.props.entity.can(FLAG_VIEW, true)) {
      return;
    }
    return this.props.navigation.push('BlogView', { blog: this.props.entity });
  };

  /**
   * Trim and remove new line char
   * @param {string} title
   */
  cleanTitle(title) {
    if (!title) {
      return '';
    }
    return title.trim().replace(/\n/gm, ' ');
  }

  /**
   * Render Card
   */
  render() {
    const blog = this.props.entity;
    const channel = this.props.entity.ownerObj;
    const image = blog.getBannerSource();
    const title = this.cleanTitle(blog.title);
    const theme = ThemedStyles.style;

    return (
      <TouchableOpacity onPress={this.navToBlog} style={theme.backgroundSecondary}>
        <FastImage source={image} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={[CS.padding2x]}>
          <View style={[CS.columnAlignStart, CS.fullWidth]}>
            <Text style={[CS.fontL, CS.fontMedium, CS.flexContainer]} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
            <View style={[CS.marginBottom2x, CS.marginTop2x, CS.rowJustifyCenter, CS.alignCenter]}>
              { channel && <Avatar
                width={24}
                height={24}
                rounded
                source={channel.getAvatarSource()}
              /> }
              <Text style={[CS.fontS, CS.paddingLeft, CS.flexContainer]} numberOfLines={1}>{blog.ownerObj && blog.ownerObj.username.toUpperCase()}</Text>
              <Text style={[CS.fontXS, CS.paddingLeft]}>{formatDate(blog.time_created)}</Text>
            </View>
          </View>
        </View>
        <Actions
          entity={blog}
          navigation={this.props.navigation}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 150,
    width: '100%',
  },
});

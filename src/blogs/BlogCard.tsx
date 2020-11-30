//@ts-nocheck
import React, { PureComponent } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from 'react-native-elements';

import FastImage from 'react-native-fast-image';
import SmartImage from '../common/components/SmartImage';
import formatDate from '../common/helpers/date';
import { FLAG_VIEW } from '../common/Permissions';
import Actions from '../newsfeed/activity/Actions';
import { CommonStyle as CS } from '../styles/Common';
import ThemedStyles from '../styles/ThemedStyles';
import type BlogModel from './BlogModel';
import BlogActionSheet from './BlogActionSheet';

type PropsType = {
  entity: BlogModel;
  navigation: any;
};

/**
 * Blog Card
 */
export default class BlogCard extends PureComponent<PropsType> {
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
      <View>
        <View style={[styles.actionSheet]}>
          <BlogActionSheet entity={blog} navigation={this.props.navigation} />
        </View>
        <TouchableOpacity
          onPress={this.navToBlog}
          style={theme.backgroundSecondary}>
          <FastImage
            source={image}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={[CS.padding2x]}>
            <View style={[CS.columnAlignStart, CS.fullWidth]}>
              <Text
                style={[CS.fontL, CS.fontMedium, CS.flexContainer]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {title}
              </Text>
              <View
                style={[
                  CS.marginBottom2x,
                  CS.marginTop2x,
                  CS.rowJustifyCenter,
                  CS.alignCenter,
                ]}>
                {channel && (
                  <Avatar
                    width={24}
                    height={24}
                    rounded
                    source={channel.getAvatarSource()}
                  />
                )}
                <Text
                  style={[CS.fontS, CS.paddingLeft, CS.flexContainer]}
                  numberOfLines={1}>
                  {blog.ownerObj && blog.ownerObj.username.toUpperCase()}
                </Text>
                <Text style={[CS.fontXS, CS.paddingLeft]}>
                  {formatDate(blog.time_created)}
                </Text>
              </View>
            </View>
          </View>
          {!this.props.hideTabs && (
            <Actions entity={blog} navigation={this.props.navigation} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 150,
    width: '100%',
  },
  actionSheet: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

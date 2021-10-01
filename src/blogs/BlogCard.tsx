//@ts-nocheck
import React, { PureComponent } from 'react';

import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Avatar } from 'react-native-elements';

import FastImage from 'react-native-fast-image';
import { FLAG_VIEW } from '../common/Permissions';
import Actions from '../newsfeed/activity/Actions';
import ThemedStyles from '../styles/ThemedStyles';
import type BlogModel from './BlogModel';
import BlogActionSheet from './BlogActionSheet';
import i18n from '../common/services/i18n.service';
import MText from '../common/components/MText';

type PropsType = {
  entity: BlogModel;
  navigation: any;
  showOnlyContent?: boolean;
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

  renderOnlyContent(image, title) {
    const theme = ThemedStyles.style;
    return (
      <View>
        <TouchableOpacity
          onPress={this.navToBlog}
          style={theme.bgSecondaryBackground}>
          <FastImage
            source={image}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={theme.padding2x}>
            <View style={theme.fullWidth}>
              <MText
                style={[theme.fontL, theme.fontMedium, theme.flexContainer]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {title}
              </MText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
    const showOnlyContent = this.props.showOnlyContent;
    if (showOnlyContent) {
      return this.renderOnlyContent(image, title);
    }
    return (
      <View>
        <TouchableOpacity
          onPress={this.navToBlog}
          style={theme.bgSecondaryBackground}>
          <FastImage
            source={image}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={theme.padding2x}>
            <View style={theme.fullWidth}>
              <MText
                style={[theme.fontXL, theme.fontMedium, theme.flexContainer]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {title}
              </MText>
              <View
                style={[
                  theme.marginBottom2x,
                  theme.marginTop3x,
                  theme.rowJustifyCenter,
                  theme.alignCenter,
                ]}>
                {channel && (
                  <Avatar
                    width={26}
                    height={26}
                    rounded
                    source={channel.getAvatarSource()}
                  />
                )}
                <MText
                  style={[
                    theme.fontL,
                    theme.paddingLeft2x,
                    theme.flexContainer,
                  ]}
                  numberOfLines={1}>
                  {blog.ownerObj && blog.ownerObj.username}
                </MText>
                <MText style={[theme.fontXS, theme.paddingLeft]}>
                  {i18n.date(blog.time_created * 1000)}
                </MText>
                <View style={theme.paddingLeft}>
                  <BlogActionSheet
                    entity={blog}
                    navigation={this.props.navigation}
                  />
                </View>
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
});

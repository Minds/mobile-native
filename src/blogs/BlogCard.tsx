import React, { PureComponent } from 'react';

import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Avatar } from 'react-native-elements';
import { Image } from 'expo-image';

import { FLAG_VIEW } from '../common/Permissions';
import Actions from '../newsfeed/activity/Actions';
import BlogModel from './BlogModel';
import BlogActionSheet from './BlogActionSheet';
import MText from '../common/components/MText';
import MPressable from '~/common/components/MPressable';
import sp from '~/services/serviceProvider';
import CommentsStore from '~/comments/v2/CommentsStore';
import { pushCommentBottomSheet } from '~/comments/v2/CommentBottomSheet';

type PropsType = {
  entity: BlogModel;
  navigation: any;
  showOnlyContent?: boolean;
  hideTabs?: boolean;
};

/**
 * Blog Card
 */
export default class BlogCard extends PureComponent<PropsType> {
  /**
   * Navigate to blog
   */
  navToBlog = () => {
    const blog = BlogModel.checkOrCreate(this.props.entity);
    if (!this.props.navigation || !blog.can(FLAG_VIEW, true)) {
      return;
    }
    return this.props.navigation.push('BlogView', { blog });
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
    const theme = sp.styles.style;
    return (
      <View>
        <TouchableOpacity
          onPress={this.navToBlog}
          style={theme.bgPrimaryBackground}>
          <Image source={image} style={styles.banner} contentFit="cover" />
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

  onPressComment = () => {
    const store = new CommentsStore(this.props.entity);

    pushCommentBottomSheet({
      commentsStore: store,
    });
  };

  /**
   * Render Card
   */
  render() {
    const blog = BlogModel.checkOrCreate(this.props.entity);
    const channel = this.props.entity.ownerObj;
    const image = blog.getBannerSource?.();
    const title = this.cleanTitle(blog.title);
    const theme = sp.styles.style;
    const showOnlyContent = this.props.showOnlyContent;

    if (showOnlyContent) {
      return this.renderOnlyContent(image, title);
    }

    return (
      <View style={theme.bgPrimaryBackground}>
        <MPressable onPress={this.navToBlog}>
          <Image source={image} style={styles.banner} contentFit="cover" />
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
                  <Avatar rounded source={channel.getAvatarSource()} />
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
                  {sp.i18n.date(parseInt(blog.time_created, 10) * 1000)}
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
            <Actions onPressComment={this.onPressComment} entity={blog} />
          )}
        </MPressable>
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

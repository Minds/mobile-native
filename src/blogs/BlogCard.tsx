import React, { useCallback, useRef } from 'react';

import { View, StyleSheet } from 'react-native';

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
const BlogCard: React.FC<PropsType> = ({
  entity,
  navigation,
  showOnlyContent,
  hideTabs,
}) => {
  /**
   * Navigate to blog
   */
  const navToBlog = () => {
    const blog = BlogModel.checkOrCreate(entity);
    if (!navigation || !blog.can(FLAG_VIEW, true)) {
      return;
    }
    return navigation.push('BlogView', { blog });
  };

  /**
   * Trim and remove new line char
   * @param {string} title
   */
  const cleanTitle = (title: string) => {
    if (!title) {
      return '';
    }
    return title.trim().replace(/\n/gm, ' ');
  };

  const renderOnlyContent = (image: any, title: string) => {
    const theme = sp.styles.style;
    return (
      <View>
        <MPressable
          onPress={navToBlog}
          style={theme.bgPrimaryBackground}
          testID="blogPressable">
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
        </MPressable>
      </View>
    );
  };

  const commentsStoreRef = useRef<CommentsStore | null>(null);

  const onPressComment = useCallback(() => {
    if (!commentsStoreRef.current) {
      commentsStoreRef.current = new CommentsStore(entity);
    }
    pushCommentBottomSheet({
      commentsStore: commentsStoreRef.current,
    });
  }, [entity]);

  /**
   * Render Card
   */
  const blog = BlogModel.checkOrCreate(entity);
  const channel = entity.ownerObj;
  const image = blog.getBannerSource?.();
  const title = cleanTitle(blog.title);
  const theme = sp.styles.style;

  if (showOnlyContent) {
    // render only content
    return renderOnlyContent(image, title);
  }

  return (
    <View style={theme.bgPrimaryBackground}>
      <MPressable onPress={navToBlog} testID="blogPressable">
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
              {channel && <Avatar rounded source={channel.getAvatarSource()} />}
              <MText
                style={[theme.fontL, theme.paddingLeft2x, theme.flexContainer]}
                numberOfLines={1}>
                {blog.ownerObj && blog.ownerObj.username}
              </MText>
              <MText style={[theme.fontXS, theme.paddingLeft]}>
                {sp.i18n.date(parseInt(blog.time_created, 10) * 1000)}
              </MText>
              <View style={theme.paddingLeft}>
                <BlogActionSheet entity={blog} navigation={navigation} />
              </View>
            </View>
          </View>
        </View>
        {!hideTabs && <Actions onPressComment={onPressComment} entity={blog} />}
      </MPressable>
    </View>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
  banner: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 150,
    width: '100%',
  },
});

import React from 'react';
import { View, TextStyle } from 'react-native';
import BlogCard from '../../../../blogs/BlogCard';
import BlogModel from '../../../../blogs/BlogModel';
import ReadMore from '../../../../common/components/ReadMore';
import Activity from '../../../../newsfeed/activity/Activity';
import ActivityModel from '../../../../newsfeed/ActivityModel';
import type NotificationModel from '../NotificationModel';
import { bodyTextStyle, spacedCommentPreview, styles } from '../styles';

type PropsType = {
  notification: NotificationModel;
  navigation: any;
};

const ContentPreview = ({ notification, navigation }: PropsType) => {
  const entityIsUser = notification.entity?.type === 'user';
  const hasCommentExcerpt =
    notification.type === 'comment' && !!notification.data.comment_excerpt;
  const isEntityComment = notification.entity?.type === 'comment';
  const isNoCommentEntity =
    notification.entity && notification.entity?.type !== 'comment';

  if (
    entityIsUser ||
    (!hasCommentExcerpt && !isEntityComment && !isNoCommentEntity)
  ) {
    return null;
  }

  return (
    <View style={styles.contentPreviewContainer}>
      {hasCommentExcerpt &&
        renderComment(
          notification.data.comment_excerpt,
          notification.entity ? spacedCommentPreview : bodyTextStyle,
          navigation,
        )}
      {isEntityComment &&
        renderComment(
          notification.entity?.description!,
          bodyTextStyle,
          navigation,
        )}
      {isNoCommentEntity && renderContent(notification, navigation)}
    </View>
  );
};

const renderComment = (
  text: string,
  style: TextStyle | TextStyle[],
  navigation: any,
) => {
  return (
    <ReadMore
      numberOfLines={6}
      navigation={navigation}
      text={`“${text}”`}
      style={style}
    />
  );
};

const renderContent = (notification: NotificationModel, navigation: any) => {
  if (
    notification.entity.type === 'object' &&
    notification.entity.subtype === 'blog'
  ) {
    return (
      <BlogCard
        entity={BlogModel.create(notification.entity)}
        navigation={navigation}
        showOnlyContent={true}
      />
    );
  } else {
    return (
      <Activity
        entity={ActivityModel.create(notification.entity)}
        navigation={navigation}
        autoHeight={false}
        showCommentsOutlet={false}
        showOnlyContent={true}
      />
    );
  }
};

export default ContentPreview;

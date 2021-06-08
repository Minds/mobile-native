import React from 'react';
import { View, Text } from 'react-native';
import BlogCard from '../../../../blogs/BlogCard';
import BlogModel from '../../../../blogs/BlogModel';
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
    notification.type === 'comment' && notification.data.comment_excerpt;
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
      {hasCommentExcerpt && (
        <Text
          style={notification.entity ? spacedCommentPreview : bodyTextStyle}>
          “{notification.data.comment_excerpt}”
        </Text>
      )}
      {isEntityComment && (
        <Text style={bodyTextStyle}>“{notification.entity?.description}”</Text>
      )}
      {isNoCommentEntity && renderContent(notification, navigation)}
    </View>
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

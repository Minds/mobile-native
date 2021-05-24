import React from 'react';
import { View, Text } from 'react-native';
import Activity from '../../../newsfeed/activity/Activity';
import ActivityModel from '../../../newsfeed/ActivityModel';
import { Notification } from '../../../types/Common';
import { spacedCommentPreview, styles } from './styles';

type PropsType = {
  notification: Notification;
  navigation: any;
};

const ContentPreview = ({ notification, navigation }: PropsType) => {
  const hasCommentExcerpt =
    notification.type === 'comment' && notification.data.comment_excerpt;
  const isEntityComment = notification.entity?.type === 'comment';
  const isNoCommentEntity =
    notification.entity && notification.entity?.type !== 'comment';

  if (!hasCommentExcerpt && !isEntityComment && !isNoCommentEntity) {
    return null;
  }

  return (
    <View style={styles.contentPreviewContainer}>
      {hasCommentExcerpt && (
        <Text
          style={
            notification.entity ? spacedCommentPreview : styles.commentPreview
          }>
          “{notification.data.comment_excerpt}”
        </Text>
      )}
      {isEntityComment && (
        <Text style={styles.commentPreview}>
          “{notification.entity?.description}”
        </Text>
      )}
      {isNoCommentEntity && (
        <Activity
          entity={ActivityModel.create(notification.entity)}
          navigation={navigation}
          autoHeight={false}
          showCommentsOutlet={false}
          showOnlyContent={true}
        />
      )}
    </View>
  );
};

export default ContentPreview;

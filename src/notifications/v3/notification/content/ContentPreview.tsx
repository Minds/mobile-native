import React from 'react';
import { View, TextStyle } from 'react-native';

import { Button } from '~/common/ui';
import ReadMore from '~/common/components/ReadMore';
import BlogCard from '~/blogs/BlogCard';
import BlogModel from '~/blogs/BlogModel';
import Activity from '~/newsfeed/activity/Activity';
import ActivityModel from '~/newsfeed/ActivityModel';
import type NotificationModel from '../NotificationModel';
import { NotificationType } from '../NotificationModel';
import {
  bodyTextStyle,
  contentPreviewContainerBorder,
  spacedCommentPreview,
  styles,
} from '../styles';
import useNotificationRouter from '../useNotificationRouter';
import GroupsListItem from '~/groups/GroupsListItem';
import sp from '~/services/serviceProvider';

type PropsType = {
  notification: NotificationModel;
  navigation: any;
};

const ContentPreview = React.memo(({ notification, navigation }: PropsType) => {
  const entityIsUser = notification.entity?.type === 'user';
  const hasCommentExcerpt =
    notification.type === 'comment' && !!notification.data.comment_excerpt;
  const isEntityComment = notification.entity?.type === 'comment';
  const isNoCommentEntity =
    notification.entity && notification.entity?.type !== 'comment';
  const hasGiftCard =
    notification.type === NotificationType.gift_card_recipient_notified;
  const { navigateToObject } = useNotificationRouter(notification);

  switch (notification.type) {
    case NotificationType.supermind_created:
    case NotificationType.supermind_declined:
    case NotificationType.supermind_accepted:
    case NotificationType.supermind_expired:
    case NotificationType.supermind_expire24h:
    case NotificationType.affiliate_earnings_deposited:
    case NotificationType.referrer_affiliate_earnings_deposited:
      return null;
    case NotificationType.group_invite:
      return (
        <View style={contentPreviewContainerBorder}>
          <GroupsListItem group={notification.mappedEntity} />
        </View>
      );
  }

  if (
    (entityIsUser && !hasGiftCard) ||
    (!hasGiftCard &&
      !hasCommentExcerpt &&
      !isEntityComment &&
      !isNoCommentEntity)
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.contentPreviewContainer,
        hasGiftCard && styles.buttonMargin,
      ]}>
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
      {!hasGiftCard &&
        isNoCommentEntity &&
        renderContent(notification, navigation)}
      {hasGiftCard && (
        <Button mode="outline" type="action" onPress={navigateToObject}>
          {sp.i18n.t('notification.claimGiftButton')}
        </Button>
      )}
    </View>
  );
});

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
        entity={ActivityModel.create(
          notification.type.startsWith('boost_')
            ? notification.entity.entity
            : notification.entity,
        )}
        navigation={navigation}
        autoHeight={false}
        showOnlyContent={true}
      />
    );
  }
};

export default ContentPreview;

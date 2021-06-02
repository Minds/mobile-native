import { useNavigation } from '@react-navigation/core';
import UserModel from '../../../channel/UserModel';
import type NotificationModel from './NotificationModel';

const useNotificationRouter = (notification: NotificationModel) => {
  const navigation = useNavigation();
  const router = {
    navigation: navigation,
    navigate: () => {},
    navToChannel: (user: UserModel) => {
      navigation.navigate('Channel', {
        guid: user.guid,
        entity: user,
      });
    },
    navToEntity: () => {
      // Default case
      let screen: string = 'Activity';
      let params: any = {
        entity: notification.entity,
        hydrate: true,
      };

      // Only have focuserUrn if notification type or entity type is comment
      const focusedUrn =
        notification.type === 'comment'
          ? notification.data.comment_urn
          : notification.entity?.type === 'comment'
          ? notification.entity.urn
          : null;

      // if blog, nav to blogView
      if (
        notification.entity.type === 'object' &&
        notification.entity.subtype === 'blog'
      ) {
        screen = 'Activity';
        params = {
          entity: notification.entity,
          hydrate: true,
        };
      } else {
        // if group nav to GroupView
        if (notification.entity.type === 'group') {
          screen = 'GroupView';
          params = {
            guid: notification.entity.guid,
            tab: 'conversation',
          };
        } else if (notification.entity.type === 'user') {
          screen = 'Channel';
          params = {
            guid: notification.entity.guid,
            entity: UserModel.checkOrCreate(notification.entity),
          };
        }
      }

      if (focusedUrn) {
        params.focusedUrn = focusedUrn;
      }

      // Do the nav
      navigation.navigate(screen, params);
    },
  };
  return router;
};

export type NotificationRouter = ReturnType<typeof useNotificationRouter>;

export default useNotificationRouter;

import { useNavigation } from '@react-navigation/core';
import type UserModel from '../../../channel/UserModel';
import { Notification } from '../../../types/Common';

const useNotificationRouter = (notification: Notification) => {
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

export default useNotificationRouter;

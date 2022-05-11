import { useNavigation } from '@react-navigation/core';
import UserModel from '../../../channel/UserModel';
import type NotificationModel from './NotificationModel';

const useNotificationRouter = (
  notification: NotificationModel,
  showSubscribersModal: () => void,
) => {
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
      navigator.set(navigation, notification);
      if (
        ['token_rewards_summary', 'wire_received'].includes(notification.type)
      ) {
        navigator.navTo('Tabs');
      } else if (notification.type === 'subscribe') {
        if (!notification.hasMerged) {
          router.navToChannel(notification.from);
        } else {
          showSubscribersModal();
        }
      } else {
        switch (notification.entity.type) {
          case 'group':
            navigator.navTo('GroupView');
            break;
          case 'user':
            navigator.navTo('Channel');
            break;
          default:
            navigator.navTo('Activity');
        }
      }
    },
  };
  return router;
};

type NavigatorScreensType = 'Activity' | 'Tabs' | 'GroupView' | 'Channel';

const navigator = {
  navigation: null as any,
  notification: {} as NotificationModel,
  params: {} as { [k in NavigatorScreensType]: any },
  set(navigation, notification) {
    this.navigation = navigation;
    this.notification = notification;

    const activityParams =
      this.notification.entity?.type === 'comment'
        ? {
            guid: this.notification.entity.entity_guid,
            hydrate: true,
          }
        : {
            entity: this.notification.entity,
            hydrate: true,
          };

    this.params = {
      Activity: activityParams,
      Tabs: {
        screen: 'More',
        params: {
          screen: 'Wallet',
          params: { currency: 'tokens', section: 'transactions' },
          initial: false,
        },
      },
      GroupView: {
        guid: this.notification.entity.guid,
        tab: 'conversation',
      },
      Channel: {
        guid: this.notification.entity.guid,
        entity: UserModel.checkOrCreate(this.notification.entity),
      },
    };
  },
  navTo(screen: NavigatorScreensType) {
    let params: any = this.params[screen];
    const focusedUrn =
      this.notification.type === 'comment'
        ? this.notification.data.comment_urn
        : this.notification.entity?.type === 'comment'
        ? this.notification.entity.urn
        : null;
    if (focusedUrn) {
      params.focusedUrn = focusedUrn;
    }

    this.navigation.navigate(screen, params);
  },
};

export type NotificationRouter = ReturnType<typeof useNotificationRouter>;

export default useNotificationRouter;

import { useNavigation } from '@react-navigation/core';
import UserModel from '../../../channel/UserModel';
import type NotificationModel from './NotificationModel';

const useNotificationRouter = (notification: NotificationModel) => {
  const navigation = useNavigation();
  navigator.set(navigation, notification);
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
      if (notification.type === 'token_rewards_summary') {
        navigator.navTo('Tabs');
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
  set(navigation, notification) {
    this.navigation = navigation;
    this.notification = notification;
  },
  navTo(screen: NavigatorScreensType) {
    let params: any = this.getParams(screen);
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
  getParams(screen: NavigatorScreensType) {
    const params = {
      Activity: {
        entity: this.notification.entity,
        hydrate: true,
      },
      Tabs: {
        screen: 'CaptureTab',
        params: {
          screen: 'Wallet',
          params: { currency: 'tokens', section: 'transactions' },
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
    return params[screen];
  },
};

export type NotificationRouter = ReturnType<typeof useNotificationRouter>;

export default useNotificationRouter;

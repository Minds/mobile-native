import { useNavigation } from '@react-navigation/core';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import type NotificationModel from './NotificationModel';
import { NotificationType } from './NotificationModel';

const useNotificationRouter = (
  notification: NotificationModel,
  showSubscribersModal?: () => void,
) => {
  const navigation = useNavigation();
  const router = {
    navigation: navigation,
    navigate: () => {},
    navToChannel: (user: UserModel) =>
      navigation.navigate('Channel', {
        guid: user.guid,
        entity: user,
      }),
    navToOwnChannel: () => router.navToChannel(sessionService.getUser()),
    navToEntity: () => {
      navigator.set(navigation, notification);

      switch (notification.type) {
        case NotificationType.token_rewards_summary:
        case NotificationType.wire_received:
          navigator.navTo('Tabs');
          break;
        case NotificationType.subscribe:
          if (!notification.hasMerged) {
            router.navToChannel(notification.from);
          } else {
            showSubscribersModal?.();
          }
          break;
        case NotificationType.supermind_created:
        case NotificationType.supermind_declined:
        case NotificationType.supermind_expire24h:
        case NotificationType.supermind_expired:
        case NotificationType.gift_card_recipient_notified:
          router.navigateToObject();
          break;
        case NotificationType.boost_accepted:
        case NotificationType.boost_rejected:
        case NotificationType.boost_completed:
          if (notification.entity?.guid) {
            navigation.navigate('SingleBoostConsole', {
              guid: notification.entity?.guid,
            });
          } else {
            navigation.navigate('BoostConsole', {
              location:
                notification.data?.boost_location === 2 ? 'sidebar' : undefined,
            });
          }
          break;
        case NotificationType.supermind_accepted:
          navigator.navTo('Activity');
          break;
        case NotificationType.affiliate_earnings_deposited:
        case NotificationType.referrer_affiliate_earnings_deposited:
          navigation.navigate('More', {
            screen: 'Wallet',
            params: { currency: 'usd', section: 'earnings' },
            initial: false,
          });
          break;
        default:
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
    navigateToObject: () => {
      switch (notification.type) {
        case NotificationType.supermind_created:
        case NotificationType.supermind_declined:
        case NotificationType.supermind_expire24h:
        case NotificationType.supermind_expired:
          if (!notification.entity?.guid) {
            console.error('Entity has no guid');
            return null;
          }

          navigation.navigate('Supermind', {
            guid: notification.entity.guid,
          });
          break;
        case NotificationType.supermind_accepted:
          router.navToEntity();
          break;
        case NotificationType.gift_card_recipient_notified:
          const code = notification.data?.gift_card?.claimCode;
          if (code) {
            navigation.navigate('GifCardClaim', { code });
          }
          break;
        default:
          // If the navigation was targeted to us navigate to own channel
          if (notification.to_guid === sessionService.getUser().guid) {
            return router.navToOwnChannel();
          }

          // otherwise navigate to the sender channel
          return router.navToChannel(notification.from);
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
    let activityParams;

    if (this.notification.entity?.type === 'comment') {
      activityParams = {
        guid: this.notification.entity.entity_guid,
        hydrate: true,
      };
    } else if (this.notification.type === NotificationType.supermind_accepted) {
      activityParams = {
        guid: this.notification.entity.reply_activity_guid,
        hydrate: false,
      };
    } else if (this.notification.type === NotificationType.boost_rejected) {
      activityParams = {
        entity: this.notification.entity.entity,
        hydrate: true,
      };
    } else {
      activityParams = {
        entity: this.notification.entity,
        hydrate: true,
      };
    }

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
      params.focusedCommentUrn = focusedUrn;
    }

    this.navigation.navigate(screen, params);
  },
};

export type NotificationRouter = ReturnType<typeof useNotificationRouter>;

export default useNotificationRouter;

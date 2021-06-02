import type UserModel from '../../../channel/UserModel';
import AbstractModel from '../../../common/AbstractModel';
import toFriendlyCrypto from '../../../common/helpers/toFriendlyCrypto';
import i18n from '../../../common/services/i18n.service';
import sessionService from '../../../common/services/session.service';
import type ActivityModel from '../../../newsfeed/ActivityModel';

export default class NotificationModel extends AbstractModel {
  created_timestamp!: number;
  data: any;
  entity!: ActivityModel;
  entity_urn!: string;
  from!: UserModel;
  from_guid!: string;
  merge_key!: string;
  merged_count!: number;
  merged_from!: UserModel[];
  merged_from_guids!: string[];
  read!: boolean;
  to_guid!: string;
  type!: NotificationType;
  urn!: string;
  uuid!: string;

  // credit to Patrick Roberts https://stackoverflow.com/a/57065680
  isOfNotificationType() {
    return (notificationsType as readonly string[]).includes(this.type);
  }

  get Pronoun() {
    switch (this.type) {
      case 'quote':
        return 'your';
      case 'boost_peer_request':
        return 'a';
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return 'your';
      case 'wire_received':
        switch (this.data.method) {
          case 'tokens':
            return (
              'you ' +
              toFriendlyCrypto(this.data.amount) +
              ' ' +
              this.data.method
            );
          case 'usd':
            const usd = Math.round(this.data.amount / 100);
            return 'you $' + usd;
        }
      case 'subscribe':
      case 'group_queue_add':
      case 'token_rewards_summary':
        return '';
    }

    return this.entity?.owner_guid === sessionService.getUser().guid
      ? 'your'
      : 'their';
  }

  get Noun() {
    switch (this.type) {
      case 'wire_received':
      case 'group_queue_add':
      case 'token_rewards_summary':
        return '';
      case 'boost_peer_request':
      case 'boost_peer_accepted':
      case 'boost_peer_rejected':
        return 'boost offer';
      case 'boost_rejected':
        return 'boost';
    }
    switch (this.entity?.type) {
      case 'comment':
        return 'comment';
      case 'object':
        return this.entity?.subtype;
      case 'user':
        return 'you';
      default:
        return 'post';
    }
  }

  get Verb() {
    return i18n.t(`notification.verbs.${this.type}`, {
      amount: this.data?.tokens_formatted,
    });
  }
}

const notificationsType = [
  'vote_up',
  'vote_down',
  'comment',
  'tag',
  'remind',
  'quote',
  'subscribe',
  'group_queue_add',
  'group_queue_approve',
  'group_queue_reject',
  'wire_received',
  'boost_peer_request',
  'boost_peer_accepted',
  'boost_peer_rejected',
  'boost_rejected',
  'token_rewards_summary',
] as const;

export type NotificationType = typeof notificationsType[number];

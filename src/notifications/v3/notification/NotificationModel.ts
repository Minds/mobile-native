import { observable } from 'mobx';
import UserModel from '../../../channel/UserModel';
import AbstractModel from '../../../common/AbstractModel';
import toFriendlyCrypto from '../../../common/helpers/toFriendlyCrypto';
import i18n from '../../../common/services/i18n.service';
import sessionService from '../../../common/services/session.service';

export default class NotificationModel extends AbstractModel {
  created_timestamp!: number;
  data: any;
  entity!: Record<string, any>;
  entity_urn!: string;
  from!: UserModel;
  from_guid!: string;
  merge_key!: string;
  merged_count!: number;
  merged_from!: UserModel[];
  merged_from_guids!: string[];
  @observable read!: boolean;
  to_guid!: string;
  type!: NotificationType;
  urn!: string;
  uuid!: string;

  childModels() {
    return {
      from: UserModel,
    };
  }

  // credit to Patrick Roberts https://stackoverflow.com/a/57065680
  isOfNotificationType() {
    return Object.values(NotificationType).includes(this.type);
  }

  get Pronoun() {
    switch (this.type) {
      case NotificationType.quote:
        return 'your';
      case NotificationType.boost_peer_request:
      case NotificationType.supermind_created:
        return 'a';
      case NotificationType.boost_peer_accepted:
      case NotificationType.boost_peer_rejected:
        return 'your';
      case NotificationType.wire_received:
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
      // eslint-disable-next-line no-fallthrough
      case NotificationType.subscribe:
      case NotificationType.group_queue_add:
      case NotificationType.token_rewards_summary:
      case NotificationType.supermind_expired:
      case NotificationType.boost_accepted:
      case NotificationType.boost_completed:
      case NotificationType.affiliate_earnings_deposited:
      case NotificationType.referrer_affiliate_earnings_deposited:
      case NotificationType.gift_card_recipient_notified:
        return '';
      case NotificationType.boost_rejected:
        return '';
    }

    return this.entity?.owner_guid === sessionService.getUser().guid ||
      this.to_guid === sessionService.getUser().guid
      ? 'your'
      : 'their';
  }

  get Noun(): string {
    switch (this.type) {
      case NotificationType.wire_received:
      case NotificationType.group_queue_add:
      case NotificationType.token_rewards_summary:
      case NotificationType.boost_accepted:
      case NotificationType.boost_completed:
      case NotificationType.affiliate_earnings_deposited:
      case NotificationType.referrer_affiliate_earnings_deposited:
      case NotificationType.gift_card_recipient_notified:
        return '';
      case NotificationType.boost_peer_request:
      case NotificationType.boost_peer_accepted:
      case NotificationType.boost_peer_rejected:
        return 'boost offer';
      case NotificationType.boost_rejected:
        return '';

      case NotificationType.supermind_created:
      case NotificationType.supermind_declined:
      case NotificationType.supermind_accepted:
      case NotificationType.supermind_expired:
      case NotificationType.supermind_expire24h:
        return 'Supermind offer';
    }
    switch (this.entity?.type) {
      case 'comment':
        return 'comment';
      case 'object':
        return this.entity?.subtype as string;
      case 'user':
        return 'you';
      default:
        return 'post';
    }
  }

  get Verb() {
    let type: NotificationType | 'reply' | 'boost_rejected_v2' =
      this.data && this.data.is_reply ? 'reply' : this.type;

    if (type === NotificationType.boost_rejected) {
      type = 'boost_rejected_v2';
    }
    return i18n.t(`notification.verbs.${type}`, {
      amount: this.data?.tokens_formatted ?? this.data?.amount_usd,
    });
  }

  get Subject() {
    switch (this.type) {
      case NotificationType.affiliate_earnings_deposited:
      case NotificationType.referrer_affiliate_earnings_deposited:
      case NotificationType.token_rewards_summary:
      case NotificationType.boost_accepted:
      case NotificationType.boost_completed:
        return '';
      case NotificationType.boost_rejected:
        return '';
    }

    return this.from?.name;
  }

  get hasMerged() {
    return this.merged_count > 0 && this.merged_from[0] !== undefined;
  }

  get isImperative() {
    switch (this.type) {
      case NotificationType.supermind_expired:
        return true;
      default:
        return false;
    }
  }
}

export enum NotificationType {
  vote_up = 'vote_up',
  vote_down = 'vote_down',
  comment = 'comment',
  tag = 'tag',
  remind = 'remind',
  quote = 'quote',
  subscribe = 'subscribe',
  group_queue_add = 'group_queue_add',
  group_queue_approve = 'group_queue_approve',
  group_queue_reject = 'group_queue_reject',
  wire_received = 'wire_received',
  boost_peer_request = 'boost_peer_request',
  boost_peer_accepted = 'boost_peer_accepted',
  boost_peer_rejected = 'boost_peer_rejected',
  boost_accepted = 'boost_accepted',
  boost_rejected = 'boost_rejected',
  boost_completed = 'boost_completed',
  token_rewards_summary = 'token_rewards_summary',
  supermind_created = 'supermind_created',
  supermind_declined = 'supermind_rejected',
  supermind_accepted = 'supermind_accepted',
  supermind_expired = 'supermind_expired',
  supermind_expire24h = 'supermind_expire24h',
  affiliate_earnings_deposited = 'affiliate_earnings_deposited',
  referrer_affiliate_earnings_deposited = 'referrer_affiliate_earnings_deposited',
  gift_card_recipient_notified = 'gift_card_recipient_notified',
}

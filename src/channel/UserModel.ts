import { observable, action, runInAction } from 'mobx';

import { MINDS_CDN_URI, GOOGLE_PLAY_STORE } from '../config/Config';
import api from '../common/services/api.service';
import BaseModel from '../common/BaseModel';
import ChannelService from './ChannelService';
import sessionService from '../common/services/session.service';
import apiService from '../common/services/api.service';
import logService from '../common/services/log.service';
import { SupportTiersType } from '../wire/WireTypes';
import settingsService from '../settings/SettingsService';
import { UserError } from '../common/UserError';
import i18n from '../common/services/i18n.service';
import { showNotification } from '../../AppMessages';
import { SocialProfile } from '../types/Common';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';

//@ts-nocheck
export const USER_MODE_OPEN = 0;
export const USER_MODE_MODERATED = 1;
export const USER_MODE_CLOSED = 2;

/**
 * User model
 */
export default class UserModel extends BaseModel {
  programs;
  merchant;
  /**
   * Eth wallet
   */
  eth_wallet: string = '';
  time_updated: string = '';
  sums;
  btc_address?: string;
  icontime!: string;
  briefdescription!: string;
  city!: string;
  type!: string;
  name!: string;
  is_admin = false;
  canary = false;
  verified: boolean = false;
  founder: boolean = false;
  rewards: boolean = false;
  last_accepted_tos: number = 0;
  subscriptions_count: number = 0;
  carousels?: Array<any>;
  nsfw: Array<number> = [];
  banned?: string;
  is_mature?: boolean;
  dob?: string;
  liquidity_spot_opt_out?: boolean;
  subscriber: boolean = false;
  supermind_settings?: {
    min_cash?: number;
    min_offchain_tokens?: number;
  };

  tags: Array<string> = [];
  groupsCount: number = 0;
  boosted?: boolean;

  @observable plus: boolean = false;
  plus_method: 'usd' | 'tokens' = 'tokens';

  @observable disable_autoplay_videos?: boolean;
  @observable disabled_boost?: boolean;

  social_profiles?: Array<SocialProfile>;

  /**
   * @var {boolean}
   */
  @observable blocked;

  /**
   * @var {number}
   */
  @observable subscribers_count;

  /**
   * @var {number}
   */
  @observable impressions;

  /**
   * @var {boolean}
   */
  @observable subscribed;

  /**
   * @var {boolean}
   */
  @observable mature_visibility = false;

  /**
   * @var {boolean}
   */
  @observable pending_subscribe = false;

  /**
   * @var {numeric}
   */
  @observable mode = 0;

  /**
   * @var {boolean}
   */
  @observable email_confirmed = false;

  @observable wire_rewards;

  @observable pro: boolean = false;
  pro_method: 'usd' | 'tokens' = 'tokens';

  onchain_booster: number = 0;

  /**
   * LEGACY: remove when the FF minds-3055-email-codes is cleaned up
   * Confirm email
   * @param {Object} params
   */
  confirmEmail = async params => {
    // call any api endpoint with the param
    try {
      await apiService.get('api/v2/entities/', { urn: this.urn, ...params });

      this.setEmailConfirmed(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Confirm email using 2FA flow
   */
  async confirmEmailCode() {
    try {
      await apiService.post('api/v3/email/confirm');
      this.setEmailConfirmed(true);

      // mark as completed without wait for the server
      inFeedNoticesService.markAsCompleted('verify-email');
      // load in feed from server
      inFeedNoticesService.load();

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the user icon time
   */
  getOwnerIcontime(): string {
    if (sessionService.getUser().guid === this.guid) {
      return sessionService.getUser().icontime;
    } else {
      return this.icontime;
    }
  }

  @action
  toggleMatureVisibility() {
    if (GOOGLE_PLAY_STORE) return;
    this.mature_visibility = !this.mature_visibility;
  }

  @action
  toggleSubscription = async (shouldUpdateFeed = false) => {
    const value = !this.subscribed;
    this.subscribed = value;

    try {
      const metadata = this.getClientMetadata();
      await ChannelService.toggleSubscription(this.guid, value, metadata);
      UserModel.events.emit('toggleSubscription', {
        user: this,
        shouldUpdateFeed,
      });
    } catch (err) {
      runInAction(() => {
        this.subscribed = !value;
      });
      throw err;
    }
  };

  @action
  async toggleBlock(value: boolean | null = null) {
    value = value === null ? !this.blocked : value;

    try {
      await ChannelService.toggleBlock(this.guid, value);
      this.blocked = value;
    } catch (err) {
      this.blocked = !value;
      logService.exception('[ChannelStore] toggleBlock', err);
    }
  }

  @action
  setMode(value) {
    this.mode = value;
  }

  @action
  setMature(value) {
    this.mature = value;
  }

  setEmailConfirmed(value) {
    this.email_confirmed = value;
  }

  @action
  setTier(tier: SupportTiersType, type: 'usd' | 'tokens') {
    const wire_rewards = this.wire_rewards;
    if (!wire_rewards.rewards) {
      wire_rewards.rewards = {
        money: [] as SupportTiersType[],
        tokens: [] as SupportTiersType[],
      };
    }
    if (type === 'tokens') {
      if (!wire_rewards.rewards.tokens) {
        wire_rewards.rewards.tokens = [] as SupportTiersType[];
      }
      wire_rewards.rewards.tokens.push(tier);
    } else {
      if (!wire_rewards.rewards.money) {
        wire_rewards.rewards.money = [] as SupportTiersType[];
      }
      wire_rewards.rewards.money.push(tier);
    }
    this.wire_rewards = wire_rewards;
  }

  @action
  togglePro() {
    this.pro = !this.pro;
  }

  @action
  togglePlus() {
    this.plus = !this.plus;
  }

  /**
   * Is admin
   */
  isAdmin() {
    return this.is_admin;
  }

  /**
   * current user is owner of the channel
   */
  isOwner = () => {
    return sessionService.getUser().guid === this.guid;
  };

  /**
   * Returns true if the channel is NSFW/mature
   */
  isNSFW(): boolean {
    return (this.nsfw && this.nsfw.length > 0) || Boolean(this.is_mature);
  }

  /**
   * Returns if the images for this channel should be masked (NSFW)
   */
  shouldShowMaskNSFW(): boolean {
    return (
      this.isNSFW() &&
      !sessionService.getUser().mature &&
      !this.isOwner() &&
      !this.mature_visibility
    );
  }

  /**
   * Get banner source
   */
  getBannerSource() {
    if (this.carousels && this.carousels[0]) {
      return {
        uri: this.carousels[0].src + this.icontime,
        headers: api.buildHeaders(),
      };
    }
    return {
      uri: `${MINDS_CDN_URI}fs/v1/banners/${this.guid}/fat/${this.icontime}`,
      headers: api.buildHeaders(),
    };
  }

  /**
   * Get avatar source
   * @param {string} size
   */
  getAvatarSource(size = 'medium'): AvatarSource {
    return {
      uri: `${MINDS_CDN_URI}icon/${this.guid}/${size}/${this.icontime}`,
      headers: api.buildHeaders(),
    };
  }

  /**
   * Has banner
   * @returns {boolean}
   */
  hasBanner() {
    return !!this.carousels;
  }

  /**
   * Is closed
   * @returns {boolean}
   */
  isClosed() {
    return this.mode === USER_MODE_CLOSED;
  }

  /**
   * Is open
   * @returns {boolean}
   */
  isOpen() {
    return this.mode === USER_MODE_OPEN;
  }

  /**
   * Is moderated
   * @returns {boolean}
   */
  isModerated() {
    return this.mode === USER_MODE_MODERATED;
  }

  /**
   * Is subscribed
   * @returns {boolean}
   */
  isSubscribed() {
    return !!this.subscribed;
  }

  /**
   * Has avatar
   */
  hasAvatar(): boolean {
    return this.icontime !== this.time_created;
  }

  /**
   * Request subscribe
   */
  async subscribeRequest() {
    if (this.pending_subscribe || this.mode !== USER_MODE_CLOSED) {
      return;
    }
    try {
      this.pending_subscribe = true;
      await apiService.put(`api/v2/subscriptions/outgoing/${this.guid}`);
    } catch (err) {
      this.pending_subscribe = false;
      logService.exception(err);
    }
  }

  /**
   * Cancel subscribe request
   */
  async cancelSubscribeRequest() {
    if (!this.pending_subscribe || this.mode !== USER_MODE_CLOSED) {
      return;
    }
    try {
      this.pending_subscribe = false;
      await apiService.delete(`api/v2/subscriptions/outgoing/${this.guid}`);
    } catch (err) {
      this.pending_subscribe = true;
      logService.exception(err);
    }
  }

  /**
   * Toggle disable_autoplay_videos property
   */
  @action
  toggleDisableAutoplayVideos() {
    this.disable_autoplay_videos = !this.disable_autoplay_videos;
    this.saveDisableAutoplayVideosSetting();
  }

  /**
   * Toggle disabled_boost property
   */
  @action
  toggleDisabledBoost(value: boolean) {
    this.disabled_boost = value;
  }

  /**
   * Save disable_autoplay_videos setting or restore property on error
   */
  @action
  async saveDisableAutoplayVideosSetting() {
    try {
      await settingsService.submitSettings({
        disable_autoplay_videos: this.disable_autoplay_videos,
      });
      showNotification(i18n.t('settings.autoplay.saved'), 'info');
    } catch (err) {
      this.disable_autoplay_videos = !this.disable_autoplay_videos;
      throw new UserError(err, 'danger');
    }
  }

  @action
  setLiquiditySpotOptOut(liquidity_spot_opt_out: boolean) {
    this.liquidity_spot_opt_out = liquidity_spot_opt_out;
  }
}

export type AvatarSource = {
  uri: string;
  headers?: any;
};

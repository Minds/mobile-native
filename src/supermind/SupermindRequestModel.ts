import moment from 'moment-timezone';

import BaseModel from '~/common/BaseModel';
import abbrev from '~/common/helpers/abbrev';
import apiService from '~/common/services/api.service';
import ActivityModel from '~/newsfeed/ActivityModel';
import { showNotification } from '~/../AppMessages';
import {
  SupermindRequestPaymentMethod,
  SupermindRequestReplyType,
  SupermindRequestStatus,
} from './types';
import i18nService from '~/common/services/i18n.service';
import { action, observable } from 'mobx';
import UserModel from '~/channel/UserModel';

/**
 * Supermind request model
 */
export default class SupermindRequestModel extends BaseModel {
  guid: string = '';
  activity_guid: string = '';
  sender_guid: string = '';
  receiver_guid: string = '';
  @observable status: SupermindRequestStatus = 0;
  payment_amount: number = 0;
  payment_method: SupermindRequestPaymentMethod = 0;
  payment_txid?: string;
  created_timestamp!: number;
  expiry_threshold: number = 7 * 86400;
  updated_timestamp?: number;
  twitter_required: boolean = false;
  reply_type: SupermindRequestReplyType = 0;
  entity!: ActivityModel;

  /**
   * Receiver channel (populated only for outbound)
   */
  receiver_entity: null | UserModel = null;

  /**
   * Used to indicate that a request is in progress
   * 0: not loading
   * 1: reject
   * 2: revoke
   */
  @observable isLoading: 0 | 1 | 2 = 0;

  /**
   * Child models
   */
  childModels(): any {
    return {
      entity: ActivityModel,
    };
  }

  /**
   * Returns the formatted amount
   */
  get formattedAmount() {
    if (this.payment_method === SupermindRequestPaymentMethod.CASH) {
      return `$${abbrev(this.payment_amount, 2)}`;
    } else {
      return `${abbrev(this.payment_amount, 2)} token`;
    }
  }

  /**
   * Returns the humanized difference
   */
  get formattedExpiration() {
    const now = moment((this.created_timestamp + this.expiry_threshold) * 1000);
    const date = moment(this.created_timestamp * 1000);
    const diff = moment.duration(date.diff(now));
    return diff.humanize();
  }

  @action
  async revoke() {
    try {
      this.isLoading = 2;
      await apiService.delete(`api/v3/supermind/${this.guid}`);
      showNotification(i18nService.t('supermind.revoked'));
    } catch (error) {
      showNotification(i18nService.t('errorMessage'));
    } finally {
      this.isLoading = 0;
    }
  }

  @action
  async reject() {
    try {
      this.isLoading = 1;
      await apiService.post(`api/v3/supermind/${this.guid}/reject`);
      this.status = SupermindRequestStatus.REJECTED;
      showNotification(i18nService.t('supermind.rejected'));
    } catch (error) {
      showNotification(i18nService.t('errorMessage'));
    } finally {
      this.isLoading = 0;
    }
  }
}

import BaseModel from '~/common/BaseModel';
import { action, extendObservable } from 'mobx';
import logService from '~/common/services/log.service';
import {
  acceptBoost,
  rejectBoost,
  revokeBoost,
} from '../boost-console/boost-console.api';
import { showNotification } from 'AppMessages';
import i18n from '~/common/services/i18n.service';
import UserModel from '../../../channel/UserModel';

/**
 * User model
 */
export default class BoostModel extends BaseModel {
  destination!: UserModel;
  impressions?: number;
  bidType!: string;
  currency!: 'tokens' | 'onchain' | 'cash';
  bid!: number;
  scheduledTs?: number;
  state?: 'rejected' | 'accepted' | 'revoked' | 'completed' | 'created';
  rejection_reason?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 12 | 13 | 14;
  entity?: any;

  constructor() {
    super();
    extendObservable(this, {
      state: this.state,
    });
  }

  @action
  async reject() {
    try {
      await rejectBoost(this.guid);
      this.state = 'rejected';
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async accept() {
    try {
      await acceptBoost(this.guid);
      this.state = 'accepted';
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  @action
  async revoke() {
    try {
      await revokeBoost(this.guid);
      this.state = 'revoked';
      showNotification(i18n.t('notification.boostRevoked'), 'success');
    } catch (err) {
      logService.exception('[BaseModel]', err);
      throw err;
    }
  }

  /**
   * Child models
   */
  childModels() {
    return {
      ownerObj: UserModel,
      destination: UserModel,
    };
  }
}

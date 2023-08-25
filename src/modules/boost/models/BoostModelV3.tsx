import { showNotification } from 'AppMessages';
import { action, extendObservable } from 'mobx';
import BaseModel from '~/common/BaseModel';
import i18n from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import UserModel from '../../../channel/UserModel';
import ActivityModel from '../../../newsfeed/ActivityModel';
import { revokeBoost } from '../boost-console/boost-console.api';
import {
  BoostPaymentMethod,
  BoostRejectionReason,
  BoostStatus,
  BoostTargetLocation,
  BoostTargetSuitability,
} from '../boost-console/types/BoostConsoleBoost';
import { BoostButtonText, BoostGoal } from '../boost-composer/boost.store';

/**
 * User model
 */
export default class BoostModel extends BaseModel {
  approved_timestamp?: number | null;
  boost_status!: BoostStatus;
  created_timestamp!: number;
  daily_bid!: number;
  duration_days!: number;
  rowKey!: string;
  entity?: ActivityModel;
  entity_guid!: string;
  payment_amount!: number;
  payment_method!: BoostPaymentMethod;
  target_location!: BoostTargetLocation;
  target_suitability!: BoostTargetSuitability;
  updated_timestamp?: number | null;
  rejection_reason?: BoostRejectionReason;
  goal?: BoostGoal;
  goal_button_text?: BoostButtonText;
  goal_button_url?: string;
  summary?: {
    views_delivered: number;
    total_clicks?: number;
  };

  constructor() {
    super();
    extendObservable(this, {
      boost_status: this.boost_status,
    });
  }

  @action
  async revoke() {
    try {
      await revokeBoost(this.guid);
      this.boost_status = BoostStatus.REFUND_IN_PROGRESS;
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

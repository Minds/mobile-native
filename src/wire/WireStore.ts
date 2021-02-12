import { observable, action } from 'mobx';

import wireService from './WireService';
import i18n from '../common/services/i18n.service';
import UserModel from '../channel/UserModel';

import type { Currency } from './WireTypes';
import type { WCStore } from '../blockchain/v2/walletconnect/WalletConnectContext';

/**
 * Wire store
 */
class WireStore {
  @observable currency: Currency = 'tokens';
  @observable amount: number = 1;
  @observable sending: boolean = false;
  @observable.shallow owner?: UserModel;
  @observable recurring: boolean = false;
  @observable showBtc: boolean = false;
  @observable showCardselector: boolean = false;
  @observable loaded: boolean = false;
  @observable offchain: boolean = true;
  @observable errors: Array<string> = [];
  @observable paymentMethodId: string = '';
  guid: string | null = null;

  @action
  setShowBtc = (value: boolean) => {
    this.showBtc = value;
  };

  @action
  setTokenType(value: boolean) {
    this.offchain = value;
    // disable recurring for onchain
    if (!value) {
      this.recurring = false;
    }
  }

  @action
  setShowCardselector = (value: boolean) => {
    this.paymentMethodId = '';
    this.showCardselector = value;
  };

  setPaymentMethodId(value: string) {
    this.paymentMethodId = value;
  }

  @action
  setCurrency = (value: Currency) => {
    this.currency = value;

    // only tokens and usd can be recurring
    if (this.currency !== 'tokens' && this.currency !== 'usd') {
      this.recurring = false;
    }
    this.validate();
  };

  @action
  setAmount(val: number) {
    this.amount = val;
    this.validate();
  }

  @action
  setTier = (tier: any) => {
    this.amount = tier.amount;
    if (tier.currency) {
      this.setCurrency(tier.currency);
    } else {
      this.validate();
    }
  };

  @action
  setOwner(owner: any) {
    this.owner = owner;
    this.guid = owner ? owner.guid || owner.entity_guid : null;
  }

  async loadUserRewards(): Promise<UserModel | null> {
    if (!this.owner || !this.owner.guid) return null;
    const owner = await wireService.userRewards(this.owner.guid);
    const { merchant, eth_wallet, wire_rewards, sums } = owner;

    if (this.owner) {
      this.owner.merchant = merchant;
      this.owner.eth_wallet = eth_wallet;
      this.owner.wire_rewards = wire_rewards;
      this.owner.sums = sums;
    }

    this.setLoaded(true);

    return owner;
  }

  @action
  setLoaded(value: boolean) {
    this.loaded = value;
  }

  round(number: number, precision: number): number {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  /**
   * Get formated amount
   */
  formatAmount(amount: number): string {
    return amount.toLocaleString('en-US') + ' ' + this.currency;
  }

  /**
   * Validate payment
   */
  @action
  validate() {
    this.errors = [];

    switch (this.currency) {
      case 'btc':
        if (this.owner && !this.owner.btc_address) {
          this.errors.push(i18n.t('wire.noAddress', { type: 'Bitcoin' }));
        }
        break;
      case 'eth':
        if (this.owner && !this.owner.eth_wallet) {
          this.errors.push(i18n.t('wire.noAddress', { type: 'ETH' }));
        }
        break;
      case 'usd':
        if (
          this.owner &&
          (!this.owner.merchant || this.owner.merchant.service !== 'stripe')
        ) {
          this.errors.push(i18n.t('wire.noAddress', { type: 'USD' }));
        }
        break;
    }

    if (this.amount <= 0) {
      this.errors.push(i18n.t('boosts.errorAmountSholdbePositive'));
    }
  }

  @action
  setRecurring(recurring: boolean) {
    this.recurring = !!recurring;
  }

  @action
  toggleRecurring() {
    this.recurring = !this.recurring;
  }

  /**
   * Confirm and Send wire
   */
  @action
  async send(wc?: WCStore): Promise<any> {
    if (this.sending) {
      return;
    }

    let done;

    // for btc we only show the btc component
    if (this.currency === 'btc') {
      return this.setShowBtc(true);
    }

    try {
      this.sending = true;

      if (this.guid && this.owner) {
        done = await wireService.send(
          {
            amount: this.amount,
            guid: this.guid,
            owner: this.owner,
            recurring: this.recurring,
            currency: this.currency,
            offchain: this.offchain,
            paymentMethodId: this.paymentMethodId,
          },
          wc,
        );
      }
      this.stopSending();
    } catch (e) {
      console.log(e);
      this.stopSending();
      throw e;
    }

    return done;
  }

  @action
  stopSending() {
    this.sending = false;
  }

  @action
  reset() {
    this.paymentMethodId = '';
    this.guid = '';
    this.amount = 1;
    this.showBtc = false;
    this.showCardselector = false;
    this.currency = 'tokens';
    this.sending = false;
    this.owner = undefined;
    this.recurring = false;
    this.loaded = false;
    this.errors = [];
  }
}

export default WireStore;

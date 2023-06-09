import { Platform } from 'react-native';
import web3Util from 'web3-utils';

import { showNotification } from '../../../AppMessages';
import type UserModel from '../../channel/UserModel';
import apiService from '../../common/services/api.service';
import i18n from '../../common/services/i18n.service';
import { ONCHAIN_ENABLED } from '../../config/Config';
import NavigationService from '../../navigation/NavigationService';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { Wallet, WalletCurrency } from '../../wallet/v2/WalletTypes';

export type BoostType = 'channel' | 'post' | 'offer';
export type Payment = 'tokens' | 'onchain' | 'cash';

const createBoostStore = ({
  wallet,
  entity,
  boostType,
}: {
  wallet: Wallet;
  entity: UserModel | ActivityModel;
  boostType?: BoostType;
}) => {
  const store = {
    boostType: boostType ?? ('post' as BoostType),
    loading: false,
    nonRefundableAccepted: false,
    nonRefundableError: false,
    payment: Platform.select({
      ios: 'tokens',
      default: 'cash',
    }) as 'tokens' | 'onchain' | 'cash',
    boostOfferTarget: null as UserModel | null,
    selectedPaymentMethod: wallet.offchain as WalletCurrency,
    selectedCardId: undefined as string | undefined,
    amountViews: '1000',
    amountTokens: '1',
    target: null,
    scheduleTs: null,
    postToFacebook: false,
    inProgress: false,
    error: '',
    rates: {
      balance: null,
      rate: 1,
      min: 250,
      cap: 5000,
      onchain: 1000,
      tokens: 1000,
      minUsd: 1,
      priority: 1,
    },
    isSearchingTarget: false,
    allowedTypes: {},
    toggleNonRefundable() {
      this.nonRefundableError = false;
      this.nonRefundableAccepted = !this.nonRefundableAccepted;
    },
    setAmountViews(value: string) {
      this.amountViews = value;
      const aV = parseFloat(this.amountViews);
      if (!isNaN(aV)) {
        if (this.payment === 'tokens') {
          this.amountTokens = (aV / this.rates.tokens).toString();
        } else {
          this.amountTokens = (aV / this.rates.onchain).toString();
        }
      }
    },
    setAmountTokens(value: string) {
      this.amountTokens = value;
      const aT = parseFloat(this.amountTokens);
      if (!isNaN(aT)) {
        if (this.payment === 'tokens') {
          this.amountViews = (aT * this.rates.tokens).toString();
        } else {
          this.amountViews = (aT * this.rates.onchain).toString();
        }
      }
    },
    setBoostType(value: BoostType) {
      this.boostType = value;
    },
    get paymentMethods() {
      return ONCHAIN_ENABLED
        ? [wallet.onchain, wallet.offchain]
        : [wallet.offchain];
    },
    get buttonText() {
      switch (this.boostType) {
        case 'channel':
          return i18n.t('boosts.boostChannel');
        case 'post':
          return i18n.t('boosts.boostPost');
        case 'offer':
          return i18n.t('boosts.boostOffer');
      }
    },
    setPayment(payment: Payment) {
      this.payment = payment;
    },
    setPaymentMethod(walletCurrency: WalletCurrency) {
      this.payment =
        walletCurrency.label === 'Off-chain' ? 'tokens' : 'onchain';
      this.selectedPaymentMethod = walletCurrency;
    },
    getMethodKey(walletCurrency: WalletCurrency) {
      return walletCurrency.label;
    },
    setBoostOfferTarget(target: UserModel) {
      this.boostOfferTarget = target;
    },
    async prepare() {
      const { guid, checksum } =
        <any>await apiService.get(`api/v2/boost/prepare/${entity.guid}`) || {};

      if (!guid) {
        throw new Error(i18n.t('boosts.errorCanNotGenerate'));
      }

      return { guid, checksum };
    },
    async buildPaymentMethod() {
      switch (this.payment) {
        case 'cash':
          return {
            method: 'cash',
            payment_method_id: this.selectedCardId,
          };
        case 'onchain':
          if (!this.boostOfferTarget?.eth_wallet) {
            throw new Error('This user does not have an on-chain account');
          }

          return {
            method: 'onchain',
            txHash: undefined,
            address: undefined,
          };
        case 'tokens':
          return {
            method: 'offchain',
            address: 'offchain',
          };
      }
    },
    get endpoint() {
      if (this.boostType === 'post') {
        const type = 'type' in entity && entity.type ? entity.type : 'activity';
        return `api/v2/boost/${type}/${entity.guid}/${entity.owner_guid}`;
      } else {
        return `api/v2/boost/user/${entity.guid}/0`;
      }
    },
    async boostPostOrChannel({ guid, checksum }) {
      try {
        await apiService.post(this.endpoint, {
          guid,
          bidType: this.payment === 'cash' ? 'cash' : 'tokens',
          impressions: this.amountViews,
          paymentMethod: await this.buildPaymentMethod(),
          checksum,
        });
        this.loading = false;
      } catch (err) {
        throw err;
      }
    },
    async boostOffer({ guid, checksum }) {
      try {
        const amount = web3Util
          .toWei(`${this.amountTokens}`, 'ether')
          .toString();
        await apiService.post(
          `api/v2/boost/peer/${entity.guid}/${entity.owner_guid}`,
          {
            guid,
            currency: 'tokens',
            paymentMethod: await this.buildPaymentMethod(),
            bid: amount,
            destination: this.boostOfferTarget?.guid,
            scheduleTs: this.scheduleTs,
            postToFacebook: this.postToFacebook ? 1 : null,
            checksum,
          },
        );
        this.loading = false;
      } catch (err) {
        throw err;
      }
    },
    async makeBoost() {
      if (!this.validateRequest()) {
        return;
      }

      try {
        this.loading = true;
        const response = await this.prepare();
        switch (this.boostType) {
          case 'channel':
          case 'post':
            await this.boostPostOrChannel(response);
            break;
          case 'offer':
            await this.boostOffer(response);
            break;
        }
        NavigationService.goBack();
      } catch (err) {
        if (err instanceof Error) {
          showNotification(err.message, 'danger');
        }
      } finally {
        this.loading = false;
      }
    },
    validateRequest() {
      if (this.payment === 'cash' && !this.selectedCardId) {
        // TODO: show a toast
        return false;
      }

      return true;
    },
    boost() {
      if (this.payment === 'cash' && !this.nonRefundableAccepted) {
        this.nonRefundableError = true;
        return;
      }
      this.makeBoost();
    },
    setSelectedCardId(cardId: string) {
      this.selectedCardId = cardId;
    },
  };
  return store;
};

export type BoostStoreType = ReturnType<typeof createBoostStore>;
export default createBoostStore;

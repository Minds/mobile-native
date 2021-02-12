import web3Util from 'web3-utils';

import { showNotification } from '../../../AppMessages';
import BlockchainBoostService from '../../blockchain/v2/services/BlockchainBoostService';
import { WCStore } from '../../blockchain/v2/walletconnect/WalletConnectContext';
import type UserModel from '../../channel/UserModel';
import apiService from '../../common/services/api.service';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { Wallet, WalletCurrency } from '../../wallet/v2/WalletTypes';

export type boostType = 'channel' | 'post' | 'offer';

const createBoostStore = ({
  wc,
  wallet,
  entity,
}: {
  wc: WCStore;
  wallet: Wallet;
  entity: UserModel | ActivityModel;
}) => {
  const store = {
    boostType: 'channel' as boostType,
    loading: false,
    payment: 'tokens' as 'tokens' | 'onchain',
    boostOfferTarget: null as UserModel | null,
    selectedPaymentMethod: wallet.offchain as WalletCurrency,
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
    setBoostType(value: boostType) {
      this.boostType = value;
    },
    get paymentMethods() {
      return [wallet.onchain, wallet.offchain];
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
    async buildPaymentMethod(guid, checksum) {
      if (this.payment === 'onchain') {
        try {
          await wc.connect();
        } catch (error) {
          throw new Error('Connect your wallet first');
        }
        if (!wc.web3 || !wc.address) {
          throw new Error('Connect your wallet first');
        }

        if (!this.boostOfferTarget?.eth_wallet) {
          throw new Error('This user does not have an on-chain account');
        }

        const boostService = new BlockchainBoostService(wc.web3, wc);
        return {
          method: 'onchain',
          txHash:
            this.boostType !== 'offer'
              ? await boostService.create(
                  guid,
                  this.amountTokens,
                  checksum,
                  wc.address,
                )
              : await boostService.createPeer(
                  this.boostOfferTarget?.eth_wallet,
                  guid,
                  this.amountTokens,
                  checksum,
                  wc.address,
                ),
          address: wc.address,
        };
      } else {
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
          bidType: 'tokens',
          impressions: this.amountViews,
          paymentMethod: await this.buildPaymentMethod(guid, checksum),
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
            paymentMethod: await this.buildPaymentMethod(guid, checksum),
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
      try {
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
        showNotification(err.message, 'danger');
      } finally {
        this.loading = false;
      }
    },
    boost() {
      this.makeBoost();
      this.loading = true;
    },
  };
  return store;
};

export type BoostStoreType = ReturnType<typeof createBoostStore>;
export default createBoostStore;

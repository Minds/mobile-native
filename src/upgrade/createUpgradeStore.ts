import { IS_FROM_STORE } from '~/config/Config';
import type UserModel from '../channel/UserModel';
import entitiesService from '../common/services/entities.service';
import mindsConfigService from '../common/services/minds-config.service';
import {
  SubscriptionType,
  PayMethodType,
  PaymentPlanType,
  SettingsSubscriptionsType,
} from './types';

// TODO: move to the backend
const IAP_SKUS_PLUS = {
  monthly: 'plus.monthly.001',
  yearly: 'plus.yearly.001',
};
const IAP_SKUS_PRO = {
  monthly: 'pro.monthly.001',
};

const createUpgradeStore = () => {
  return {
    loaded: false,
    method: 'tokens' as PayMethodType,
    settings: null as null | SettingsSubscriptionsType,
    plansTokens: [] as Array<PaymentPlanType>,
    plansUSD: [] as Array<PaymentPlanType>,
    monthly: false,
    owner: {} as UserModel,
    selectedOption: {} as PaymentPlanType,
    isPro: false,
    generatePaymentPlans() {
      for (const key in this.settings) {
        const current = this.settings[key];
        // yearly and monthly are disabled for tokens
        if (current.tokens && !['yearly', 'monthly'].includes(key)) {
          this.plansTokens.push({
            id: key as SubscriptionType,
            cost: current.tokens,
            can_have_trial: Boolean(current.can_have_trial),
          });
        }
        if (current.usd) {
          const skus = this.isPro ? IAP_SKUS_PRO : IAP_SKUS_PLUS;

          // for store apps only show options with SKUs (in-app purchase)
          if (!IS_FROM_STORE || skus[key]) {
            this.plansUSD.push({
              id: key as SubscriptionType,
              cost: current.usd,
              iapSku: skus[key] || '',
              can_have_trial: Boolean(current.can_have_trial),
            });
          }
        }
      }
    },
    get canHaveTrial(): boolean {
      return this.method === 'usd' && this.selectedOption.can_have_trial;
    },
    init(pro: boolean = false) {
      this.getSettings(pro);
    },
    setMonthly(monthly: boolean) {
      this.monthly = monthly;
    },

    async getSettings(pro: boolean) {
      if (this.loaded) return;

      // update the settings
      await mindsConfigService.update();

      const settings = mindsConfigService.getSettings();

      this.settings = (
        pro ? settings.upgrades.pro : settings.upgrades.plus
      ) as SettingsSubscriptionsType;

      // used to pay plus by wire
      const handler = pro ? settings.handlers.pro : settings.handlers.plus;

      this.owner = (await entitiesService.single(
        `urn:user:${handler}`,
      )) as UserModel;

      this.isPro = pro;

      this.generatePaymentPlans();
      this.selectedOption = this.plansTokens[0];

      this.loaded = true;
    },
    toogleMethod() {
      this.method = this.method === 'usd' ? 'tokens' : 'usd';
      this.selectedOption =
        this.method !== 'usd' ? this.plansTokens[0] : this.plansUSD[0];
    },
    setSettings(settings) {
      this.settings = settings;
    },
    setSelectedOption(option: PaymentPlanType) {
      this.selectedOption = option;
    },
  };
};

export default createUpgradeStore;

export type UpgradeStoreType = ReturnType<typeof createUpgradeStore>;

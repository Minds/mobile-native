import type UserModel from '../channel/UserModel';
import entitiesService from '../common/services/entities.service';
import mindsService from '../common/services/minds.service';
import WireStore from '../wire/WireStore';
import { PaymentPlan, payMethod, UpgradePlans } from './types';

const createUpgradeStore = () => {
  const store = {
    wire: new WireStore(),
    loaded: false,
    loading: false,
    method: 'tokens' as payMethod,
    card: '' as any,
    settings: false as boolean | any,
    monthly: false,
    owner: {} as UserModel,
    usdAmount: 0,
    tokensAmount: 0,
    selectedOption: {} as PaymentPlan,
    isPro: false,
    paymentPlans: {
      pro: {
        tokens: [
          {
            id: 'lifetime',
            payment: 'Lifetime membership',
            cost: 20000,
            primarylabel: (monthly, total) => `Lifetime membership · ${total}`,
            secondarylabel: (monthly, total) => `MINDS`,
          },
        ],
        usd: [
          {
            id: 'monthly',
            cost: 50,
            primarylabel: (monthly, total) => `Monthly · $${total}`,
            secondarylabel: (monthly, total) => `/ month`,
          },
          {
            id: 'annual',
            cost: 480,
            primarylabel: (monthly, total) => `Annually · $${monthly}`,
            secondarylabel: (monthly, total) =>
              `/ month (billed annually $${total})`,
          },
        ],
      },
      plus: {
        tokens: [
          {
            id: 'lifetime',
            payment: 'Lifetime membership',
            cost: 2500,
            primarylabel: (monthly, total) => `Lifetime membership · ${total}`,
            secondarylabel: (monthly, total) => `MINDS`,
          },
        ],
        usd: [
          {
            id: 'monthly',
            cost: 7,
            primarylabel: (monthly, total) => `Monthly · $${total}`,
            secondarylabel: (monthly, total) => `/ month`,
          },
          {
            id: 'annual',
            cost: 60,
            primarylabel: (monthly, total) => `Annually · $${monthly}`,
            secondarylabel: (monthly, total) =>
              `/ month (billed annually $${total})`,
          },
        ],
      },
    } as UpgradePlans,
    get canHaveTrial(): boolean {
      return this.method === 'usd' && this.settings.yearly.can_have_trial;
    },
    init(pro: boolean = false) {
      this.getSettings(pro);
    },
    setMonthly(monthly: boolean) {
      this.monthly = monthly;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    async getSettings(pro: boolean) {
      // update the settings
      await mindsService.update();
      // used to get costs for plus
      this.settings = pro
        ? (await mindsService.getSettings()).upgrades.pro
        : (await mindsService.getSettings()).upgrades.plus;

      // used to pay plus by wire
      const handler = pro
        ? mindsService.settings.handlers.pro
        : mindsService.settings.handlers.plus;

      this.owner = (await entitiesService.single(
        `urn:entity:${handler}`,
      )) as UserModel;

      this.method = 'tokens';

      this.isPro = pro;

      const plans = this.isPro ? this.paymentPlans.pro : this.paymentPlans.plus;
      this.selectedOption = plans.tokens[0];

      this.loaded = true;
    },
    setMethod() {
      this.method = this.method === 'usd' ? 'tokens' : 'usd';
      const plans = this.isPro ? this.paymentPlans.pro : this.paymentPlans.plus;
      this.selectedOption =
        this.method === 'usd' ? plans.usd[0] : plans.tokens[0];
    },
    setCard(card: any) {
      this.card = card;
    },
    setSettings(settings) {
      this.settings = settings;
    },
    get amount() {
      return this.method === 'usd' ? this.usdAmount : this.tokensAmount;
    },
    setSelectedOption(option: PaymentPlan) {
      this.selectedOption = option;
    },
  };
  return store;
};

export default createUpgradeStore;

export type UpgradeStoreType = ReturnType<typeof createUpgradeStore>;

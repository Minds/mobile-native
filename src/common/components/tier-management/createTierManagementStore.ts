import { SupportTiersType } from '../../../wire/WireTypes';

const createTierManagementStore = () => {
  const store = {
    loaded: false,
    support_tiers: [] as SupportTiersType[],
    setSupportTIers(support_tiers: SupportTiersType[]) {
      this.support_tiers = support_tiers;
      this.loaded = true;
    },
    addTier(support_tier: SupportTiersType) {
      this.support_tiers.push(support_tier);
    },
    removeTier(support_tier: SupportTiersType) {
      this.support_tiers = this.support_tiers.filter(
        tier => tier.urn !== support_tier.urn,
      );
    },
  };
  return store;
};

export default createTierManagementStore;

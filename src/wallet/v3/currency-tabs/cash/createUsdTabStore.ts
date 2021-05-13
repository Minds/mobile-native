import { UsdOptions } from '../../../v2/WalletTypes';

const createUsdTabStore = () => ({
  option: 'settings' as UsdOptions,
  showTooltip: false,
  setOption(option: UsdOptions) {
    this.option = option;
  },
  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  },
});

export default createUsdTabStore;

export type UsdTabStore = ReturnType<typeof createUsdTabStore>;

const createLocalStore = () => ({
  showUniswapWidget: false,
  tokenAddress: '',
  toggleUniswapWidget() {
    this.showUniswapWidget = !this.showUniswapWidget;
  },
  setTokenAddress(address: string) {
    this.tokenAddress = address;
  },
});

export type EarnStoreType = ReturnType<typeof createLocalStore>;
export default createLocalStore;

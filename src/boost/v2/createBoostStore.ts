const createBoostStore = () => {
  const store = {
    type: null,
    payment: 'tokens' as 'tokens' | 'onchain',
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
  };
  return store;
};

export type BoostStoreType = ReturnType<typeof createBoostStore>;
export default createBoostStore;

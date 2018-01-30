class NavigationStoreService {
  navigationStore;

  set(navigationStore) {
    this.navigationStore = navigationStore;
  }

  get() {
    if (!this.navigationStore) {
      throw new Error('Navigation Store not yet injected');
    }

    return this.navigationStore;
  }
}

export default new NavigationStoreService();

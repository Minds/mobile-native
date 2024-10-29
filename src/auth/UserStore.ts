import { observable, action } from 'mobx';

import UserModel from './../channel/UserModel';
import serviceProvider from '~/services/serviceProvider';

/**
 * Login Store
 */
class UserStore {
  @observable me: UserModel;
  @observable searching = false;

  constructor() {
    this.me = UserModel.create({});
  }

  @action
  setUser(user: { guid?: string }): void {
    if (!user || !user.guid) {
      return;
    }
    this.me = UserModel.create(user);
  }

  @action
  setRewards(value: boolean) {
    this.me.rewards = value;
  }

  @action
  setWallet(value) {
    this.me.eth_wallet = value;
  }

  @action
  setTosLastUpdate(value) {
    this.me.last_accepted_tos = value;
  }

  hasRewards() {
    return !!(this.me && this.me.rewards);
  }

  hasEthWallet() {
    return !!(this.me && this.me.eth_wallet);
  }

  hasAvatar() {
    return this.me.icontime !== this.me.time_created;
  }

  @action
  clearUser() {
    this.me = UserModel.create({});
  }

  @action
  async load(refresh = false) {
    if (!refresh) {
      this.clearUser();
    }

    let response: any = await serviceProvider.resolve('channel').load('me');

    this.setUser(response.channel);

    return this.me;
  }

  isAdmin() {
    return this.me.isAdmin();
  }

  reset() {
    this.clearUser();
  }

  @action
  toggleSearching = () => {
    this.searching = !this.searching;
  };

  /**
   * Call onItemTap
   */
  searchBarItemTap(item: UserModel | string) {
    if (item instanceof UserModel) {
      const user = { user: item.toPlainObject() };
      this.searchBarService.onItemTap(user);
    } else {
      this.searchBarService.onItemTap(item);
    }
  }

  /**
   * Clear search history for user
   */
  searchBarClearHistory() {
    this.searchBarService.clearSearchHistory();
  }

  /**
   * Get user search history
   */
  getSearchHistory() {
    return this.searchBarService.getSearchHistory();
  }

  /**
   * Get suggested Search
   * @param {String} search
   */
  async getSuggestedSearch(search) {
    return await this.searchBarService.getSuggestedSearch(search);
  }

  get searchBarService() {
    return serviceProvider.resolve('searchBar');
  }
}

export default UserStore;

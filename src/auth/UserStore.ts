import { observable, action } from 'mobx';

import channelService from './../channel/ChannelService';
import UserModel from './../channel/UserModel';
import searchBarService from '../topbar/SearchBar.service';

/**
 * Login Store
 */
class UserStore {
  @observable me: UserModel;
  @observable emailConfirmMessageDismiss = false;
  @observable searching = false;
  @observable bannerInfoDismiss = false;
  @observable rewards: any = false;

  constructor() {
    this.me = UserModel.create({});
  }

  /**
   * Dissmis Message Banner
   */
  @action
  setDissmisBanner(value: boolean): void {
    this.bannerInfoDismiss = value;
  }

  @action
  setDissmis(value: boolean): void {
    this.emailConfirmMessageDismiss = value;
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

    let response: any = await channelService.load('me');

    this.setUser(response.channel);

    // Load search history
    searchBarService.init(this.me.guid);

    return this.me;
  }

  isAdmin() {
    return this.me.isAdmin();
  }

  reset() {
    this.clearUser();
  }

  @action
  toggleSearching() {
    this.searching = !this.searching;
  }

  /**
   * Call onItemTap
   */
  searchBarItemTap(item) {
    searchBarService.onItemTap(item.username || item);
  }

  /**
   * Clear search history for user
   */
  searchBarClearHistory() {
    searchBarService.clearSearchHistory();
  }

  /**
   * Get user search history
   */
  async getSearchHistory() {
    return await searchBarService.getSearchHistory();
  }

  /**
   * Get suggested Search
   * @param {String} search
   */
  async getSuggestedSearch(search) {
    return await searchBarService.getSuggestedSearch(search);
  }
}

export default UserStore;

import {
  observable,
  action
} from 'mobx';

import channelService from './../channel/ChannelService';
import sessionService from '../common/services/session.service';
import UserModel from './../channel/UserModel';
import { MINDS_FEATURES } from '../config/Config';
import { Alert } from 'react-native';
import searchBarService from '../topbar/SearchBar.service';

/**
 * Login Store
 */
class UserStore {
  @observable me = {};
  @observable emailConfirmMessageDismiss = false;
  @observable searching = false;

  @action
  setDissmis(value) {
    this.emailConfirmMessageDismiss = value;
  }

  @action
  setUser(user) {
    if (!user || !user.guid)
      return
    this.me = UserModel.create(user);
  }

  @action
  setRewards(value) {
    this.me.rewards = !!value;
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
    this.me = {};
  }

  @action
  async load(refresh = false) {
    if (!refresh) this.me = {};

    let response = await channelService.load('me');

    //if (!response.channel) {
    //  return sessionService.setToken(null);
    //}

    this.setUser(response.channel);

    // Load search history
    searchBarService.init(this.me.guid)

    if (this.me.canCrypto) {
      MINDS_FEATURES.crypto = true;
    }
    return this.me;

  }

  isAdmin() {
    return this.me.isAdmin();
  }

  @action
  reset() {
    this.me = {};
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
    return await searchBarService.getSuggestedSearch(search)
  }
  

}

export default UserStore;

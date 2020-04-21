//@ts-nocheck
import sessionService from '../common/services/session.service';
import storageService from '../common/services/storage.service';
import apiService from '../common/services/api.service';
import UserModel from '../channel/UserModel';

class SearchBarService {
  /**
   * The user search history
   */
  searchHistory;

  /**
   * The key to look in storage
   * composed by user guid
   */
  storageKey;

  init(guid) {
    this.storageKey = `${guid}:searchHistory`;
    this.searchHistory = storageService.getItem(this.storageKey);
  }

  /**
   * Call suggested endpoint
   * @param {String} search
   */
  async getSuggestedSearch(search) {
    const res = await apiService.get('api/v2/search/suggest', {
      q: search,
      limit: 4,
    });
    return UserModel.createMany(res.entities);
  }

  /**
   * Retrieve search history
   */
  async getSearchHistory() {
    this.searchHistory = (await this.searchHistory) || [];
    return this.searchHistory;
  }

  /**
   * Every time an item is tapped on search bar, we stored in search history
   * @param {String} item
   */
  async onItemTap(item) {
    // If item already exists in history, remove it
    const index = this.searchHistory.indexOf(item);
    if (index !== -1) {
      this.searchHistory.splice(index, 1);
    }

    // add item at the begining of history

    if (this.searchHistory.unshift(item) > 5) {
      this.searchHistory.pop();
    }

    await storageService.setItem(this.storageKey, this.searchHistory);
  }

  async clearSearchHistory() {
    this.searchHistory = [];
    await storageService.setItem(this.storageKey, this.searchHistory);
  }
}

export default new SearchBarService();

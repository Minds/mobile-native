import storageService from '../../common/services/storage.service';
import apiService from '../../common/services/api.service';
import UserModel from '../../channel/UserModel';

export type userItem = { user: UserModel };

class SearchBarService {
  /**
   * The user search history
   */
  searchHistory: Array<userItem | string> = [];

  /**
   * The key to look in storage
   * composed by user guid
   */
  storageKey;

  init(guid) {
    this.storageKey = `${guid}:searchHistory`;
  }

  async getSearchHistoryFromStorage() {
    const searchHistory = await storageService.getItem(this.storageKey);
    if (searchHistory && Array.isArray(searchHistory)) {
      this.searchHistory = searchHistory;
    }
  }

  /**
   * Call suggested endpoint
   * @param {String} search
   */
  async getSuggestedSearch(search: string) {
    const res: any = await apiService.get('api/v2/search/suggest', {
      q: search,
      limit: 10,
    });
    return UserModel.createMany(res.entities);
  }

  /**
   * Retrieve search history
   */
  async getSearchHistory() {
    await this.getSearchHistoryFromStorage();
    return this.searchHistory;
  }

  /**
   * Every time an item is tapped on search bar, we store it in search history
   * @param {String} item
   */
  async onItemTap(item: userItem | string) {
    // If item already exists in history, remove it
    const index =
      typeof item === 'string'
        ? this.searchHistory.indexOf(item)
        : this.searchHistory.findIndex(
            (value) =>
              !(typeof value === 'string') &&
              value.user.guid === item.user.guid,
          );

    if (index !== -1) {
      this.searchHistory.splice(index, 1);
    }

    // add item at the begining of history
    if (this.searchHistory.unshift(item) > 15) {
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

import apiService from '../../common/services/api.service';
import UserModel from '../../channel/UserModel';
import { storages } from '../../common/services/storage/storages.service';

export type userItem = { user: UserModel };

const storageKey = 'searchHistory';

class SearchBarService {
  /**
   * The user search history
   */
  searchHistory: Array<userItem | string> = [];

  getSearchHistoryFromStorage() {
    const searchHistory = storages.user?.getMap(storageKey);
    if (searchHistory && Array.isArray(searchHistory)) {
      this.searchHistory = searchHistory;
    }
  }

  /**
   * Call suggested endpoint
   * @param {String} search
   */
  async getSuggestedSearch(search: string, limit = 10) {
    const res: any = await apiService.get('api/v2/search/suggest', {
      q: search,
      limit,
    });
    return UserModel.createMany(res.entities);
  }

  /**
   * Retrieve search history
   */
  getSearchHistory() {
    this.getSearchHistoryFromStorage();
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
            value =>
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

    storages.user?.setMap(storageKey, this.searchHistory);
  }

  async clearSearchHistory() {
    this.searchHistory = [];
    storages.user?.setMap(storageKey, this.searchHistory);
  }
}

export default new SearchBarService();

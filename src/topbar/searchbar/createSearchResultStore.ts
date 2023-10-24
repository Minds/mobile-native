import type UserModel from '../../channel/UserModel';
import type UserStore from '../../auth/UserStore';
import { userItem } from './SearchBar.service';
import NavigationService from '../../navigation/NavigationService';

const createSearchResultStore = () => {
  const store = {
    user: null as UserStore | null,
    search: '',
    loading: false,
    suggested: [] as UserModel[],
    history: [] as Array<userItem | string>,
    searchText: '',

    setSearchText(searchText: string) {
      this.searchText = searchText;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setSuggested(suggested: []) {
      this.suggested = suggested;
    },
    setHistory(history: []) {
      this.history = history;
    },
    async init(user: UserStore) {
      this.user = user;
      this.history = user.getSearchHistory();
    },
    get shouldShowSuggested() {
      return this.search.length > 0;
    },
    async input(search: string) {
      this.setSearchText(search);
      this.search = search;
      if (!search || search.length < 2) {
        this.suggested = [];
        return;
      }
      if (this.shouldShowSuggested && this.user) {
        this.loading = true;
        this.suggested = await this.user.getSuggestedSearch(search);
        this.loading = false;
      }
    },
    searchBarItemTap(item) {
      this.search = '';
      this.user?.toggleSearching();
      this.user?.searchBarItemTap(item);
    },
    setSearchesAndQueryDiscovery(search: string) {
      this.search = search;
      this.searchText = search;
      this.searchDiscovery();
    },
    searchDiscovery() {
      this.search = this.searchText;
      NavigationService.navigate('Discovery', {
        screen: 'DiscoverySearch',
        params: { query: this.search },
      });
      this.searchBarItemTap(this.search);
    },
    reset() {
      this.search = '';
      this.loading = false;
      this.suggested = [];
      this.history = [];
      this.searchText = '';
    },
  };
  return store;
};

export type SearchResultStoreType = ReturnType<typeof createSearchResultStore>;

export default createSearchResultStore;

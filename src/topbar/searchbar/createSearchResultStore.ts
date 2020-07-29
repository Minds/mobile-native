import type UserModel from '../../channel/UserModel';
import type UserStore from '../../auth/UserStore';
import { userItem } from './SearchBar.service';

const createSearchResultStore = ({
  user,
  navigation,
}: {
  user: UserStore;
  navigation: any;
}) => {
  const store = {
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
    async init() {
      this.history = await user.getSearchHistory();
    },
    get shouldShowSuggested() {
      return this.search.length > 0;
    },
    async input(search: string) {
      this.setSearchText(search);
      this.search = search;
      if (this.shouldShowSuggested) {
        this.loading = true;
        this.suggested = await user.getSuggestedSearch(search);
        this.loading = false;
      }
    },
    searchBarItemTap(item) {
      this.search = '';
      user.toggleSearching();
      user.searchBarItemTap(item);
    },
    searchDiscovery() {
      navigation.navigate('DiscoverySearch', { query: this.search });
      this.searchBarItemTap(this.search);
    },
  };
  return store;
};

export type SearchResultStoreType = ReturnType<typeof createSearchResultStore>;

export default createSearchResultStore;

import type UserModel from '../../../channel/UserModel';
import debounce from '../../helpers/debounce';
import logService from '../../services/log.service';
import userTypeaheadService from '../user-typeahead/UserTypeaheadService';
import parseTag from './parseTag';
import selectTag from './selectTag';

const createUserAutocompleteStore = ({ onSelect }) => ({
  text: '',
  selection: {
    start: 0,
    end: 0,
  },
  isSearchingTag: false,
  users: [] as UserModel[],
  tag: '',
  search: false,
  setText(text: string) {
    this.text = text;
  },
  setSelection(selection) {
    this.selection = selection;
  },
  setIsSearchingTag(v: boolean) {
    this.isSearchingTag = v;
  },
  setUsers(users) {
    this.users = users;
  },
  setTag(tag) {
    this.tag = tag;
  },
  setSearch(search) {
    this.search = search;
  },
  async doQuery(query) {
    try {
      const users = await userTypeaheadService.search(query, 6);
      if (users) {
        this.setUsers(users);
      }
      this.setSearch(false);
    } catch (e) {
      logService.exception(e);
    }
  },
  async query(query: string) {
    //@ts-ignore
    debounce(this.doQuery, 300)(query);
  },
  onSelectTag(user: UserModel) {
    selectTag(user.username, this.text, this.selection, onSelect);
    this.close();
  },
  searchSelect(user: UserModel) {
    this.setIsSearchingTag(false);
    this.onSelectTag(user);
  },
  close() {
    this.setIsSearchingTag(false);
  },
  showSearch() {
    this.setIsSearchingTag(true);
  },
  onPropsChanged(text, selection) {
    if (selection.start === selection.end) {
      const tag = parseTag(text, selection);
      if (tag) {
        this.setTag(tag);
        this.setSearch(true);
      }
    } else {
      this.setTag('');
    }
    this.setText(text);
    this.setSelection(selection);

    if (this.tag === null && this.users.length) {
      this.setUsers([]);
      this.close();
    }

    if (this.tag && this.search) {
      this.query(this.tag);
    }
  },
});

export type UserAutoCompleteStore = ReturnType<
  typeof createUserAutocompleteStore
>;
export default createUserAutocompleteStore;
